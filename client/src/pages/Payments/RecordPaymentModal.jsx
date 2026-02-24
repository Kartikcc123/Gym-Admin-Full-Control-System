import { useState, useEffect } from 'react';
import { X, IndianRupee } from 'lucide-react';
import toast from 'react-hot-toast';
import { getAllMembers } from '../../api/memberApi';
import {
  recordPayment,
  createRazorpayOrder,
  verifyRazorpayPayment
} from '../../api/paymentApi';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const RecordPaymentModal = ({
  isOpen,
  onClose,
  onSuccess,
  initialMemberId = '',
  initialAmount = ''
}) => {
  const [members, setMembers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    memberId: '',
    totalAmount: '',
    paidAmount: '',
    method: 'Razorpay Online',
    status: 'Completed'
  });

  const remainingAmount =
    Number(formData.totalAmount || 0) - Number(formData.paidAmount || 0);

  useEffect(() => {
    if (!isOpen) return;

    const fetchMembers = async () => {
      try {
        const result = await getAllMembers();
        setMembers(result.data || result);
      } catch (error) {
        toast.error('Failed to load members');
      }
    };

    fetchMembers();
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setFormData((prev) => ({
        ...prev,
        memberId: initialMemberId || prev.memberId,
        totalAmount: initialAmount || prev.totalAmount,
        paidAmount: initialAmount || prev.paidAmount
      }));
    }
  }, [isOpen, initialMemberId, initialAmount]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔐 ONLINE PAYMENT FLOW
  const handleRazorpayPayment = async () => {
    const sdkLoaded = await loadRazorpayScript();
    if (!sdkLoaded) {
      toast.error('Razorpay SDK failed to load.');
      setIsSubmitting(false);
      return;
    }

    try {
      // FIX 1: Convert string to Number before sending to Razorpay
      const orderData = await createRazorpayOrder({
        amount: Number(formData.paidAmount), 
        memberId: formData.memberId
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.order.amount,
        currency: 'INR',
        order_id: orderData.order.id,
        name: 'NextGenzSolutions ERP',
        description: 'Gym Membership Payment',
        theme: { color: '#dc2626' },

        handler: async function (response) {
          try {
            // FIX 2: Convert strings to Numbers before saving to Database
            await verifyRazorpayPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              totalAmount: Number(formData.totalAmount),
              paidAmount: Number(formData.paidAmount)
            });

            toast.success('Payment verified & recorded!');
            onSuccess();
            onClose();
          } catch (err) {
            toast.error('Verification failed.');
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      toast.error('Failed to initiate payment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.memberId || !formData.totalAmount || !formData.paidAmount) {
      return toast.error('All fields are required!');
    }

    if (Number(formData.paidAmount) > Number(formData.totalAmount)) {
      return toast.error('Paid amount cannot exceed total amount.');
    }

    setIsSubmitting(true);

    const finalStatus =
      remainingAmount > 0 ? 'Pending' : 'Completed';

    if (formData.method === 'Razorpay Online') {
      await handleRazorpayPayment();
    } else {
      try {
        await recordPayment({
          memberId: formData.memberId,
          totalAmount: Number(formData.totalAmount),
          paidAmount: Number(formData.paidAmount),
          remainingAmount,
          method: formData.method,
          status: finalStatus
        });

        toast.success(
          finalStatus === 'Pending'
            ? 'Partial payment saved. Pending due recorded.'
            : 'Full payment recorded.'
        );

        onSuccess();
        onClose();
      } catch (err) {
        toast.error('Failed to record payment.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#0a0a0a] border border-gray-900 rounded-xl w-full max-w-md p-6 space-y-4">

        <h2 className="text-xl text-white font-bold uppercase">
          Process Payment
        </h2>

        <select
          name="memberId"
          value={formData.memberId}
          onChange={handleChange}
          className="w-full bg-black border border-gray-800 p-3 text-white"
        >
          <option value="">-- Select Member --</option>
          {members.map((m) => (
            <option key={m._id} value={m._id}>
              {m.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          name="totalAmount"
          value={formData.totalAmount}
          onChange={handleChange}
          placeholder="Total Fee Amount"
          className="w-full bg-black border border-gray-800 p-3 text-white"
        />

        <input
          type="number"
          name="paidAmount"
          value={formData.paidAmount}
          onChange={handleChange}
          placeholder="Paid Amount"
          className="w-full bg-black border border-gray-800 p-3 text-white"
        />

        {remainingAmount > 0 && (
          <div className="text-yellow-400 text-sm">
            Remaining Due: ₹{remainingAmount}
          </div>
        )}

        <select
          name="method"
          value={formData.method}
          onChange={handleChange}
          className="w-full bg-black border border-gray-800 p-3 text-white"
        >
          <option value="Razorpay Online">Razorpay Online</option>
          <option value="Cash">Cash</option>
          <option value="Bank Transfer">Bank Transfer</option>
        </select>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full bg-red-600 py-3 text-white font-bold"
        >
          {isSubmitting
            ? 'Processing...'
            : formData.method === 'Razorpay Online'
            ? 'Pay Online'
            : 'Save Record'}
        </button>

        <button
          onClick={onClose}
          className="w-full bg-gray-800 py-2 text-gray-400"
        >
          Cancel
        </button>

      </div>
    </div>
  );
};

export default RecordPaymentModal;