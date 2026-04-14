import React from 'react';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const PriceDisplay = ({ 
  basePrice = 0,
  discountedPrice = 0,
  numberOfRooms = 1,
  numberOfNights = 1,
  taxes = {
    vat: 0,
    serviceTax: 0,
    other: 0
  },
  showTaxBreakdown = false,
  className = ""
}) => {
  const calculatePrice = () => {
    const pricePerNight = discountedPrice > 0 ? discountedPrice : basePrice;
    let totalBasePrice = pricePerNight * numberOfRooms * numberOfNights;

    // Apply discounts based on number of nights
    if (numberOfNights >= 5) {
      totalBasePrice *= 0.9; // 10% discount for 5+ nights
    } else if (numberOfNights > 1) {
      totalBasePrice *= 0.95; // 5% discount for 2-4 nights
    }

    return Math.round(totalBasePrice);
  };

  const calculateTotalTaxes = (baseAmount) => {
    if (!taxes) return 0;
    const totalTaxPercentage = (taxes.vat || 0) + (taxes.serviceTax || 0) + (taxes.other || 0);
    return Math.round((baseAmount * totalTaxPercentage) / 100);
  };

  const baseAmount = calculatePrice();
  const taxAmount = calculateTotalTaxes(baseAmount);
  const finalPrice = baseAmount + taxAmount;

  const getTaxBreakdown = () => {
    const vatAmount = (baseAmount * (taxes.vat || 0)) / 100;
    const serviceTaxAmount = (baseAmount * (taxes.serviceTax || 0)) / 100;
    const otherTaxAmount = (baseAmount * (taxes.other || 0)) / 100;

    return {
      vat: Math.round(vatAmount),
      serviceTax: Math.round(serviceTaxAmount),
      other: Math.round(otherTaxAmount)
    };
  };

  return (
    <div className={`space-y-1 ${className}`}>
      <div className="flex items-center gap-2">
        {discountedPrice > 0 && (
          <span className="text-gray-500 line-through">₹{basePrice}</span>
        )}
        <span className="text-lg font-bold">₹{baseAmount}</span>
        {showTaxBreakdown ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="w-4 h-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <div className="space-y-1">
                  <p>Base Price: ₹{baseAmount}</p>
                  {taxes.vat > 0 && <p>VAT ({taxes.vat}%): ₹{getTaxBreakdown().vat}</p>}
                  {taxes.serviceTax > 0 && <p>Service Tax ({taxes.serviceTax}%): ₹{getTaxBreakdown().serviceTax}</p>}
                  {taxes.other > 0 && <p>Other Taxes ({taxes.other}%): ₹{getTaxBreakdown().other}</p>}
                  <div className="border-t pt-1">
                    <p className="font-semibold">Total: ₹{finalPrice}</p>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="w-4 h-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p>+₹{taxAmount} taxes</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <span className="text-xs text-gray-500">
        {numberOfRooms > 1 ? `per night for ${numberOfRooms} rooms` : 'per night'}
        {numberOfNights > 1 && ` • ${numberOfNights} nights`}
        {numberOfNights >= 5 ? ' • 10% off' : numberOfNights > 1 ? ' • 5% off' : ''}
      </span>
    </div>
  );
};

export default PriceDisplay;