import { useState, useEffect } from 'react';
import { Plus, User, Phone, Mail, Award, IndianRupee, Trash2 } from 'lucide-react'; // Added Trash2
import toast from 'react-hot-toast';
import { getAllTrainers, deleteTrainer } from '../../api/trainerApi'; // Added deleteTrainer
import AddTrainerModal from '../../components/trainers/AddTrainerModal';

const Trainers = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTrainers = async () => {
    try {
      const data = await getAllTrainers();
      setTrainers(data.data || data);
    } catch (error) {
      toast.error('Failed to load staff roster');
    } finally {
      setLoading(false);
    }
  };

  // The new Delete Handler
  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you absolutely sure you want to terminate ${name}'s employment? This cannot be undone.`)) {
      try {
        await deleteTrainer(id);
        toast.success(`${name} has been removed from the roster.`, { style: { background: '#166534', color: '#fff' }});
        // Refresh the list immediately
        fetchTrainers();
      } catch (error) {
        toast.error('Failed to remove trainer', { style: { background: '#dc2626', color: '#fff' }});
      }
    }
  };

  useEffect(() => {
    fetchTrainers();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-widest text-white mb-1">Staff Roster</h1>
          <p className="text-gray-500 font-medium tracking-wide">Manage your coaches and trainers</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold uppercase tracking-wider transition-colors shadow-[0_0_15px_rgba(220,38,38,0.3)]"
        >
          <Plus className="w-5 h-5 mr-2" />
          Hire Trainer
        </button>
      </div>

      {/* Roster Grid */}
      {loading ? (
        <div className="text-gray-500 font-bold uppercase tracking-widest animate-pulse text-center p-10">Loading Staff...</div>
      ) : trainers.length === 0 ? (
        <div className="bg-black border border-gray-900 rounded-xl p-10 text-center">
          <p className="text-gray-500">No trainers hired yet. Click "Hire Trainer" to build your team.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {trainers.map((trainer) => (
            <div key={trainer._id} className="bg-black border border-gray-900 rounded-xl overflow-hidden group hover:border-red-900/50 transition-colors">
              
              {/* Card Header with Delete Button */}
              <div className="p-6 border-b border-gray-900 flex justify-between items-start">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full bg-gray-900 border-2 border-red-600/50 flex items-center justify-center shrink-0">
                    <User className="w-8 h-8 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white uppercase tracking-wider">{trainer.name}</h3>
                    <span className="inline-block mt-1 px-3 py-1 bg-[#0a0a0a] border border-gray-800 rounded-md text-xs font-bold text-red-500 uppercase tracking-widest">
                      {trainer.specialization}
                    </span>
                  </div>
                </div>
                
                {/* THE NEW DELETE BUTTON */}
                <button 
                  onClick={() => handleDelete(trainer._id, trainer.name)}
                  className="text-gray-500 hover:text-red-500 p-2 rounded-lg transition-colors hover:bg-red-900/20"
                  title="Remove Trainer"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 space-y-4 bg-[#050505]">
                <div className="flex items-center text-gray-400 text-sm">
                  <Award className="w-4 h-4 mr-3 text-gray-500" />
                  <span className="font-medium">{trainer.experience} Years Experience</span>
                </div>
                <div className="flex items-center text-gray-400 text-sm">
                  <Phone className="w-4 h-4 mr-3 text-gray-500" />
                  <span className="font-medium">{trainer.phone}</span>
                </div>
                {trainer.email && (
                  <div className="flex items-center text-gray-400 text-sm truncate">
                    <Mail className="w-4 h-4 mr-3 text-gray-500 shrink-0" />
                    <span className="font-medium truncate">{trainer.email}</span>
                  </div>
                )}
                <div className="flex items-center text-gray-400 text-sm pt-4 border-t border-gray-900">
                  <IndianRupee className="w-4 h-4 mr-3 text-green-500" />
                  <span className="font-bold text-green-500">₹{trainer.salary.toLocaleString()} <span className="text-gray-600 font-normal">/ month</span></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddTrainerModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchTrainers} 
      />
    </div>
  );
};

export default Trainers;