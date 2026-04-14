import React, { useState } from 'react';
import { motion } from 'framer-motion';

const templeImageVariants = {
  hidden: { opacity: 0, y: 100 },  // Start below the screen
  visible: { opacity: 1, y: 0 },   // Move to its normal position
  exit: { opacity: 0, y: -100 },   // Move upwards when exiting
};

const templeTextVariants = {
  hidden: { opacity: 0, y: 50 },  
  visible: { opacity: 1, y: 0 },  
  exit: { opacity: 0, y: -50 },  
};

const templeTransition = {
  duration: 3,  
  ease: "easeInOut",
};

const textTransition = {
  duration: 1,   
  ease: "easeInOut",
  delay: 1,   
};

const AnimationPage = () => {
  const [showContent, setShowContent] = useState(true);

  const handleAnimationComplete = () => {
    setShowContent(false);
  };

  return (
    <>
      {showContent && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={templeImageVariants}
          transition={templeTransition}
          onAnimationComplete={handleAnimationComplete}
          className="relative w-full h-screen overflow-hidden"
        >
          <div className='absolute inset-0 bg-black/50 opacity-50'/>
          {/* Full-screen temple image */}
          <img
            src="https://i.ibb.co/0JY4zRs/temple.jpg"
            alt="Temple"
            className="w-full h-full object-cover"
          />

          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={templeTextVariants}
            transition={textTransition}
            className="absolute top-1/2 left-0 right-0 transform -translate-y-1/2 text-center text-white z-10"
          >
            <h1 className="text-4xl md:text-6xl font-bold">Welcome to the veer raghav hotel
            </h1>
            <p className="text-lg md:text-2xl mt-4">Find peace and spirituality</p>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default AnimationPage;
