import { useState, useEffect } from 'react';
import { X, Dumbbell } from 'lucide-react';
import toast from 'react-hot-toast';
import { getAllTrainers } from '../../api/trainerApi';
import { assignTrainerToMember } from '../../api/memberApi';

const AssignTrainerModal = ({ isOpen, onClose, memberId, onSuccess }) => {
  const [trainers, setTrainers] = useState([]);
  const [selectedTrainer, setSelectedTrainer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const fetchTrainers = async () => {
        try {
          const result = await getAllTrainers();
          setTrainers(result.data || result);
        } catch (error) {
          toast.error('Failed to load trainers');
        }
      };
      fetchTrainers();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTrainer) return toast.error('Please select a trainer!');

    setIsSubmitting(true);
    try {
      await assignTrainerToMember(memberId, selectedTrainer);
      toast.success('Trainer assigned successfully!', { style: { background: '#166534', color: '#fff' }});
      onSuccess();
      onClose();
    } catch (error) {
      toast.error('Failed to assign trainer');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#0a0a0a] border border-gray-900 rounded-xl w-full max-w-md shadow-[0_0_40px_rgba(220,38,38,0.1)] overflow-hidden">
        
        <div className="flex items-center justify-between p-6 border-b border-gray-900 bg-black">
          <div className="flex items-center">
            <Dumbbell className="w-5 h-5 text-red-600 mr-3" />
            <h2 className="text-xl font-black text-white uppercase tracking-widest">Assign PT</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Select Personal Trainer</label>
            <select
              value={selectedTrainer}
              onChange={(e) => setSelectedTrainer(e.target.value)}
              className="w-full bg-black border border-gray-900 rounded-lg p-3 text-white focus:outline-none focus:border-red-600 transition-colors appearance-none cursor-pointer"
            >
              <option value="">-- Choose a Trainer --</option>
              {trainers.map(trainer => (
                <option key={trainer._id} value={trainer._id}>
                  {trainer.name} - {trainer.specialization}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-4 pt-4 mt-6 border-t border-gray-900">
            <button type="button" onClick={onClose} className="flex-1 py-3 px-4 rounded-lg font-bold uppercase tracking-wider text-gray-400 hover:text-white hover:bg-gray-900 transition-colors">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold uppercase tracking-wider transition-colors disabled:opacity-50">
              {isSubmitting ? 'Saving...' : 'Confirm PT'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignTrainerModal;