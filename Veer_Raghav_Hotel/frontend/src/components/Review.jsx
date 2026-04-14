import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import img from '../components/image.png'
const ReviewSlider = () => {
    const reviews = [
        {
          id: 1,
          text: "The hotel was exceptional! The staff was friendly and accommodating, the room was spotless, and the amenities were top-notch. Will definitely be staying here again!",
          author: "Emily Watson",
          role: "Guest",
          rating: 5,
          avatar: img
        },
        {
          id: 2,
          text: "I had an incredible experience at this hotel. The location is perfect, just steps away from the beach. The breakfast selection was amazing and the spa was a dream.",
          author: "John Smith",
          role: "Guest",
          rating: 5,
          avatar: img
        },
        {
          id: 3,
          text: "Fantastic stay! The staff went out of their way to ensure my comfort. The room was spacious, and the view from the balcony was breathtaking. Highly recommend!",
          author: "Sophia Lee",
          role: "Guest",
          rating: 5,
          avatar:img
        },
        {
          id: 4,
          text: "The hotel is very well-maintained and has a cozy, inviting atmosphere. The pool area is perfect for relaxing, and the room service was prompt and friendly.",
          author: "David Brown",
          role: "Guest",
          rating: 4,
          avatar: img
        },
        {
          id: 5,
          text: "While the stay was generally good, I encountered a few issues with the check-in process. The staff was apologetic and resolved the situation quickly, but I think improvements can be made.",
          author: "Olivia Green",
          role: "Guest",
          rating: 3,
          avatar: img
        }
      ];
      

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const nextReview = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => 
      prevIndex === reviews.length - 1 ? 0 : prevIndex + 1
    );
    setTimeout(() => setIsAnimating(false), 500);
  };

  const previousReview = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? reviews.length - 1 : prevIndex - 1
    );
    setTimeout(() => setIsAnimating(false), 500);
  };

  useEffect(() => {
    const timer = setInterval(nextReview, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Clients Say</h2>
        <p className="text-lg text-gray-600">Discover why customers love our services</p>
      </div>

      <Card className="relative bg-gradient-to-br from-orange-50 to-white border-orange-100 shadow-lg">
        <CardContent className="pt-6">
          <div className="relative px-6 py-12">
            <Quote className="absolute top-6 left-6 h-12 w-12 text-orange-200" />
            <Quote className="absolute bottom-6 right-6 h-12 w-12 text-orange-200 transform rotate-180" />
            
            <div className={`space-y-8 transition-opacity duration-500 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
              <div className="flex flex-col items-center gap-6">
                <div className="relative">
                  <img 
                    src={reviews[currentIndex].avatar}
                    alt={reviews[currentIndex].author}
                    className="w-24 h-24 rounded-full border-4 border-orange-200 object-cover"
                  />
                </div>

                <div className="flex gap-2">
                  {[...Array(reviews[currentIndex].rating)].map((_, i) => (
                    <svg key={i} className="w-6 h-6 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>

              <p className="text-xl text-center text-gray-700 font-medium leading-relaxed px-8">
                {reviews[currentIndex].text}
              </p>
              
              <div className="text-center space-y-2">
                <p className="text-xl font-semibold text-orange-600">
                  {reviews[currentIndex].author}
                </p>
                <p className="text-base text-gray-500">
                  {reviews[currentIndex].role}
                </p>
              </div>
            </div>

            <div className="absolute inset-x-0 -bottom-6 flex justify-center items-center gap-8">
              <Button
                variant="ghost"
                size="icon"
                onClick={previousReview}
                className="h-12 w-12 rounded-full hover:bg-orange-100 hover:text-orange-600 transition-colors"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              
              <div className="flex gap-3">
                {reviews.map((_, index) => (
                  <div
                    key={index}
                    className={`h-3 w-3 rounded-full transition-colors duration-300 ${
                      index === currentIndex ? 'bg-orange-500' : 'bg-orange-200'
                    }`}
                  />
                ))}
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={nextReview}
                className="h-12 w-12 rounded-full hover:bg-orange-100 hover:text-orange-600 transition-colors"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewSlider;