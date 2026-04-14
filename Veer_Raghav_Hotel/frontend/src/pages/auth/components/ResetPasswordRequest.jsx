import { useEffect, useState } from 'react';
import { ArrowLeft, Mail, Loader2 } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import api from '@/utils/api';
import { useSettings } from '@/context/SettingsContext';
import TextAnimation from '@/components/TextAnimation';
import Footer from '@/components/Footer';

export default function ResetPasswordRequest() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { gethotel, hotelData } = useSettings();
    
  
    useEffect(() => {
      const fetchHotelInfo = async () => {
        await gethotel();
      };
  
      fetchHotelInfo();
    }, []);
  
  
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await api.post('/request-reset', { email });

      if (response.data.success) {
        setMessage(response.data.message);
      } else {
        throw new Error(response.data.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError(err.response.data.message || 'No account found with this email.');
      } else {
        setError(err.message || 'An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>

    <div className="min-h-screen flex items-center justify-center bg-cover bg-center relative" style={{ backgroundImage: "url('/image/temple1.webp')" }}>
      <div className="absolute inset-0 bg-black opacity-80"></div>
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20">
      <TextAnimation text={hotelData}/>
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-2xl relative z-10"
      >
        
        <div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => navigate(location.state?.from || '/')}
            className="flex items-center text-orange-600 hover:text-orange-500 mb-6 transition-colors duration-200"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back
          </motion.button>

          <motion.h2
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center text-3xl font-extrabold text-gray-900"
          >
            Reset your password
          </motion.h2>
          <motion.p
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-2 text-center text-sm text-gray-600"
          >
            Enter your email address and we'll send you a link to reset your password.
          </motion.p>
        </div>

        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Alert variant="success" className="bg-green-50 border-green-200">
                <AlertDescription className="text-green-600">{message}</AlertDescription>
              </Alert>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Alert variant="destructive" className="bg-red-50 border-red-200">
                <AlertDescription className="text-red-600">
                  {error}
                  {error.includes('No account exists') && (
                    <div className="mt-2 text-sm">
                      <Link to="/auth/register" className="text-orange-600 hover:text-orange-500 font-medium transition-colors duration-200">
                        Create an account
                      </Link>
                      {' '}or{' '}
                      <button
                        type="button"
                        onClick={() => setError('')}
                        className="text-orange-600 hover:text-orange-500 font-medium transition-colors duration-200"
                      >
                        try a different email
                      </button>
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.form
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 space-y-6"
          onSubmit={handleSubmit}
        >
          <div>
            <div className="relative">
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-lg relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm transition-colors duration-200"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loading ? (
                <Loader2 className="animate-spin mr-2" size={20} />
              ) : null}
              {loading ? 'Sending...' : 'Send reset link'}
            </motion.button>
          </div>
        </motion.form>
      </motion.div>
    </div>

    <Footer />
    </>
  );
}

