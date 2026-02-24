import { useState, useEffect } from 'react';
import { Plus, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { getAllPlans } from '../../api/planApi';
import AddPlanModal from '../../components/plans/AddPlanModal';

const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const result = await getAllPlans();
      setPlans(result);
    } catch (error) {
      toast.error('Failed to load plans', { style: { background: '#333', color: '#fff' }});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-widest text-white mb-1">Membership Plans</h1>
          <p className="text-gray-500 font-medium tracking-wide">Manage pricing tiers</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold uppercase tracking-wider transition-colors shadow-[0_0_15px_rgba(220,38,38,0.3)]"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Plan
        </button>
      </div>

      {/* Pricing Cards Grid */}
      {loading ? (
        <div className="text-gray-500 font-bold uppercase tracking-widest animate-pulse">Loading Plans...</div>
      ) : plans.length === 0 ? (
        <div className="bg-black border border-gray-900 rounded-xl p-10 text-center text-gray-500">
          No plans created yet. Time to build your business model!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div key={plan._id} className="bg-black border border-gray-900 rounded-xl p-4 sm:p-6 hover:border-red-900 transition-colors relative overflow-hidden flex flex-col">
              <div className="absolute top-0 right-0 bg-red-900/20 text-red-500 px-3 py-1 rounded-bl-lg text-xs font-bold uppercase tracking-wider border-b border-l border-red-900/50">
                {plan.durationInMonths} {plan.durationInMonths === 1 ? 'Month' : 'Months'}
              </div>
              
              <h3 className="text-xl font-black text-white uppercase tracking-widest mb-2 mt-2">{plan.planName}</h3>
              <div className="flex items-baseline mb-6">
                <span className="text-4xl font-black text-red-600">{formatCurrency(plan.price)}</span>
              </div>
              
              <div className="flex-1">
                <p className="text-gray-400 text-sm mb-6 pb-6 border-b border-gray-900">
                  {plan.features && plan.features.length > 0 ? plan.features.join(', ') : 'Standard gym access included.'}
                </p>
                
                <ul className="space-y-3">
                  <li className="flex items-start text-sm text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-red-600 mr-2 mt-0.5 shrink-0" />
                    Valid for {plan.durationInMonths} {plan.durationInMonths === 1 ? 'Month' : 'Months'}
                  </li>
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddPlanModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchPlans} 
      />
    </div>
  );
};

export default Plans;