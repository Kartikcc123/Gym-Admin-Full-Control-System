import { useState, useEffect } from 'react';
import { QrCode, CheckCircle2, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { getTodayAttendance, markAttendance } from '../../api/attendanceApi';

const Attendance = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [memberIdInput, setMemberIdInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const fetchAttendance = async () => {
    try {
      const result = await getTodayAttendance();
      setRecords(result);
    } catch (error) {
      toast.error('Failed to load attendance records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const handleManualCheckIn = async (e) => {
    e.preventDefault();
    if (!memberIdInput) return;

    setIsScanning(true);
    try {
      const response = await markAttendance(memberIdInput);
      toast.success(response.message, { style: { background: '#166534', color: '#fff' }});
      setMemberIdInput('');
      fetchAttendance(); // Refresh the list
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to check in';
      toast.error(message, { style: { background: '#dc2626', color: '#fff' }});
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black uppercase tracking-widest text-white mb-1">Access Control</h1>
        <p className="text-gray-500 font-medium tracking-wide">Monitor live gym check-ins</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Scanner Section */}
        <div className="lg:col-span-1">
          <div className="bg-black border border-gray-900 rounded-xl p-6 relative overflow-hidden flex flex-col items-center text-center">
            {/* Pulsing red background effect */}
            <div className="absolute top-0 left-0 w-full h-1 bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.8)] animate-pulse"></div>
            
            <QrCode className="w-24 h-24 text-red-600 mb-6 mt-4 opacity-80" />
            <h2 className="text-xl font-black text-white uppercase tracking-widest mb-2">QR Scanner</h2>
            <p className="text-sm text-gray-500 mb-8">Live camera feed will be injected here. For now, enter a Member ID manually to simulate a scan.</p>
            
            <form onSubmit={handleManualCheckIn} className="w-full">
              <input 
                type="text" 
                value={memberIdInput}
                onChange={(e) => setMemberIdInput(e.target.value)}
                placeholder="Paste Member ID..." 
                className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg p-3 text-center text-white focus:outline-none focus:border-red-600 mb-4 tracking-widest"
              />
              <button 
                type="submit" 
                disabled={isScanning}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
              >
                {isScanning ? 'Processing...' : 'Simulate Scan'}
              </button>
            </form>
          </div>
        </div>

        {/* Live Feed Section */}
        <div className="lg:col-span-2 bg-black border border-gray-900 rounded-xl overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-900 bg-[#050505] flex justify-between items-center">
            <h2 className="text-lg font-bold text-white uppercase tracking-widest">Today's Check-ins</h2>
            <div className="flex items-center text-red-500 font-bold bg-red-900/10 px-3 py-1 rounded-full text-xs">
              <Clock className="w-4 h-4 mr-2" />
              Live Feed
            </div>
          </div>
          
          <div className="flex-1 p-6 overflow-y-auto max-h-[500px] space-y-4">
            {loading ? (
              <p className="text-gray-500 uppercase tracking-widest animate-pulse font-bold text-center">Syncing Access Logs...</p>
            ) : records.length === 0 ? (
              <div className="text-center text-gray-500 py-10">No check-ins yet today. The gym is empty.</div>
            ) : (
              records.map((record) => (
                <div key={record._id} className="flex items-center justify-between p-4 bg-[#0a0a0a] border border-gray-800 rounded-lg shadow-sm">
                  <div className="flex items-center">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mr-4" />
                    <div>
                      <p className="text-white font-bold">{record.member?.name || 'Unknown Member'}</p>
                      <p className="text-xs text-gray-500">{record.member?.phone || 'No phone'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                      {new Date(record.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
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

export default Attendance;