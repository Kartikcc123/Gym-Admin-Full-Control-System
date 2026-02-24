import { useState, useEffect } from 'react';
import { Users, Activity, IndianRupee, Dumbbell, AlertCircle, Download } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getDashboardStats } from '../../api/dashboardApi';
import { getPendingPayments } from '../../api/paymentApi';
import toast from 'react-hot-toast';
import { generateMonthlyReport } from '../../utils/generateMonthlyReport';

// Fallback chart data in case the server doesn't provide it
const mockChartData = [
  { name: 'Jan', revenue: 0 },
  { name: 'Feb', revenue: 0 },
  { name: 'Mar', revenue: 0 },
  { name: 'Apr', revenue: 0 },
  { name: 'May', revenue: 0 },
  { name: 'Jun', revenue: 0 },
];

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeMembers: 0,
    totalTrainers: 0,
    currentMonthRevenue: 0
  });
  const [pendingDues, setPendingDues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [monthsRange, setMonthsRange] = useState(6);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const result = await getDashboardStats(monthsRange);
        setStats(result.data);
        // fetch pending dues separately
        try {
          const pending = await getPendingPayments();
          setPendingDues(pending.data || pending);
        } catch (pErr) {
          console.error('Failed to load pending dues', pErr);
        }
      } catch (error) {
        toast.error('Failed to load dashboard data', { style: { background: '#333', color: '#fff' }});
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [monthsRange]);

  const handleDownloadReport = async () => {
    setIsGenerating(true);
    const toastId = toast.loading('Compiling monthly report...', { style: { background: '#333', color: '#fff' }});
    
    const success = await generateMonthlyReport(stats);
    
    if (success) {
      toast.success('Report downloaded successfully!', { id: toastId, style: { background: '#166534', color: '#fff' }});
    } else {
      toast.error('Failed to generate report.', { id: toastId });
    }
    setIsGenerating(false);
  };

  if (loading) {
    return <div className="text-gray-500 font-bold uppercase tracking-widest animate-pulse">Loading Command Center...</div>;
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-8">
      {/* FIXED: Removed the duplicate header block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-widest text-white mb-1">Overview</h1>
          <p className="text-gray-500 font-medium tracking-wide">Real-time metrics for NextGenz Gym</p>
        </div>
          <div className="flex items-center gap-3">
            <label className="text-xs text-gray-400 font-bold uppercase">Range</label>
            <select value={monthsRange} onChange={(e) => setMonthsRange(Number(e.target.value))} className="bg-black border border-gray-900 rounded p-2 text-sm">
              <option value={3}>3 months</option>
              <option value={6}>6 months</option>
              <option value={12}>12 months</option>
            </select>
          </div>
        <button 
          onClick={handleDownloadReport}
          disabled={isGenerating}
          className="flex items-center justify-center bg-gray-900 hover:bg-gray-800 border border-gray-800 text-white px-5 py-2.5 rounded-lg font-bold uppercase tracking-wider transition-colors disabled:opacity-50 text-sm shadow-[0_0_15px_rgba(220,38,38,0.15)]"
        >
          <Download className="w-4 h-4 mr-2 text-red-500" />
          {isGenerating ? 'Compiling...' : 'Download Report'}
        </button>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Users} title="Total Members" value={stats.totalMembers} color="text-white" />
        <StatCard icon={Activity} title="Active Members" value={stats.activeMembers} color="text-green-500" />
        <StatCard icon={Dumbbell} title="Total Trainers" value={stats.totalTrainers} color="text-white" />
        <StatCard icon={IndianRupee} title="Monthly Revenue" value={formatCurrency(stats.currentMonthRevenue)} color="text-red-500" />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Revenue Chart Section */}
        <div className="lg:col-span-2 bg-black border border-gray-900 rounded-xl p-6">
          <h2 className="text-lg font-bold uppercase tracking-widest text-white mb-6">Revenue Growth</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.chartData && stats.chartData.length ? stats.chartData : mockChartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#dc2626" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#dc2626" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis dataKey="name" stroke="#6b7280" tick={{fill: '#6b7280'}} tickLine={false} axisLine={false} />
                <YAxis stroke="#6b7280" tick={{fill: '#6b7280'}} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#1f2937', color: '#fff' }}
                  itemStyle={{ color: '#dc2626', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#dc2626" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pending Dues Section */}
        <div className="bg-black border border-gray-900 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold uppercase tracking-widest text-white">Pending Dues</h2>
            <AlertCircle className="text-red-600 w-5 h-5" />
          </div>
          
          <div className="space-y-4">
            {pendingDues.length === 0 ? (
              <p className="text-gray-500 text-sm">No pending payments.</p>
            ) : (
              pendingDues.map((item) => (
                <div key={item.memberId} className="flex justify-between items-center p-3 bg-[#0a0a0a] rounded-lg border border-gray-900">
                  <div>
                    <p className="text-white font-bold">{item.member?.name || 'Unnamed'}</p>
                    <p className="text-xs text-gray-500">{item.member?.phone || item.member?.email || ''}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-red-500 font-bold">{formatCurrency(item.totalPending)}</p>
                    <p className="text-xs text-gray-400">Outstanding</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

// Reusable Stat Card Component
const StatCard = ({ icon: Icon, title, value, color }) => (
  <div className="bg-black border border-gray-900 p-6 rounded-xl flex items-center justify-between transition-transform hover:-translate-y-1 duration-300">
    <div>
      <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mb-1">{title}</p>
      <h3 className={`text-3xl font-black ${color}`}>{value}</h3>
    </div>
    <div className="bg-gray-900 p-3 rounded-lg">
      <Icon className={`w-6 h-6 ${color}`} />
    </div>
  </div>
);

export default Dashboard;