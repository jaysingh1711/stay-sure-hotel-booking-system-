import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // Replacing usePathname with useLocation
import { motion, AnimatePresence } from 'framer-motion';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import { useAuth } from '@/hooks/useAuth';
import { useSettings } from '@/context/SettingsContext';
import { Card, CardContent } from '@/components/ui/card';


export default function AuthLayout() {
  const location = useLocation(); // Using useLocation to get the current path
  const [isLogin, setIsLogin] = useState(true);

  // const from = location.state?.from?.pathname || "/";

  const { user } = useAuth();

  if (user && user.role === 'admin') {
    window.location.href = '/dashboard'; // Redirect if user is already logged in
  } else if (user && user.role === 'user') {
    window.location.href = '/'; // Redirect if user is already logged in
  }

  useEffect(() => {
    setIsLogin(location.pathname === '/auth/login'); // Set isLogin based on path
  }, [location]);


  const { gethotel, hotelData } = useSettings();


  useEffect(() => {
    const fetchHotelInfo = async () => {
      await gethotel();
    };

    fetchHotelInfo();
  }, []);



  const pageVariants = {
    initial: { opacity: 0, y: 50 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -50 }
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.5
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white">
      {/* Left side - Image and Welcome Text */}
      <motion.div
        className="lg:w-1/2 relative overflow-hidden"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className='absolute inset-0 bg-black/70 z-10' />
        <motion.div
          className='absolute top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-20 w-full px-4'
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">Welcome to {hotelData?.name}</h1>
          <p className="text-xl text-white">Discover the Hotel</p>
        </motion.div>
        <img
          src="/image/temple1.webp"
          alt="Authentication background"
          className="object-cover w-full h-full"
        />
      </motion.div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 bg-white">
        <Card className="w-full max-w-lg">
          <CardContent className="p-8">
            <AnimatePresence mode='wait'>
              <motion.div
                key={isLogin ? 'login' : 'register'}
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                

                {isLogin ? <LoginForm /> : <RegisterForm />}

              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
