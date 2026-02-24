import { useState, useEffect } from 'react';
import { Users, Activity, IndianRupee, Dumbbell, AlertCircle, Download } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getDashboardStats } from '../../api/dashboardApi';
import { getPendingPayments } from '../../api/paymentApi';
import toast from 'react-hot-toast';
import { generateMonthlyReport } from '../../utils/generateMonthlyReport';

// Fallback chart data in case the server is empty
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
    currentMonthRevenue: 0,
    chartData: [] // Default empty array for graph
  });
  
  const [pendingDues, setPendingDues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [monthsRange, setMonthsRange] = useState(6);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // 1. Fetch main dashboard stats
        const result = await getDashboardStats(monthsRange);
        
        // 🔥 THE FIX: Properly extract data whether it's wrapped in .data or not
        const actualData = result.data ? result.data : result;
        setStats({
          totalMembers: actualData.totalMembers || 0,
          activeMembers: actualData.activeMembers || 0,
          totalTrainers: actualData.totalTrainers || 0,
          currentMonthRevenue: actualData.currentMonthRevenue || 0,
          chartData: actualData.chartData || []
        });

        // 2. Fetch pending dues separately
        try {
          const pending = await getPendingPayments();
          const actualPendingData = pending.data ? pending.data : pending;
          setPendingDues(actualPendingData || []);
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

  // 🔥 BULLETPROOF CURRENCY FORMATTER
  const formatCurrency = (amount) => {
    const safeAmount = Number(amount) || 0;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(safeAmount);
  };

  if (loading) {
    return <div className="text-gray-500 p-10 font-bold text-center uppercase tracking-widest animate-pulse">Loading Command Center...</div>;
  }

  // Determine which data to show on the chart
  const chartDataToShow = stats.chartData && stats.chartData.length > 0 ? stats.chartData : mockChartData;

  return (
    <div className="space-y-8">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-widest text-white mb-1">Overview</h1>
          <p className="text-gray-500 font-medium tracking-wide">Real-time metrics for NextGenz ERP</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3">
            <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Range</label>
            <select 
              value={monthsRange} 
              onChange={(e) => setMonthsRange(Number(e.target.value))} 
              className="bg-black border border-gray-900 focus:border-red-600 outline-none rounded-lg p-2.5 text-sm text-white transition-colors"
            >
              <option value={3}>Last 3 months</option>
              <option value={6}>Last 6 months</option>
              <option value={12}>Last 12 months</option>
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
        <div className="lg:col-span-2 bg-black border border-gray-900 rounded-xl p-6 shadow-lg">
          <h2 className="text-lg font-bold uppercase tracking-widest text-white mb-6">Revenue Growth</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartDataToShow}>
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
                  contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#1f2937', color: '#fff', borderRadius: '8px' }}
                  itemStyle={{ color: '#dc2626', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#dc2626" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pending Dues Section */}
        <div className="bg-black border border-gray-900 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold uppercase tracking-widest text-white">Pending Dues</h2>
            <AlertCircle className="text-red-600 w-5 h-5" />
          </div>
          
          <div className="space-y-4 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
            {pendingDues.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-green-500 font-bold text-sm uppercase tracking-wider">All Clear! 🎉</p>
                <p className="text-gray-500 text-xs mt-1">No pending payments.</p>
              </div>
            ) : (
              pendingDues.map((item, index) => (
                <div key={item._id || index} className="flex justify-between items-center p-3 bg-[#0a0a0a] hover:bg-[#111] transition-colors rounded-lg border border-gray-900">
                  <div>
                    <p className="text-white font-bold">{item.member?.name || 'Unnamed'}</p>
                    <p className="text-xs text-gray-500">{item.member?.phone || item.member?.email || 'N/A'}</p>
                  </div>
                  <div className="text-right">
                    {/* 🔥 THE FIX: Safely grab the due amount from whatever field backend sends */}
                    <p className="text-sm text-red-500 font-black">
                      {formatCurrency(item.totalPending || item.remainingAmount || item.amount || 0)}
                    </p>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-0.5">Due</p>
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
  <div className="bg-black border border-gray-900 p-6 rounded-xl flex items-center justify-between transition-transform hover:-translate-y-1 duration-300 shadow-lg">
    <div>
      <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1.5">{title}</p>
      <h3 className={`text-3xl font-black tracking-tight ${color}`}>{value}</h3>
    </div>
    <div className="bg-gray-900 p-3 rounded-xl border border-gray-800">
      <Icon className={`w-6 h-6 ${color}`} />
    </div>
  </div>
);

export default Dashboard;