import { useState, useEffect } from 'react';
import { X, ClipboardList } from 'lucide-react';
import toast from 'react-hot-toast';
import { getAllPlans } from '../../api/planApi';
import { assignPlanToMember } from '../../api/memberApi';

const AssignPlanModal = ({ isOpen, onClose, memberId, onSuccess }) => {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const fetchPlans = async () => {
        try {
          const result = await getAllPlans();
          setPlans(result.data || result);
        } catch (error) {
          toast.error('Failed to load plans');
        }
      };
      fetchPlans();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPlan) return toast.error('Please select a plan!', { style: { background: '#dc2626', color: '#fff' }});

    setIsSubmitting(true);
    try {
      await assignPlanToMember(memberId, selectedPlan);
      toast.success('Plan assigned successfully!', { style: { background: '#166534', color: '#fff' }});
      onSuccess(); // Refresh the profile
      onClose();
    } catch (error) {
      toast.error('Failed to assign plan', { style: { background: '#dc2626', color: '#fff' }});
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#0a0a0a] border border-gray-900 rounded-xl w-full max-w-md shadow-[0_0_40px_rgba(220,38,38,0.1)] overflow-hidden">
        
        <div className="flex items-center justify-between p-6 border-b border-gray-900 bg-black">
          <div className="flex items-center">
            <ClipboardList className="w-5 h-5 text-red-600 mr-3" />
            <h2 className="text-xl font-black text-white uppercase tracking-widest">Assign Plan</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Select Membership Tier</label>
            <select
              value={selectedPlan}
              onChange={(e) => setSelectedPlan(e.target.value)}
              className="w-full bg-black border border-gray-900 rounded-lg p-3 text-white focus:outline-none focus:border-red-600 transition-colors appearance-none cursor-pointer"
            >
              <option value="">-- Choose a Plan --</option>
              {plans.map(plan => (
                <option key={plan._id} value={plan._id}>
                  {plan.name} - ₹{plan.price} ({plan.durationInMonths} Months)
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-4 pt-4 mt-6 border-t border-gray-900">
            <button type="button" onClick={onClose} className="flex-1 py-3 px-4 rounded-lg font-bold uppercase tracking-wider text-gray-400 hover:text-white hover:bg-gray-900 transition-colors">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold uppercase tracking-wider transition-colors disabled:opacity-50">
              {isSubmitting ? 'Saving...' : 'Confirm Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignPlanModal;