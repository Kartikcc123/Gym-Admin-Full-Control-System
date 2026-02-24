import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, User, Calendar, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { getAllMembers, deleteMember } from '../../api/memberApi';
import AddMemberModal from '../../components/members/AddMemberModal';

const MemberList = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const result = await getAllMembers();
      setMembers(result);
    } catch (error) {
      toast.error('Failed to load members', { style: { background: '#333', color: '#fff' }});
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you absolutely sure you want to delete ${name}? This cannot be undone.`)) {
      try {
        await deleteMember(id);
        toast.success(`${name} has been removed.`, { style: { background: '#166534', color: '#fff' }});
        // Refresh the list immediately!
        const updatedMembers = await getAllMembers();
        setMembers(updatedMembers);
      } catch (error) {
        toast.error('Failed to delete member', { style: { background: '#dc2626', color: '#fff' }});
      }
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const filteredMembers = members.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    member.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-widest text-white mb-1">Roster</h1>
          <p className="text-gray-500 font-medium tracking-wide">Manage your gym members</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold uppercase tracking-wider transition-colors shadow-[0_0_15px_rgba(220,38,38,0.3)]"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Member
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-black border border-gray-900 rounded-xl p-4 flex items-center">
        <Search className="w-5 h-5 text-gray-500 mr-3" />
        <input 
          type="text" 
          placeholder="Search by name or phone number..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-transparent border-none text-white w-full focus:outline-none focus:ring-0 placeholder-gray-600"
        />
      </div>

      {/* Data Table */}
      <div className="bg-black border border-gray-900 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0a0a0a] border-b border-gray-900 text-gray-400 text-xs uppercase tracking-widest">
                <th className="p-5 font-bold">Member</th>
                <th className="p-5 font-bold">Contact</th>
                <th className="p-5 font-bold">Status</th>
                <th className="p-5 font-bold">Join Date</th>
                <th className="p-5 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-900">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500 uppercase tracking-widest animate-pulse font-bold">
                    Loading Roster...
                  </td>
                </tr>
              ) : filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">
                    No members found. Time to recruit!
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => (
                  <tr key={member._id} className="hover:bg-[#050505] transition-colors">
                    <td className="p-5">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center mr-4">
                          <User className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                          <Link to={`/members/${member._id}`} className="text-white font-bold hover:underline block">
                            {member.name}
                          </Link>
                          <p className="text-xs text-gray-500 uppercase tracking-wider">{member.membershipPlan?.planName || 'No Plan'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-5">
                      <p className="text-gray-300 text-sm">{member.phone}</p>
                      <p className="text-gray-600 text-xs">{member.email || 'N/A'}</p>
                    </td>
                    <td className="p-5">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        member.status === 'Active' ? 'bg-green-900/20 text-green-500 border border-green-900/50' :
                        member.status === 'Pending Payment' ? 'bg-yellow-900/20 text-yellow-500 border border-yellow-900/50' :
                        'bg-red-900/20 text-red-500 border border-red-900/50'
                      }`}>
                        {member.status}
                      </span>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center text-gray-400 text-sm">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(member.joinDate || member.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    
                    {/* The New Actions Column */}
                    <td className="p-5 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link 
                          to={`/members/${member._id}`}
                          className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors border border-gray-800"
                        >
                          View
                        </Link>
                        <button 
                          onClick={() => handleDelete(member._id, member.name)}
                          className="bg-gray-900 hover:bg-red-900/40 text-gray-500 hover:text-red-500 p-2 rounded-lg transition-colors border border-gray-800 hover:border-red-900"
                          title="Delete Member"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddMemberModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchMembers} 
      />
    </div>
  );
};

export default MemberList;