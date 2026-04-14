import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from 'lucide-react';

const RoomCard = ({ room, filters, onBookNow }) => {
  const calculateSavings = (original, discounted, nights, rooms) => {
    const originalTotal = original * nights * rooms;
    const discountedTotal = discounted * nights * rooms;
    return originalTotal - discountedTotal;
  };

  const calculateTotalPrice = () => {
    const nights = filters?.startDate && filters?.endDate
      ? Math.ceil(Math.abs(filters.endDate - filters.startDate) / (1000 * 60 * 60 * 24))
      : 1;
    const roomCount = parseInt(filters?.rooms ?? "1");
    
    // Simple multiplication without extra discounts
    const basePrice = room.pricePerNight;
    const totalBasePrice = basePrice * nights * roomCount;
    const Discount = room.DiscountedPrice;
    const totalDiscountPrice = Discount * nights * roomCount;

    
    // Calculate savings from original price to discounted price
    const savings = calculateSavings(
      room.pricePerNight,
      room.DiscountedPrice,
      nights,
      roomCount
    );

    return {
      totalBasePrice: Math.round(totalBasePrice),
      totalDiscountPrice: Math.round(totalDiscountPrice),
      savings: Math.round(savings),
      perNightPrice: room.DiscountedPrice || room.pricePerNight,
      nights,
      roomCount
    };
  };

  const pricing = calculateTotalPrice();

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          {room.DiscountedPrice > 0 && (
            <>
              <span className="text-gray-500 line-through">₹{pricing.totalBasePrice}</span>
              <span className="text-green-600 text-sm">
                Save ₹{pricing.savings}
              </span>
            </>
          )}
        </div>
        <span className="text-lg sm:text-xl font-bold">
          ₹{pricing.totalDiscountPrice}
        </span>
        <div className="flex flex-col text-xs text-gray-500">
          <span>
            {pricing.roomCount > 1 
              ? `₹${pricing.perNightPrice} × ${pricing.nights} nights × ${pricing.roomCount} rooms`
              : `₹${pricing.perNightPrice} × ${pricing.nights} nights`
            }
          </span>
          <span>Excluding taxes and fees</span>
        </div>
      </div>
      
      <Button
        onClick={() => onBookNow(room._id)}
        className="bg-orange-600 w-full sm:w-auto hover:bg-orange-700"
        disabled={!room.isAvailable}
      >
        {room.isAvailable ? 'Book Now' : 'Not Available'}
      </Button>
    </div>
  );
};

export default RoomCard;