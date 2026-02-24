import { useState, useEffect } from 'react';
import { IndianRupee, Search, Plus, Download } from 'lucide-react'; // FIXED: Added Download icon
import toast from 'react-hot-toast';
import { getAllPayments } from '../../api/paymentApi';
import RecordPaymentModal from './RecordPaymentModal';
// FIXED: Adjusted path to stay within the React 'src' folder
import { generateInvoice } from '../../utils/generateInvoice';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const data = await getAllPayments();
        setPayments(data);
      } catch (error) {
        toast.error('Failed to load financial records');
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  const filteredPayments = payments.filter(p => 
    p.member?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.method?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-widest text-white mb-1">Financials</h1>
          <p className="text-gray-500 font-medium tracking-wide">Track revenue and billing</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold uppercase tracking-wider transition-colors shadow-[0_0_15px_rgba(220,38,38,0.3)]"
        >
          <Plus className="w-5 h-5 mr-2" />
          Record Payment
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-black border border-gray-900 rounded-xl p-4 flex items-center">
        <Search className="w-5 h-5 text-gray-500 mr-3" />
        <input 
          type="text" 
          placeholder="Search by member name or payment method..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-transparent border-none text-white w-full focus:outline-none focus:ring-0 placeholder-gray-600"
        />
      </div>

      {/* Ledger Table */}
      <div className="bg-black border border-gray-900 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0a0a0a] border-b border-gray-900 text-gray-400 text-xs uppercase tracking-widest">
                <th className="p-5 font-bold">Transaction ID</th>
                <th className="p-5 font-bold">Member</th>
                <th className="p-5 font-bold">Amount</th>
                <th className="p-5 font-bold">Method</th>
                <th className="p-5 font-bold">Date</th>
                <th className="p-5 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-900">
              {loading ? (
                <tr>
                  {/* FIXED: Increased colSpan to 6 to match new column */}
                  <td colSpan="6" className="p-8 text-center text-gray-500 uppercase tracking-widest animate-pulse font-bold">Loading Ledger...</td>
                </tr>
              ) : filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">No payment records found.</td>
                </tr>
              ) : (
                filteredPayments.map((payment) => (
                  <tr key={payment._id} className="hover:bg-[#050505] transition-colors">
                    <td className="p-5 text-gray-500 text-xs font-mono uppercase tracking-wider">{payment._id.slice(-8)}</td>
                    <td className="p-5 font-bold text-white">{payment.member?.name || 'Unknown User'}</td>
                    <td className="p-5 font-black text-green-500">{formatCurrency(payment.amount)}</td>
                    <td className="p-5">
                      <span className="bg-gray-900 text-gray-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-gray-800">
                        {payment.method}
                      </span>
                    </td>
                    <td className="p-5 text-gray-400 text-sm">
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </td>
                    {/* FIXED: Added the Download Button */}
                    <td className="p-5 text-right">
                      <button 
                        onClick={() => generateInvoice(payment)}
                        className="p-2 bg-gray-900 hover:bg-red-900/30 text-gray-400 hover:text-red-500 rounded-lg transition-colors border border-gray-800 hover:border-red-900"
                        title="Download Invoice"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* FIXED: Moved the Modal to the bottom of the component so it doesn't break your layout */}
      <RecordPaymentModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          const fetchPayments = async () => {
            const data = await getAllPayments();
            setPayments(data);
          };
          fetchPayments();
        }}
      />
    </div>
  );
};

export default Payments;