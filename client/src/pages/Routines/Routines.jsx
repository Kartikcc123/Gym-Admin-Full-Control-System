import { useState, useEffect } from 'react';
import { Dumbbell, Plus, Search, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { getAllRoutines } from '../../api/routineApi';
import CreateRoutineModal from './CreateRoutineModal';

const Routines = () => {
  const [routines, setRoutines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchRoutines = async () => {
    try {
      const data = await getAllRoutines();
      setRoutines(data);
    } catch (error) {
      toast.error('Failed to load routines');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutines();
  }, []);

  const filteredRoutines = routines.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.member?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-widest text-white mb-1">Workout Routines</h1>
          <p className="text-gray-500 font-medium tracking-wide">Manage and assign training programs</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold uppercase tracking-wider transition-colors shadow-[0_0_15px_rgba(220,38,38,0.3)]"
        >
          <Plus className="w-5 h-5 mr-2" /> Assign Routine
        </button>
      </div>

      {/* Search */}
      <div className="bg-black border border-gray-900 rounded-xl p-4 flex items-center">
        <Search className="w-5 h-5 text-gray-500 mr-3" />
        <input 
          type="text" 
          placeholder="Search by routine or member name..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-transparent border-none text-white w-full focus:outline-none focus:ring-0 placeholder-gray-600"
        />
      </div>

      {/* Routine Cards Grid */}
      {loading ? (
        <div className="text-center p-10 text-gray-500 font-bold uppercase tracking-widest animate-pulse">Loading Routines...</div>
      ) : filteredRoutines.length === 0 ? (
        <div className="text-center p-10 bg-black border border-gray-900 rounded-xl text-gray-500">No workout routines found. Assign one to get started!</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredRoutines.map((routine) => (
            <div key={routine._id} className="bg-black border border-gray-900 rounded-xl overflow-hidden hover:border-gray-800 transition-colors">
              <div className="p-6 border-b border-gray-900 bg-[#050505]">
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-gray-900 p-3 rounded-lg border border-gray-800">
                    <Dumbbell className="w-6 h-6 text-red-500" />
                  </div>
                  <span className="bg-gray-900 text-gray-400 text-xs font-bold px-3 py-1 rounded-full border border-gray-800">
                    {routine.exercises.length} Exercises
                  </span>
                </div>
                <h3 className="text-xl font-black text-white uppercase tracking-wider mb-1">{routine.name}</h3>
                <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">
                  Member: <span className="text-gray-300">{routine.member?.name || 'Unknown'}</span>
                </p>
              </div>
              <div className="p-6 bg-black">
                <h4 className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-4 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" /> Routine Preview
                </h4>
                <div className="space-y-3">
                  {routine.exercises.slice(0, 3).map((ex, i) => (
                    <div key={i} className="flex justify-between items-center text-sm">
                      <span className="text-gray-400"><span className="text-red-500 mr-2 font-bold">{ex.day}</span> {ex.exerciseName}</span>
                      <span className="text-gray-600 font-mono">{ex.sets}x{ex.reps}</span>
                    </div>
                  ))}
                  {routine.exercises.length > 3 && (
                    <div className="text-center pt-2 text-xs font-bold text-gray-600 uppercase tracking-widest">
                      + {routine.exercises.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <CreateRoutineModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchRoutines} 
      />
    </div>
  );
};

export default Routines;