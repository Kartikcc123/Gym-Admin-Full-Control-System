import { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { createRoutine } from '../../api/routineApi';
import { getAllMembers } from '../../api/memberApi';

const CreateRoutineModal = ({ isOpen, onClose, onSuccess }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    member: '',
    name: '',
    exercises: [{ day: 'Monday', exerciseName: '', sets: 3, reps: '10', notes: '' }]
  });

  useEffect(() => {
    if (isOpen) {
      const fetchMembers = async () => {
        try {
          const data = await getAllMembers();
          setMembers(data);
        } catch (error) {
          toast.error('Failed to load members');
        }
      };
      fetchMembers();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAddExercise = () => {
    setFormData({
      ...formData,
      exercises: [...formData.exercises, { day: 'Monday', exerciseName: '', sets: 3, reps: '10', notes: '' }]
    });
  };

  const handleRemoveExercise = (index) => {
    const newExercises = formData.exercises.filter((_, i) => i !== index);
    setFormData({ ...formData, exercises: newExercises });
  };

  const handleExerciseChange = (index, field, value) => {
    const newExercises = [...formData.exercises];
    newExercises[index][field] = value;
    setFormData({ ...formData, exercises: newExercises });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createRoutine(formData);
      toast.success('Routine assigned successfully!', { style: { background: '#166534', color: '#fff' }});
      onSuccess();
      onClose();
    } catch (error) {
      toast.error('Failed to assign routine', { style: { background: '#dc2626', color: '#fff' }});
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0a0a0a] border border-gray-900 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-[0_0_50px_rgba(220,38,38,0.1)]">
        
        <div className="sticky top-0 bg-[#0a0a0a] border-b border-gray-900 p-6 flex justify-between items-center z-10">
          <h2 className="text-xl font-black text-white uppercase tracking-widest">Assign Workout Routine</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Select Member</label>
              <select 
                required
                value={formData.member} 
                onChange={(e) => setFormData({...formData, member: e.target.value})}
                className="w-full bg-black border border-gray-900 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-red-600 transition-colors"
              >
                <option value="">-- Choose a Member --</option>
                {members.map(m => (
                  <option key={m._id} value={m._id}>{m.name} ({m.phone})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Routine Name</label>
              <input 
                type="text" required placeholder="e.g. 4-Day Push/Pull/Legs"
                value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-black border border-gray-900 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-red-600 transition-colors"
              />
            </div>
          </div>

          <div className="border-t border-gray-900 pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest">Exercises</h3>
              <button type="button" onClick={handleAddExercise} className="flex items-center text-xs font-bold text-red-500 hover:text-red-400 uppercase tracking-widest transition-colors">
                <Plus className="w-4 h-4 mr-1" /> Add Exercise
              </button>
            </div>

            <div className="space-y-4">
              {formData.exercises.map((exercise, index) => (
                <div key={index} className="flex flex-wrap md:flex-nowrap gap-3 bg-black p-4 rounded-lg border border-gray-900 items-start">
                  <input type="text" placeholder="Day (e.g. Mon)" value={exercise.day} onChange={(e) => handleExerciseChange(index, 'day', e.target.value)} className="w-24 bg-[#0a0a0a] border border-gray-800 rounded p-2 text-white text-sm" required />
                  <input type="text" placeholder="Exercise Name" value={exercise.exerciseName} onChange={(e) => handleExerciseChange(index, 'exerciseName', e.target.value)} className="flex-1 bg-[#0a0a0a] border border-gray-800 rounded p-2 text-white text-sm" required />
                  <input type="number" placeholder="Sets" value={exercise.sets} onChange={(e) => handleExerciseChange(index, 'sets', e.target.value)} className="w-20 bg-[#0a0a0a] border border-gray-800 rounded p-2 text-white text-sm" required />
                  <input type="text" placeholder="Reps (e.g. 8-12)" value={exercise.reps} onChange={(e) => handleExerciseChange(index, 'reps', e.target.value)} className="w-24 bg-[#0a0a0a] border border-gray-800 rounded p-2 text-white text-sm" required />
                  <button type="button" onClick={() => handleRemoveExercise(index)} className="p-2 text-gray-600 hover:text-red-500 transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-900 pt-6 flex justify-end">
            <button type="button" onClick={onClose} className="px-6 py-3 text-gray-500 font-bold uppercase tracking-widest hover:text-white transition-colors mr-4">Cancel</button>
            <button type="submit" disabled={loading} className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-bold uppercase tracking-widest transition-colors shadow-[0_0_15px_rgba(220,38,38,0.3)] disabled:opacity-50">
              {loading ? 'Saving...' : 'Save Routine'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default CreateRoutineModal;