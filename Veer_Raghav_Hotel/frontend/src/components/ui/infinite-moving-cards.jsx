import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const InfiniteMovingCards = ({
  items,
  direction = 'left',
  speed = 'fast',
  pauseOnHover = true,
}) => {
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [duplicatedItems, setDuplicatedItems] = useState([]);

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }
    setDuplicatedItems([...items, ...items]);
  }, [items]);

  const duration = speed === 'fast' ? 20 : speed === 'normal' ? 40 : 60;

  return (
    <div className="relative max-w-7xl z-20 overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]" ref={containerRef}>
      <motion.div
        className="flex"
        animate={{
          x: direction === 'left' ? [-containerWidth, 0] : [0, -containerWidth],
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: 'linear',
        }}
        whileHover={{ animationPlayState: pauseOnHover ? 'paused' : 'running' }}
      >
        {duplicatedItems.map((item, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-[300px] mx-4"
          >
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img
                src={item.image}
                alt={item.quote}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <p className="text-lg font-semibold text-center">{item.quote}</p>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};
