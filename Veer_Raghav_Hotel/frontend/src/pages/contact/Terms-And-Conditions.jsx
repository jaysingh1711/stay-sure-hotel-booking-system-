import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useSettings } from '@/context/SettingsContext';

const TermsConditions = () => {
    const { hotelInfo, gethotel } = useSettings();
  
    useEffect(() => {
      gethotel();
    }, []);
  
    const hotelData = hotelInfo?.[0] || {};
   
  return (
    <Card className="max-w-4xl mx-auto my-8">
      <CardContent className="p-6 space-y-6">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">Terms and Conditions</h1>
          
          <section className="space-y-2">
            <h2 className="text-xl font-semibold">Introduction</h2>
            <p>
              Welcome to {hotelData?.name || 'our hotel'}! Before using our website ("Site") and its services, 
              please read and understand these Terms and Conditions ("Terms"). Your access to and use of our Site 
              are subject to these Terms, as well as our Privacy Policy, Refund Policy, and Cancellation Policy 
              (collectively referred to as "Policies").
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold">Privacy Practices</h2>
            <p>
              At {hotelData?.name || 'our hotel'}, we value the security of your personal information. 
              Our Privacy Policy is in place to protect your data and privacy. The Privacy Policy governs 
              your interactions with the Site.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold">Services</h2>
            <p>
              We offer comprehensive hotel accommodation services. Our rooms and services are for personal 
              use only during your stay. Bookings are subject to availability and confirmation from our end.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold">Booking Process</h2>
            <p>The booking process involves the following steps:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Room Selection: Choose your preferred room type and check availability for your dates.</li>
              <li>Guest Details: Provide necessary information for all guests.</li>
              <li>Payment: Complete the booking by selecting a payment method and making the required payment.</li>
              <li>Confirmation: Receive a booking confirmation with your reservation details.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold">Pricing and Payments</h2>
            <p>
              All prices are listed in the local currency. Rates may vary based on season, room type, and 
              applicable taxes. We accept various payment methods including credit cards and online transfers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold">Cancellation Policy</h2>
            <p>
              Cancellation policies vary depending on the room type and rate selected. Please review the 
              specific cancellation terms provided during the booking process.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold">Contact Information</h2>
            <p>For any queries or concerns, please contact us:</p>
            <ul className="list-none space-y-1">
              <li>Email: {hotelData?.email || 'contact@hotel.com'}</li>
              <li>Phone: {hotelData?.contactNumbers?.[0] || 'Please contact the hotel'}</li>
              <li>Address: {hotelData?.address || 'Hotel Address'}</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold">Modifications to Terms</h2>
            <p>
              {hotelData?.name || 'We'} reserve the right to modify these Terms at any time without prior notice. 
              Continued use of the Site after any changes constitutes your acceptance of the updated Terms.
            </p>
          </section>
        </div>
      </CardContent>
    </Card>
  );
};

export default TermsConditions;