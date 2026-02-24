import { useState } from 'react';
import { X, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import { createMember } from '../../api/memberApi';

const AddMemberModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'Active',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      return toast.error('Name and Phone are required!', { style: { background: '#dc2626', color: '#fff' }});
    }

    setIsSubmitting(true);
    try {
      await createMember(formData);
      toast.success('Member added successfully!', { style: { background: '#333', color: '#fff' }});
      onSuccess(); // Refresh the table
      onClose();   // Close the modal
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add member.';
      toast.error(message, { style: { background: '#dc2626', color: '#fff' }});
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#0a0a0a] border border-gray-900 rounded-t-lg sm:rounded-xl w-full max-w-md shadow-[0_0_40px_rgba(220,38,38,0.1)] overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-900 bg-black">
          <div className="flex items-center">
            <UserPlus className="w-5 h-5 text-red-600 mr-3" />
            <h2 className="text-xl font-black text-white uppercase tracking-widest">Add Member</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Full Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-black border border-gray-900 rounded-lg p-3 text-white focus:outline-none focus:border-red-600 transition-colors placeholder-gray-700"
              placeholder="e.g. John Doe"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Phone Number *</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full bg-black border border-gray-900 rounded-lg p-3 text-white focus:outline-none focus:border-red-600 transition-colors placeholder-gray-700"
              placeholder="e.g. 9876543210"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-black border border-gray-900 rounded-lg p-3 text-white focus:outline-none focus:border-red-600 transition-colors placeholder-gray-700"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Initial Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full bg-black border border-gray-900 rounded-lg p-3 text-white focus:outline-none focus:border-red-600 transition-colors appearance-none"
            >
              <option value="Active">Active (Paid)</option>
              <option value="Pending Payment">Pending Payment</option>
            </select>
          </div>

          {/* Modal Footer */}
          <div className="flex gap-4 pt-4 mt-6 border-t border-gray-900">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-lg font-bold uppercase tracking-wider text-gray-400 hover:text-white hover:bg-gray-900 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Member'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default AddMemberModal;