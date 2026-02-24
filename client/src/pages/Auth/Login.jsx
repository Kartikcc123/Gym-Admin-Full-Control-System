import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dumbbell, Lock, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { loginAdmin } from '../../api/authApi'; // Removed registerAdmin

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await loginAdmin(formData);
      toast.success(`Welcome back, ${data.name}!`, { style: { background: '#166534', color: '#fff' }});

      // Save the digital badge and user details to the browser
      localStorage.setItem('userInfo', JSON.stringify(data));
      
      // Send them to the dashboard
      navigate('/dashboard');
      window.location.reload(); 

    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid email or password', { style: { background: '#dc2626', color: '#fff' }});
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#0a0a0a] border border-gray-900 rounded-2xl p-8 shadow-[0_0_50px_rgba(220,38,38,0.1)]">
        
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mb-4 border border-red-900/30">
            <Dumbbell className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-black text-white uppercase tracking-widest">NextGenz ERP</h1>
          <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mt-2">
            Admin Secure Login
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
              <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full bg-black border border-gray-900 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-red-600 transition-colors" placeholder="admin@nextgenz.com" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
              <input type="password" name="password" value={formData.password} onChange={handleChange} required className="w-full bg-black border border-gray-900 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-red-600 transition-colors" placeholder="••••••••" />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-red-600 hover:bg-red-700 text-white rounded-lg py-3 font-bold uppercase tracking-widest transition-colors mt-6 shadow-[0_0_20px_rgba(220,38,38,0.2)] disabled:opacity-50">
            {loading ? 'Authenticating...' : 'Access Command Center'}
          </button>
        </form>

      </div>
    </div>
  );
};

export default Login;