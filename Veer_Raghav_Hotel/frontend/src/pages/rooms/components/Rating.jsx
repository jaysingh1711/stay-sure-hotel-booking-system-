import { Star } from 'lucide-react';
import React from 'react';con

const Rating = ({ value }) => {
  let label;

  if (value > 4.5) {
    label = "Excellent";
  } else if (value > 4) {
    label = "Very Good";
  } else if (value > 3.2) {
    label = "Good";
  } else {
    label = "Okay";
  }

  return (
    <div className="flex items-center text-yellow-500">
      <Star className="w-4 h-4 fill-current" />
      <span className="ml-1">{value?.toFixed(1)}</span>
      <span className="ml-2 text-sm text-gray-600">{label}</span>
    </div>
  );
};

export default Rating;
