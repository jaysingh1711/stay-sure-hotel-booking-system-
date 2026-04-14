import React from "react";
import { GalleryGrid } from "@/components/GalleryGrid";

// Define the skeleton components first
const SkeletonOne = () => (
  <div>
    <p className="font-bold md:text-4xl text-xl text-white">
      House in the woods
    </p>
    <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
      A serene and tranquil retreat, this house in the woods offers a peaceful
      escape from the hustle and bustle of city life.
    </p>
  </div>
);

const SkeletonTwo = () => (
  <div>
    <p className="font-bold md:text-4xl text-xl text-white">
      House above the clouds
    </p>
    <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
      Perched high above the world, this house offers breathtaking views and a
      unique living experience. It&apos;s a place where the sky meets home, and
      tranquility is a way of life.
    </p>
  </div>
);

const SkeletonThree = () => (
  <div>
    <p className="font-bold md:text-4xl text-xl text-white">Greens all over</p>
    <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
      A house surrounded by greenery and nature&apos;s beauty. It&apos;s the
      perfect place to relax, unwind, and enjoy life.
    </p>
  </div>
);

const SkeletonFour = () => (
  <div>
    <p className="font-bold md:text-4xl text-xl text-white">
      Rivers are serene
    </p>
    <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
      A house by the river is a place of peace and tranquility. It&apos;s the
      perfect place to relax, unwind, and enjoy life.
    </p>
  </div>
);

function Gallery() {
  // Define the cards array with unique IDs
  const cards = [
    {
      id: 1,
      content: <SkeletonOne />,
      className: "md:col-span-2 animateCard",
      thumbnail: "/image/hotel3.jpeg",
    },
    {
      id: 2,
      content: <SkeletonTwo />,
      className: "col-span-1 animateCard",
      thumbnail: "/image/room3.jpeg",
    },
    {
      id: 3,
      content: <SkeletonThree />,
      className: "col-span-1 animateCard",
      thumbnail: "/image/room8.jpeg",
    },
    {
      id: 4,
      content: <SkeletonFour />,
      className: "md:col-span-2 animateCard",
      thumbnail: "/image/hotel4.jpeg",
    },
    {
      id: 5,
      content: <SkeletonOne />,
      className: "md:col-span-2 animateCard",
      thumbnail: "/image/hotel2.jpeg",
    },
    {
      id: 6,
      content: <SkeletonTwo />,
      className: "col-span-1 animateCard",
      thumbnail: "/image/room3.jpeg",
    },
    {
      id: 7,
      content: <SkeletonThree />,
      className: "col-span-1 animateCard",
      thumbnail: "/image/room3.jpeg",
    },
    {
      id: 8,
      content: <SkeletonFour />,
      className: "md:col-span-2 animateCard",
      thumbnail: "/image/hotel5.jpeg",
    },
    {
      id: 9,
      content: <SkeletonOne />,
      className: "md:col-span-2 animateCard",
      thumbnail: "/image/hotel6.jpeg",
    },
    {
      id: 10,
      content: <SkeletonTwo />,
      className: "col-span-1 animateCard",
      thumbnail: "/image/room7.jpeg",
    },
    {
      id: 11,
      content: <SkeletonFour />,
      className: "md:col-span-2 animateCard",
      thumbnail: "/image/room8.jpeg",
    },
    {
      id: 12,
      content: <SkeletonOne />,
      className: "md:col-span-2 animateCard",
      thumbnail: "/image/room11.jpeg",
    },
    {
      id: 13,
      content: <SkeletonThree />,
      className: "col-span-1 animateCard",
      thumbnail: "/image/room17.jpeg",
    },
    {
      id: 14,
      content: <SkeletonFour />,
      className: "md:col-span-2 animateCard",
      thumbnail: "/image/room17.jpeg",
    },
  ];

  return (
    <div className=" min-h-screen w-full py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-serif font-bold text-center mb-12">
          Our Hotel Gallery
        </h1>
        <GalleryGrid cards={cards} />
      </div>
    </div>
  );
}

export default Gallery;

