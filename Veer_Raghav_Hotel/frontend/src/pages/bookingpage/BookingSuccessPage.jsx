import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { CheckCircle2, CalendarCheck, Clock, User, Building, ArrowLeft, CreditCard, Mail } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { IoLogoWhatsapp } from 'react-icons/io5';
import { useToast } from '@/hooks/use-toast';
import DownloadReceipt from '@/components/DownloadReceipt';
import { useAuth } from '@/hooks/useAuth';

export default function BookingSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const bookingData = location.state;
  const {user} = useAuth();

  if (!user) {
    toast({
      title: "Error",
      description: "User is not authenticated. Please log in.",
      variant: "destructive",
    });
    return null;
  }

  if (!bookingData) {
    toast({
      title: "Error",
      description: "Booking data is missing. Please try booking again.",
      variant: "destructive",
    });
    return null;
  }
  

  const startDate = new Date(bookingData?.checkInDate);
  const endDate = new Date(bookingData?.checkOutDate);
  const nights = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => navigate('/rooms')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
      </Button>

      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
          <h1 className="text-3xl font-bold">Booking Confirmed!</h1>
          <p className="text-muted-foreground">
            Booking ID: {bookingData?.booking?._id}
          </p>
        </div>

        <Alert className="bg-green-50">
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>
            Your booking has been confirmed. You will receive updates about your booking on WhatsApp and email. <span className='font-semibold'>Room number will be assigned to you soon.</span>
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle>Booking Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">{bookingData?.roomName}</h3>
              <p className="text-muted-foreground">{bookingData?.roomType}</p>
            </div>

            <Separator />

            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CalendarCheck className="h-4 w-4" />
                  <span>Check-in</span>
                </div>
                <span className="font-medium">
                  {format(startDate, 'PPP')}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Check-out</span>
                </div>
                <span className="font-medium">
                  {format(endDate, 'PPP')}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Guests</span>
                </div>
                <span className="font-medium">{bookingData?.guests}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  <span>Rooms</span>
                </div>
                <span className="font-medium">{bookingData?.roomCount}</span>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              
              {/* Tax Breakdown */}
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">VAT</span>
                  <span>₹{bookingData?.taxes?.vat?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Service Tax</span>
                  <span>₹{bookingData?.taxes?.serviceTax?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Other Charges</span>
                  <span>₹{bookingData?.taxes?.other?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-medium">
                  <span>Total Taxes & Fees</span>
                  <span>₹{bookingData?.taxes?.vat + bookingData?.taxes?.serviceTax + bookingData?.taxes?.other}</span>
                </div>
              </div>

              <Separator />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total Amount Paid</span>
                <span>₹{bookingData?.totalPrice?.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Download Receipt</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground mb-4">
              Download your booking receipt to present during check-in. This receipt contains all the necessary booking details.
            </p>
            <DownloadReceipt bookingData={bookingData} />
          </CardContent>
        </Card>

        <Separator />

        <div className='flex justify-center'>
          <Button 
            variant="outline" 
            className="w-1/2 bg-orange-800 hover:bg-orange-500 text-white" 
            onClick={() => navigate('/profile/bookings')}
          >
            Back to My Bookings
          </Button>
        </div>

        <Separator />

        <Card>
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-blue-500" />
              <div>
                <p className="font-medium">Payment Method</p>
                <p className="text-sm text-muted-foreground">Visa ending in 4242</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Communication Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <IoLogoWhatsapp className="h-5 w-5 text-green-500" />
              <div>
                <p className="font-medium">WhatsApp Updates</p>
                <p className="text-sm text-muted-foreground">You'll receive booking updates and reminders on your registered WhatsApp number</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-blue-500" />
              <div>
                <p className="font-medium">Email Updates</p>
                <p className="text-sm text-muted-foreground">Booking confirmation and updates will be sent to your email address</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}