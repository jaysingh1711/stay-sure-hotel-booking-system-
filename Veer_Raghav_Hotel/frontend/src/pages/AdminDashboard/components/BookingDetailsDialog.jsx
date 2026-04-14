import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import ImageSlider from '@/pages/rooms/components/ImageSlider';
import StatusBadge from '@/components/StatusBadge';

const BookingDetailsDialog = ({ booking }) => {
  const formatDate = (date) => format(new Date(date), 'PPP');
  
  const getStatusColor = (status) => {
    const statusColors = {
      confirmed: "bg-green-500",
      pending: "bg-yellow-500",
      cancelled: "bg-red-500",
      "checked-in": "bg-blue-500",
      "checked-out": "bg-gray-500"
    };
    return statusColors[status.toLowerCase()] || "bg-gray-500";
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          View Details
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl text-black">
        <DialogHeader>
          <DialogTitle>Booking Details</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[80vh] px-1">
          <div className="space-y-6">
            {/* Booking Status Banner */}
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Booking ID: {booking.id}</h3>
              <Badge className={`${getStatusColor(booking.status)}`}>
                {booking.status}
              </Badge>
            </div>

            <Separator />

            {/* Guest Information */}
            <Card>
              <CardContent className="pt-6">
                <h4 className="text-sm font-semibold mb-4">Guest Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">{booking.user?.name || booking.guestName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{booking.user?.email || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">+91 {booking.user?.phoneno || 'N/A'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Room Information */}
            <Card>
              <CardContent className="pt-6">
                <h4 className="text-sm font-semibold mb-4">Room Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  {booking.roomImage && (
                    <div className="col-span-2">
                      <ImageSlider images={[booking.roomImage]} />
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-500">Room Number</p>
                    <p className="font-medium">Room {booking.roomNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Room Type</p>
                    <p className="font-medium">{booking.room?.type || 'Standard'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Booking Details */}
            <Card>
              <CardContent className="pt-6">
                <h4 className="text-sm font-semibold mb-4">Booking Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Check-in Date</p>
                    <p className="font-medium">{formatDate(booking.checkInDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Check-out Date</p>
                    <p className="font-medium">{formatDate(booking.checkOutDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Paid</p>
                    <p className="font-medium">₹ {booking.totalPrice}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Booking Created At</p>
                    <p className="font-medium">{booking.createdAtFormatted} </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Number of Nights</p>
                    <p className="font-medium">
                      {Math.ceil(
                        (new Date(booking.checkOutDate) - new Date(booking.checkInDate)) / 
                        (1000 * 60 * 60 * 24)
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card>
              <CardContent className="pt-6">
                <h4 className="text-sm font-semibold mb-4">Payment Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Payment Status</p>
                   <StatusBadge status={booking.paymentStatus} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Payment Method</p>
                    <p className="font-medium">{booking.paymentMethod || 'Not specified'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Special Requests */}
            {booking.specialRequests && (
              <Card>
                <CardContent className="pt-6">
                  <h4 className="text-sm font-semibold mb-4">Special Requests</h4>
                  <p className="text-sm">{booking.specialRequests}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDetailsDialog;
