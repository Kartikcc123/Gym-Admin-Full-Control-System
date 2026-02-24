import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Phone, Mail, Activity, CreditCard, ShieldCheck } from 'lucide-react';
import { getMemberById } from '../../api/memberApi';
import AssignPlanModal from '../../components/members/AssignPlanModal';

const MemberProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchMember = async () => {
    try {
      const data = await getMemberById(id);
      setMember(data);
    } catch (error) {
      console.error("Failed to load member");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMember();
  }, [id]);

  if (loading) return <div className="text-gray-500 uppercase tracking-widest font-bold animate-pulse">Loading Profile...</div>;
  if (!member) return <div className="text-red-500 font-bold">Member not found.</div>;

  return (
    <div className="space-y-8">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <button onClick={() => navigate('/members')} className="flex items-center text-gray-500 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span className="font-bold uppercase tracking-widest text-sm">Back to Roster</span>
        </button>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-bold uppercase tracking-wider transition-colors shadow-[0_0_15px_rgba(220,38,38,0.3)] text-sm"
        >
          <CreditCard className="w-4 h-4 mr-2" />
          Assign Plan
        </button>
      </div>

      {/* Profile Header Card */}
      <div className="bg-black border border-gray-900 rounded-xl p-8 flex items-center space-x-6">
        <div className="w-24 h-24 rounded-full bg-gray-900 border-2 border-red-600 flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.2)]">
          <User className="w-10 h-10 text-red-600" />
        </div>
        <div>
          <h1 className="text-4xl font-black text-white uppercase tracking-widest mb-2">{member.name}</h1>
          <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider inline-block mb-2 ${
            member.status === 'Active' ? 'bg-green-900/20 text-green-500 border border-green-900/50' : 'bg-red-900/20 text-red-500 border border-red-900/50'
          }`}>
            {member.status}
          </span>
          {/* Show Current Plan if it exists */}
          {member.membershipPlan ? (
             <div className="flex items-center text-gray-400 text-sm mt-1">
               <ShieldCheck className="w-4 h-4 text-red-500 mr-2" />
               Currently enrolled in <strong className="text-white ml-1 uppercase tracking-wider">{member.membershipPlan.name}</strong>
             </div>
          ) : (
            <p className="text-gray-500 text-sm mt-1">No active plan assigned.</p>
          )}
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#0a0a0a] border border-gray-900 p-6 rounded-xl flex items-center">
          <Phone className="text-gray-500 w-6 h-6 mr-4" />
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Phone</p>
            <p className="text-white font-medium">{member.phone}</p>
          </div>
        </div>
        <div className="bg-[#0a0a0a] border border-gray-900 p-6 rounded-xl flex items-center">
          <Mail className="text-gray-500 w-6 h-6 mr-4" />
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Email</p>
            <p className="text-white font-medium">{member.email || 'N/A'}</p>
          </div>
        </div>
        <div className="bg-[#0a0a0a] border border-gray-900 p-6 rounded-xl flex items-center">
          <Activity className="text-gray-500 w-6 h-6 mr-4" />
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Join Date</p>
            <p className="text-white font-medium">{new Date(member.joinDate || member.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      <AssignPlanModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        memberId={member._id}
        onSuccess={fetchMember} // Refresh the page to show the new plan!
      />
    </div>
  );
};

export default MemberProfile;