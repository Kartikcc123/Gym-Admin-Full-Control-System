import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, CreditCard, Dumbbell, Fingerprint } from 'lucide-react'; // Added Fingerprint icon
import toast from 'react-hot-toast';
import { getMemberById } from '../../api/memberApi';
import AssignPlanModal from '../../components/members/AssignPlanModal';
import AssignTrainerModal from '../../components/members/AssignTrainerModal';

const MemberDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTrainerModalOpen, setIsTrainerModalOpen] = useState(false);

  const fetchMember = async () => {
    setLoading(true);
    try {
      const res = await getMemberById(id);
      setMember(res);
    } catch (err) {
      toast.error('Failed to load member');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchMember();
  }, [id]);

  if (loading) return <div className="p-6 text-gray-400 font-bold uppercase tracking-widest animate-pulse">Loading member...</div>;
  if (!member) return <div className="p-6 text-red-500 font-bold uppercase tracking-widest">Member not found.</div>;

  return (
    <div className="space-y-6">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-md bg-gray-900 hover:bg-gray-800 text-gray-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-white uppercase tracking-widest">{member.name}</h1>
            
            {/* NEW: ID Badge and Join Date */}
            <div className="flex items-center gap-3 mt-1">
              <span className="flex items-center bg-gray-900 text-gray-400 text-[10px] font-mono px-2 py-1 rounded border border-gray-800 uppercase tracking-widest">
                <Fingerprint className="w-3 h-3 mr-1 text-red-600" />
                ID: {member._id}
              </span>
              <p className="text-sm text-gray-500 font-medium">
                Joined {new Date(member.joinDate || member.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button 
            onClick={() => setIsTrainerModalOpen(true)}
            className="flex items-center justify-center bg-gray-900 hover:bg-gray-800 border border-gray-800 text-white px-5 py-2.5 rounded-lg font-bold uppercase tracking-wider transition-colors text-sm"
          >
            <Dumbbell className="w-4 h-4 mr-2 text-red-500" />
            Assign PT
          </button>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-bold uppercase tracking-wider transition-colors shadow-[0_0_15px_rgba(220,38,38,0.3)] text-sm"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Assign Plan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Contact Card */}
        <div className="bg-black border border-gray-900 rounded-xl p-4 sm:p-6">
          <h2 className="text-sm text-gray-400 font-bold uppercase tracking-wider mb-4">Contact</h2>
          <div className="flex items-center gap-3 text-gray-300 mb-4">
            <Mail className="w-4 h-4 text-red-600 shrink-0" />
            <a href={`mailto:${member.email}`} className="truncate hover:text-white transition-colors">{member.email || '—'}</a>
          </div>
          <div className="flex items-center gap-3 text-gray-300">
            <Phone className="w-4 h-4 text-red-600 shrink-0" />
            <a href={`tel:${member.phone}`} className="hover:text-white transition-colors">{member.phone || '—'}</a>
          </div>
        </div>

        {/* Subscription Card */}
        <div className="bg-black border border-gray-900 rounded-xl p-4 sm:p-6 md:col-span-2">
          <h2 className="text-sm text-gray-400 font-bold uppercase tracking-wider mb-4">Subscription & Training</h2>
          <div className="flex flex-wrap gap-4">
            <div className="bg-[#0b0b0b] border border-gray-900 rounded-lg p-4 flex-1 min-w-[180px]">
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Plan</p>
              <p className="font-black text-white uppercase tracking-wide">{member.membershipPlan?.planName || 'No Active Plan'}</p>
            </div>

            <div className="bg-[#0b0b0b] border border-gray-900 rounded-lg p-4 flex-1 min-w-[140px]">
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Status</p>
              <p className={`font-black uppercase tracking-wide ${member.status === 'Active' ? 'text-green-500' : member.status === 'Pending Payment' ? 'text-yellow-500' : 'text-red-500'}`}>
                {member.status}
              </p>
            </div>

            <div className="bg-[#0b0b0b] border border-gray-900 rounded-lg p-4 flex-1 min-w-[140px]">
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Joined</p>
              <p className="font-bold text-gray-300 tracking-wide">{new Date(member.joinDate || member.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="mt-6 border-t border-gray-900 pt-4">
            <h3 className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-3">Personal Trainer</h3>
            {member.assignedTrainer ? (
              <div className="flex items-center text-white bg-gray-900/50 p-3 rounded-lg border border-gray-800 w-max">
                <Dumbbell className="w-4 h-4 text-red-500 mr-3" />
                <span className="font-bold mr-2">{member.assignedTrainer.name}</span> 
                <span className="text-xs text-gray-500 uppercase tracking-widest">({member.assignedTrainer.specialization})</span>
              </div>
            ) : (
              <p className="text-gray-400 text-sm">No Personal Trainer assigned.</p>
            )}
          </div>
        </div>
      </div>

      <AssignPlanModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        memberId={member._id}
        onSuccess={fetchMember} 
      />
      
      <AssignTrainerModal 
        isOpen={isTrainerModalOpen}
        onClose={() => setIsTrainerModalOpen(false)}
        memberId={member._id}
        onSuccess={fetchMember}
      />

    </div>
  );
};

export default MemberDetail;