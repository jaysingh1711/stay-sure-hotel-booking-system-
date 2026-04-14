import React from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { format, differenceInDays } from 'date-fns';

const PriceDetails = ({ 
  pricePerNight, 
  discountedPrice, 
  taxes, 
  roomCount = 1,
  date,
  finalPrice,
  totalTaxes
}) => {
  const basePrice = discountedPrice > 0 ? discountedPrice : pricePerNight;
  const savings = pricePerNight - discountedPrice;
  const nights = date?.from && date?.to ? differenceInDays(date.to, date.from) : 0;
  
  const subtotal = basePrice * roomCount * nights;

  return (
    <div className="space-y-4">
      {/* Base Price Display */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          {discountedPrice > 0 ? (
            <>
              <span className="text-lg font-semibold text-primary">₹{discountedPrice}</span>
              <span className="text-base line-through text-gray-400">₹{pricePerNight}</span>
              <span className="text-sm text-green-600">Save ₹{savings}</span>
            </>
          ) : (
            <span className="text-lg font-semibold text-primary">₹{pricePerNight}</span>
          )}
          <span className="text-sm text-gray-500">per night</span>
        </div>
      </div>

      {/* Price Breakdown */}
      {nights > 0 && (
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Base price × {nights} nights</span>
            <span>₹{basePrice * nights}</span>
          </div>
          {roomCount > 1 && (
            <div className="flex justify-between">
              <span>Room count × {roomCount}</span>
              <span>₹{subtotal}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Taxes and fees</span>
            <span>₹{totalTaxes.toFixed(2)}</span>
          </div>
        </div>
      )}

      {/* Final Price */}
      {nights > 0 && (
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-primary">
              Total: ₹{finalPrice.toFixed(2)}
            </span>
            
            {/* Tax Information Tooltip */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <span className="text-sm text-gray-500 underline cursor-pointer">
                    Tax breakdown
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <ul className="text-xs space-y-1">
                    <li>VAT: {taxes?.vat || 0}%</li>
                    <li>Service Tax: {taxes?.serviceTax || 0}%</li>
                    <li>Other Taxes: {taxes?.other || 0}%</li>
                  </ul>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <p className="text-xs text-gray-500 mt-2">
            Total for {nights} {nights === 1 ? 'night' : 'nights'}, {roomCount} {roomCount === 1 ? 'room' : 'rooms'}
          </p>
        </div>
      )}
    </div>
  );
};

export default PriceDetails;