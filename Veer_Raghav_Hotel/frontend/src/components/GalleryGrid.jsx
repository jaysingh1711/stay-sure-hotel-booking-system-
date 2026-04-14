import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const GalleryGrid = ({ cards }) => {
  const [selectedCard, setSelectedCard] = useState(null);

  const handleClick = (card) => {
    setSelectedCard(card);
  };

  const handleCloseModal = () => {
    setSelectedCard(null);
  };

  return (
    <>
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
        {cards.map((card) => (
          <motion.div
            key={card.id}
            layoutId={`card-${card.id}`}
            onClick={() => handleClick(card)}
            className={`${card.className} relative overflow-hidden rounded-lg cursor-pointer`}
          >
            <motion.img
              layoutId={`image-${card.id}`}
              src={card.thumbnail}
              alt={`Thumbnail ${card.id}`}
              className="w-full h-full object-cover"
            />
          </motion.div>
        ))}
      </div>
      <AnimatePresence>
        {selectedCard && (
          <Modal card={selectedCard} onClose={handleCloseModal} />
        )}
      </AnimatePresence>
    </>
  );
};

const Modal = ({ card, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        layoutId={`card-${card.id}`}
        className="bg-white rounded-lg overflow-hidden max-w-3xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <motion.img
            layoutId={`image-${card.id}`}
            src={card.thumbnail}
            alt={`Full size ${card.id}`}
            className="w-full h-auto"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end p-6">
            <div className="text-white">{card.content}</div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </motion.div>
    </motion.div>
  );
};
