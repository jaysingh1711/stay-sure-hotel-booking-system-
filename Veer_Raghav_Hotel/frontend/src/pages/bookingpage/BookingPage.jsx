import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import {
  Calendar,
  CreditCard,
  Shield,
  User,
  CalendarCheck,
  Building,
  ArrowLeft,
  Clock
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useAuth } from '@/hooks/useAuth';

export default function BookingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bookingData, setBookingData] = useState(null);
  const [isManualBooking, setIsManualBooking] = useState(false);
  const isAdmin = user?.role === 'admin';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/auth/login');
    }
  }, [user, navigate]);

  // Initialize booking data and form
  useEffect(() => {
    if (location.state?.booking) {
      setBookingData(location.state.booking);
    } else {
      navigate('/rooms');
    }

    if (user && !isAdmin) {
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phoneno || '',
      });
    }
  }, [location, navigate, user, isAdmin]);

  // Calculate taxes based on room-specific rates
  const calculateTaxesAndFees = (basePrice, nights = 1) => {
    if (!bookingData) return { gst: 0, serviceFee: 0, municipalTax: 0, total: 0 };
  
    // Calculate the total base price for the booking
    const totalBasePrice = basePrice * nights * (bookingData?.roomCount || 1);
  
    // Extract the tax percentages from bookingData.taxBreakdown
    const vatRate = parseFloat(bookingData?.taxBreakdown?.vat) || 18; // Default to 18% if not provided
    const serviceFeeRate = parseFloat(bookingData?.taxBreakdown?.serviceTax) || 5; // Default to 5% if not provided
    const municipalTaxRate = parseFloat(bookingData?.taxBreakdown?.other) || 0; // Default to 2% if not provided
  
    // Calculate the taxes based on the rates and total price
    const gst = totalBasePrice * (vatRate / 100);
    const serviceFee = totalBasePrice * (serviceFeeRate / 100);
    const municipalTax = totalBasePrice * (municipalTaxRate / 100);
  
    // Calculate the total amount including taxes and fees
    const total = gst + serviceFee + municipalTax;
  
    return {
      gst,
      serviceFee,
      municipalTax,
      total
    };
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const basePrice = bookingData?.pricePerNight;
    const discountedPrice = bookingData?.DiscountedPrice || basePrice;
    const nights = bookingData?.nights;
    const taxesAndFees = calculateTaxesAndFees(discountedPrice, nights);

    const bookingDetails = {
      roomId: bookingData?.roomId,
      roomName: bookingData?.roomName,
      roomType: bookingData?.name,
      amenities: bookingData?.amenities,
      startDate: bookingData?.startDate,
      endDate: bookingData?.endDate,
      nights: nights,
      guests: bookingData?.guests,
      roomCount: bookingData?.roomCount,
      basePrice: basePrice,
      discountedPrice: discountedPrice,
      totalPrice: (discountedPrice * nights * bookingData?.roomCount) + taxesAndFees.total,
      customerInfo: formData,
      taxesAndFees: taxesAndFees
    };

    navigate('/payment', { state: bookingDetails });
  };

  if (!bookingData) {
    return (
      <div className="container mx-auto p-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-4">Loading booking details...</h2>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const basePrice = bookingData?.pricePerNight;
  const discountedPrice = bookingData?.DiscountedPrice || basePrice;
  const nights = bookingData?.nights;
  const taxesAndFees = calculateTaxesAndFees(discountedPrice, nights);
  const totalAmount = (discountedPrice * nights * bookingData?.roomCount) + taxesAndFees.total;

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => navigate(`/rooms/${bookingData?.roomId}`)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Room Details
      </Button>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl">Guest Information</CardTitle>
              {isAdmin && (
                <div className="flex items-center space-x-2">
                  <Label htmlFor="manual-booking">Manual Booking</Label>
                  <Switch
                    id="manual-booking"
                    checked={isManualBooking}
                    onCheckedChange={setIsManualBooking}
                  />
                </div>
              )}
            </CardHeader>
            <CardContent>
              {isAdmin && (
                <Alert className="mb-6">
                  <Shield className="h-4 w-4" />
                  <AlertTitle>Admin Booking Mode</AlertTitle>
                  <AlertDescription>
                    You are making a booking as an administrator. {isManualBooking ? 'Manual booking enabled.' : 'Using your admin profile.'}
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>

                <Alert>
                  <Calendar className="h-4 w-4" />
                  <AlertTitle>Free Cancellation</AlertTitle>
                  <AlertDescription>
                    Cancel before {format(new Date(bookingData?.startDate), 'PP')} for a full refund
                  </AlertDescription>
                </Alert>

                <Button type="submit" className="w-full">
                  Proceed to Payment
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="cursor-not-allowed">
            <CardHeader>
              <CardTitle>Have a Promo Code?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Input placeholder="Enter Promo Code" className="cursor-not-allowed" disabled/>
                <Button variant="outline" className="cursor-not-allowed" disabled>Apply</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">{bookingData?.roomName}</h3>
                <p className="text-muted-foreground">{bookingData?.roomType || bookingData?.roomName}</p>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CalendarCheck className="h-4 w-4" />
                    <span>Check-in</span>
                  </div>
                  <span className="font-medium">
                    {format(new Date(bookingData?.startDate), 'PP')}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>Check-out</span>
                  </div>
                  <span className="font-medium">
                    {format(new Date(bookingData?.endDate), 'PP')}
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
                  <span className="font-medium">
                    {Math.ceil((bookingData?.guests || 1) / (bookingData?.maxOccupancy || 1))}
                  </span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Room Rate ({bookingData?.nights} nights)</span>
                  <span>₹{bookingData?.DiscountedPrice || bookingData?.pricePerNight}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>VAT ({bookingData?.taxes?.vat ?? 18}%)</span>
                  <span>₹{taxesAndFees.gst.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Service Fee ({bookingData?.taxes?.serviceTax ?? 5}%)</span>
                  <span>₹{taxesAndFees.serviceFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Other Taxes ({bookingData?.taxes?.otherTax ?? 0}%)</span>
                  <span>₹{taxesAndFees.municipalTax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total Amount</span>
                  <span>₹{totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  * All taxes and fees are calculated based on the room rate and local regulations.
                </p>
                {bookingData?.DiscountedPrice && (
                  <p className="text-sm text-green-600">
                    * Discounted price applied to your booking.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CreditCard className="h-4 w-4" />
                <span>Secure payment powered by Stripe</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
