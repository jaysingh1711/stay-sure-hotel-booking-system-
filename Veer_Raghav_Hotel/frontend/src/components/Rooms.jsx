import React from 'react'
import { InfiniteMovingCards } from "./ui/infinite-moving-cards";

function Rooms() {
    const testimonials = [
        {
          quote: "Premium Room",
          image: "/image/room3.jpeg"
        },
        {
          quote: "Super Deluxe",
          image: "/image/room8.jpeg"
        },
        {
          quote: "Deluxe",
          image: "/image/room15.jpeg"
        },
        {
          quote: "Single Room",
          image: "/image/room7.jpeg"
        },
    ];
      
  return (
    <div className="h-[40rem]  rounded-md flex flex-col antialiased bg-white dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden" style={{ zIndex: -1}}>
        <h1 className="font-serif font-bold text-4xl bg-gradient-to-r from-[#FF9933] to-[#FFD700] text-transparent bg-clip-text flex items-center justify-center m-10">Rooms Available</h1>
        <div className="w-full max-w-6xl">
          <InfiniteMovingCards
            items={testimonials}
            direction="right"
            speed="normal"
          />
        </div>
    </div>
  )
}

export default Rooms

