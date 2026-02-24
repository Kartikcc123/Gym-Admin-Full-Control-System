import { useState } from 'react';
import { X, Dumbbell } from 'lucide-react';
import toast from 'react-hot-toast';
import { addTrainer } from '../../api/trainerApi';

const AddTrainerModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    specialization: 'General Fitness',
    experience: '',
    salary: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.experience || !formData.salary) {
      return toast.error('Please fill in all required fields.', { style: { background: '#dc2626', color: '#fff' }});
    }

    setIsSubmitting(true);
    try {
      await addTrainer({
        ...formData,
        experience: Number(formData.experience),
        salary: Number(formData.salary)
      });
      toast.success('Trainer hired successfully!', { style: { background: '#166534', color: '#fff' }});
      setFormData({ name: '', phone: '', email: '', specialization: 'General Fitness', experience: '', salary: '' });
      onSuccess();
      onClose();
    } catch (error) {
      toast.error('Failed to add trainer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#0a0a0a] border border-gray-900 rounded-xl w-full max-w-lg shadow-[0_0_40px_rgba(220,38,38,0.1)] overflow-hidden">
        
        <div className="flex items-center justify-between p-6 border-b border-gray-900 bg-black">
          <div className="flex items-center">
            <Dumbbell className="w-5 h-5 text-red-600 mr-3" />
            <h2 className="text-xl font-black text-white uppercase tracking-widest">Hire New Trainer</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Full Name *</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-black border border-gray-900 rounded-lg p-3 text-white focus:outline-none focus:border-red-600 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Phone *</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-black border border-gray-900 rounded-lg p-3 text-white focus:outline-none focus:border-red-600 transition-colors" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Email Address</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-black border border-gray-900 rounded-lg p-3 text-white focus:outline-none focus:border-red-600 transition-colors" />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Specialization *</label>
            <select name="specialization" value={formData.specialization} onChange={handleChange} className="w-full bg-black border border-gray-900 rounded-lg p-3 text-white focus:outline-none focus:border-red-600 transition-colors appearance-none">
              <option value="General Fitness">General Fitness</option>
              <option value="Bodybuilding">Bodybuilding</option>
              <option value="Powerlifting">Powerlifting</option>
              <option value="CrossFit">CrossFit</option>
              <option value="Yoga & Mobility">Yoga & Mobility</option>
              <option value="Nutritionist">Nutritionist</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Experience (Years) *</label>
              <input type="number" name="experience" value={formData.experience} onChange={handleChange} className="w-full bg-black border border-gray-900 rounded-lg p-3 text-white focus:outline-none focus:border-red-600 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Monthly Salary (₹) *</label>
              <input type="number" name="salary" value={formData.salary} onChange={handleChange} className="w-full bg-black border border-gray-900 rounded-lg p-3 text-white focus:outline-none focus:border-red-600 transition-colors" />
            </div>
          </div>

          <div className="flex gap-4 pt-4 mt-2 border-t border-gray-900">
            <button type="button" onClick={onClose} className="flex-1 py-3 px-4 rounded-lg font-bold uppercase tracking-wider text-gray-400 hover:text-white hover:bg-gray-900 transition-colors">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold uppercase tracking-wider transition-colors disabled:opacity-50">
              {isSubmitting ? 'Saving...' : 'Confirm Hire'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTrainerModal;