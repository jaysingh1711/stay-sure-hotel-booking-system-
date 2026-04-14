import React, { useEffect, useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export const PaymentProcessingModal = ({ isOpen, bookingData, onSuccess }) => {
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Simulate payment processing
      const timer = setTimeout(() => {
        setIsSuccess(true);
        // Generate booking ID and pass all data to success page
        const bookingId = 'BK' + Math.random().toString(36).substr(2, 9).toUpperCase();
        setTimeout(() => {
          onSuccess({
            ...bookingData,
            bookingId,
            paymentStatus: 'completed',
            paymentTimestamp: new Date().toISOString()
          });
        }, 2000);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, bookingData, onSuccess]);

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            {!isSuccess ? 'Processing Payment' : 'Payment Successful'}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center p-6 space-y-4">
          {!isSuccess ? (
            <>
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-center text-muted-foreground">
                Please wait while we process your payment...
              </p>
            </>
          ) : (
            <>
              <CheckCircle2 className="h-12 w-12 text-green-500" />
              <div className="text-center space-y-2">
                <p className="font-medium">Your booking has been confirmed!</p>
                <p className="text-sm text-muted-foreground">
                  Redirecting you to the booking details...
                </p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};