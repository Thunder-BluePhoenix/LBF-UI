import { useEffect, useState } from 'react';
import { BiHide, BiShowAlt } from 'react-icons/bi';
import { useFrappeAuth } from 'frappe-react-sdk';
import Frame from '../assets/Frame 1430105876.png';
import Frame2 from '../assets/image 21.png';
import { useNavigate } from 'react-router-dom';

// Add onLogin prop to trigger authentication state update
const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { currentUser,login, error, isValidating ,} = useFrappeAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkCurrentUser = async () => {
      if (currentUser) {
        navigate('/customer_portal/home'); // Redirect to dashboard if logged in
      }
    };
  
    checkCurrentUser();
  }, [currentUser]);
  

  const handleLogin = async (e: { preventDefault: () => void }) => {

    e.preventDefault();
    
    try {
      await login({
        username: username,
        password: password,
      });
    
      console.log('Login successful');
      navigate('/customer_portal/bill-of-landing-list'); // Redirect to blo-list after login
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <div className="flex w-full bg-gray-200 items-center justify-center h-screen bg-cover bg-center">
      <div className="bg-[#ffff] shadow-sm bg-opacity-50 p-4 rounded max-w-4xl w-full flex gap-12">
        <div className="text-white max-w-sm">
          <img src={Frame} className="w-[400px]" alt="Frame" />
        </div>
        <div className="p-4 flex flex-col gap-2 rounded-xl w-96">
          <img src={Frame2} className="w-[150px]" alt="Frame 2" />
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Welcome!</h2>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
              {error.message || 'Authentication failed'}
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="mb-4">
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border-gray-300 rounded-lg p-2 border focus:ring-2 focus:ring-orange-500"
                disabled={isValidating}
              />
            </div>
            <div className="mb-4">
              <div className="relative w-full">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-gray-300 rounded-lg p-2 border focus:ring-2 focus:ring-orange-500"
                  disabled={isValidating}
                />
                <div
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-orange-500 cursor-pointer"
                >
                  {showPassword ? <BiShowAlt /> : <BiHide />}
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-orange-500 text-white py-2 rounded-lg text-lg font-semibold hover:bg-orange-600 disabled:bg-orange-300"
              disabled={isValidating}
            >
              {isValidating ? 'Logging in...' : 'Log in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
