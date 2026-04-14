import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

const ImageSliderCards = () => {
  // Previous Skeleton components remain the same...
  const SkeletonOne = () => (
    <div className="text-center space-y-4 animate-in fade-in duration-700">
      <h3 className="text-3xl font-bold text-white">Luxury Suite</h3>
      <p className="text-xl text-gray-200">Experience ultimate comfort</p>
    </div>
  );

  const SkeletonTwo = () => (
    <div className="text-center space-y-4 animate-in fade-in duration-700">
      <h3 className="text-3xl font-bold text-white">Ocean View</h3>
      <p className="text-xl text-gray-200">Breathtaking vistas</p>
    </div>
  );

  const SkeletonThree = () => (
    <div className="text-center space-y-4 animate-in fade-in duration-700">
      <h3 className="text-3xl font-bold text-white">Deluxe Room</h3>
      <p className="text-xl text-gray-200">Modern elegance</p>
    </div>
  );

  const SkeletonFour = () => (
    <div className="text-center space-y-4 animate-in fade-in duration-700">
      <h3 className="text-3xl font-bold text-white">Premium Suite</h3>
      <p className="text-xl text-gray-200">Unmatched luxury</p>
    </div>
  );

  // Cards array remains the same...
  const cards = [
    {
      id: 1,
      content: <SkeletonOne />,
      className: "md:col-span-2",
      thumbnail: "/image/hotel3.jpeg",
    },
    {
      id: 2,
      content: <SkeletonTwo />,
      className: "col-span-1",
      thumbnail: "/image/room5.jpeg",
    },
    {
      id: 3,
      content: <SkeletonThree />,
      className: "col-span-1",
      thumbnail: "/image/room8.jpeg"
    },
    {
      id: 4,
      content: <SkeletonFour />,
      className: "md:col-span-2",
      thumbnail: "/image/hotel4.jpeg"
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  // Slide functions with enhanced timing...
  const nextSlide = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % cards.length);
    setTimeout(() => setIsAnimating(false), 700); // Increased animation duration
  }, [isAnimating, cards.length]);

  const prevSlide = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
    setTimeout(() => setIsAnimating(false), 700); // Increased animation duration
  }, [isAnimating, cards.length]);

  useEffect(() => {
    let intervalId;
    if (isPlaying) {
      intervalId = setInterval(() => {
        nextSlide();
      }, 5000); // Increased interval for better viewing
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isPlaying, nextSlide]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="w-full mx-auto px-4 py-12">
      <div className="relative overflow-hidden text-center space-y-8">
        <div className="relative space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-600 to-orange-400 text-transparent bg-clip-text animate-fade-in">
            Discover Our Luxury Rooms
          </h1>
          <p className="text-xl text-gray-600 animate-slide-up">
            Experience unparalleled comfort and elegance
          </p>
          <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-32 bg-orange-100/50 blur-3xl"/>
        </div>

        <Card
          className="group relative h-[600px] w-full overflow-hidden rounded-xl shadow-2xl"
        >
          <div 
            className={`absolute inset-0 transition-all duration-700 ease-in-out transform ${
              isAnimating 
                ? direction > 0 
                  ? 'translate-x-full opacity-0 scale-105' 
                  : '-translate-x-full opacity-0 scale-105'
                : 'translate-x-0 opacity-100 scale-100'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60 transition-opacity duration-500 group-hover:opacity-40" />
            <img
              src={cards[currentIndex].thumbnail}
              alt={`Slide ${currentIndex + 1}`}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <CardContent className="absolute inset-0 flex items-center justify-center p-6">
              <div className="transform transition-all duration-500 group-hover:scale-105">
                {cards[currentIndex].content}
              </div>
            </CardContent>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={prevSlide}
            className="absolute left-4 top-1/2 h-12 w-12 -translate-y-1/2 rounded-full bg-white/80 hover:bg-white transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={nextSlide}
            className="absolute right-4 top-1/2 h-12 w-12 -translate-y-1/2 rounded-full bg-white/80 hover:bg-white transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={togglePlayPause}
            className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/80 hover:bg-white transition-all duration-300 hover:scale-110"
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </Button>
        </Card>

        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-3">
          {cards.map((_, index) => (
            <div
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 cursor-pointer transition-all duration-500 rounded-full ${
                index === currentIndex 
                  ? 'bg-white w-8' 
                  : 'bg-white/50 w-2 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageSliderCards;