import Payment from '../models/Payment.js';
import Member from '../models/Member.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';

/* =========================================
   🔐 SAFE RAZORPAY INSTANCE FACTORY
========================================= */
const getRazorpayInstance = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error("Razorpay keys missing in .env file");
  }

  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

/* =========================================
   1️⃣ GET ALL PAYMENTS
========================================= */
export const getPayments = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const payments = await Payment.find(filter)
      .populate('member', 'name phone email')
      .sort({ createdAt: -1 });

    res.status(200).json(payments);
  } catch (error) {
    console.error('Fetch Payments Error:', error);
    res.status(500).json({ message: 'Server Error fetching payments' });
  }
};

/* =========================================
   2️⃣ MANUAL PAYMENT (PARTIAL + PENDING)
========================================= */
export const recordPayment = async (req, res) => {
  try {
    const { memberId, totalAmount, paidAmount, remainingAmount, method } = req.body;

    if (!memberId || totalAmount == null || paidAmount == null) {
      return res.status(400).json({ message: 'Required fields missing' });
    }

    const calculatedRemaining =
      remainingAmount != null
        ? Number(remainingAmount)
        : Number(totalAmount) - Number(paidAmount);

    const status = calculatedRemaining > 0 ? 'Pending' : 'Completed';

    const payment = await Payment.create({
      member: memberId,
      totalAmount: Number(totalAmount),
      paidAmount: Number(paidAmount),
      remainingAmount: calculatedRemaining,
      method: method || 'Manual',
      status
    });

    if (status === 'Completed') {
      await Member.findByIdAndUpdate(memberId, { status: 'Active' });
    } else {
      await Member.findByIdAndUpdate(memberId, { status: 'Pending Payment' });
    }

    res.status(201).json(payment);
  } catch (error) {
    console.error('Record Payment Error:', error);
    res.status(500).json({ message: 'Server error recording payment' });
  }
};

/* =========================================
   3️⃣ GET PENDING DUES (AGGREGATED)
========================================= */
export const getPendingPayments = async (req, res) => {
  try {
    const pipeline = [
      { $match: { status: 'Pending' } },
      {
        $group: {
          _id: '$member',
          totalPending: { $sum: '$remainingAmount' }
        }
      },
      {
        $lookup: {
          from: 'members',
          localField: '_id',
          foreignField: '_id',
          as: 'member'
        }
      },
      { $unwind: '$member' },
      {
        $project: {
          _id: 0,
          memberId: '$_id',
          totalPending: 1,
          'member.name': 1,
          'member.phone': 1,
          'member.email': 1
        }
      }
    ];

    const results = await Payment.aggregate(pipeline);
    res.status(200).json({ success: true, data: results });

  } catch (error) {
    console.error('Pending Payments Error:', error);
    res.status(500).json({ message: 'Server error fetching pending payments' });
  }
};

/* =========================================
   4️⃣ CREATE RAZORPAY ORDER
========================================= */
export const checkout = async (req, res) => {
  try {
    const { amount, memberId } = req.body;

    if (!amount || !memberId) {
      return res.status(400).json({ message: 'Amount and memberId required' });
    }

    const razorpay = getRazorpayInstance();

    const order = await razorpay.orders.create({
      amount: Number(amount) * 100,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: { memberId }
    });

    res.status(200).json({ success: true, order });

  } catch (error) {
    console.error('Razorpay Order Error:', error);
    res.status(500).json({ message: 'Error creating Razorpay order' });
  }
};

/* =========================================
   5️⃣ VERIFY PAYMENT (SECURE)
========================================= */
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      totalAmount,
      paidAmount
    } = req.body;

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Invalid signature' });
    }

    const razorpay = getRazorpayInstance();
    const order = await razorpay.orders.fetch(razorpay_order_id);
    const memberId = order.notes.memberId;

    const remaining = Number(totalAmount) - Number(paidAmount);
    const status = remaining > 0 ? 'Pending' : 'Completed';

    const exists = await Payment.findOne({ transactionId: razorpay_payment_id });
    if (exists) {
      return res.status(200).json({ message: 'Already recorded' });
    }

    const payment = await Payment.create({
      member: memberId,
      totalAmount,
      paidAmount,
      remainingAmount: remaining,
      method: 'Razorpay',
      status,
      transactionId: razorpay_payment_id,
      razorpayOrderId: razorpay_order_id
    });

    if (status === 'Completed') {
      await Member.findByIdAndUpdate(memberId, { status: 'Active' });
    } else {
      await Member.findByIdAndUpdate(memberId, { status: 'Pending Payment' });
    }

    res.status(201).json({ message: 'Payment verified', payment });

  } catch (error) {
    console.error('Verify Payment Error:', error);
    res.status(500).json({ message: 'Server error verifying payment' });
  }
};

/* =========================================
   6️⃣ RAZORPAY WEBHOOK
========================================= */
export const razorpayWebhook = async (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const body = req.body;

    const expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (signature !== expected) {
      return res.status(400).send('Invalid signature');
    }

    const payload = JSON.parse(body.toString());

    if (payload.event === 'payment.captured') {
      const paymentEntity = payload.payload.payment.entity;
      const memberId = paymentEntity.notes.memberId;

      const exists = await Payment.findOne({
        transactionId: paymentEntity.id
      });
      if (exists) return res.status(200).send('Already processed');

      await Payment.create({
        member: memberId,
        totalAmount: paymentEntity.amount / 100,
        paidAmount: paymentEntity.amount / 100,
        remainingAmount: 0,
        method: 'Razorpay',
        status: 'Completed',
        transactionId: paymentEntity.id,
        razorpayOrderId: paymentEntity.order_id
      });

      await Member.findByIdAndUpdate(memberId, { status: 'Active' });
    }

    res.status(200).send('Processed');

  } catch (error) {
    console.error('Webhook Error:', error);
    res.status(500).send('Server error');
  }
};