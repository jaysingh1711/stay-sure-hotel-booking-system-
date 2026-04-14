import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import { Link, Outlet, ScrollRestoration } from 'react-router-dom'
import Footer from './components/Footer'
import AnimationPage from './components/animation'
import FloatingWhatsApp from './components/FloatingWhatsApp'

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if the user has visited before
    const hasVisitedBefore = localStorage.getItem('hasVisitedBefore');

    // If user has visited before, set loading to false immediately
    if (hasVisitedBefore) {
      setLoading(false);
    } else {
      // Set a timer to show the animation only for the first visit
      const timer = setTimeout(() => {
        setLoading(false);
        // After the animation, mark the user as visited
        localStorage.setItem('hasVisitedBefore', 'true');
      }, 2000); // 2-second animation duration

      // Cleanup timer on component unmount
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <>
      <ScrollRestoration />
      <div>{loading ? (
        <AnimationPage />
      ) : (
        <>
          <Navbar />
          <Outlet />
          <Footer />
        </>
      )}
      </div>

      <FloatingWhatsApp />
    </>
  )
}

export default App