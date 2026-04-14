import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const RoomRating = ({ booking, user, onRatingSubmit }) => {
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isRatingDialogOpen, setIsRatingDialogOpen] = useState(false);
  const [localRatings, setLocalRatings] = useState(booking.room.ratings || []);
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);

  // Find user's existing rating if any
  const userExistingRating = localRatings.find(
    rating => rating.userId === user?._id
  );

  const calculateAverageRating = (ratings) => {
    if (!ratings || ratings.length === 0) return "New";
    const avg = ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length;
    return avg.toFixed(1);
  };

  const handleRatingSubmit = async () => {
    if (!selectedRating) return;

    setIsSubmittingRating(true);
    
    // Optimistically update the UI
    const newRating = {
      userId: user._id,
      rating: selectedRating
    };
    
    setLocalRatings(prev => [...prev, newRating]);

    try {
      const response = await onRatingSubmit(selectedRating);
      
      if (response.success) {
        // Update was successful, dialog can be closed
        setIsRatingDialogOpen(false);
      } else {
        // If the server update failed, revert the optimistic update
        setLocalRatings(booking.room.ratings || []);
        throw new Error(response.message || 'Failed to submit rating');
      }
    } catch (error) {
      // Revert optimistic update on error
      setLocalRatings(booking.room.ratings || []);
      console.error('Rating submission failed:', error);
    } finally {
      setIsSubmittingRating(false);
      setSelectedRating(0);
    }
  };

  const RatingStars = ({ rating, onRatingChange, interactive = true }) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-6 h-6 cursor-pointer ${
              (interactive ? hoveredRating || selectedRating : rating) >= star
                ? 'text-yellow-500 fill-yellow-500'
                : 'text-gray-300'
            }`}
            onMouseEnter={() => interactive && setHoveredRating(star)}
            onMouseLeave={() => interactive && setHoveredRating(0)}
            onClick={() => {
              if (interactive) {
                setSelectedRating(star);
                setIsRatingDialogOpen(true);
              }
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rate Your Stay</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {userExistingRating ? (
          <div className="space-y-4">
            <Alert>
              <AlertDescription>
                You rated this room {userExistingRating.rating} stars
              </AlertDescription>
            </Alert>
            <RatingStars rating={userExistingRating.rating} interactive={false} />
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <RatingStars
              rating={selectedRating}
              onRatingChange={(rating) => {
                setSelectedRating(rating);
                setIsRatingDialogOpen(true);
              }}
            />
            <span className="text-sm text-gray-500">Click to rate</span>
          </div>
        )}
        
        <div className="mt-2">
          <span className="text-sm text-gray-500">
            {`Average rating: ${calculateAverageRating(localRatings)}`}
          </span>
        </div>
      </CardContent>

      <Dialog open={isRatingDialogOpen} onOpenChange={setIsRatingDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rate Your Stay</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            <RatingStars rating={selectedRating} onRatingChange={setSelectedRating} />
            <p className="text-sm text-gray-500">
              {selectedRating === 0
                ? "Select your rating"
                : `You're giving ${selectedRating} star${selectedRating !== 1 ? 's' : ''}`}
            </p>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button 
              onClick={handleRatingSubmit} 
              disabled={!selectedRating || isSubmittingRating}
            >
              {isSubmittingRating ? "Submitting..." : "Submit Rating"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default RoomRating;