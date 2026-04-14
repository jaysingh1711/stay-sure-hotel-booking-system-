import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useSettings } from '@/context/SettingsContext';

const PrivacyPolicy = () => {

  const { hotelInfo, gethotel } = useSettings();

  useEffect(() => {
    gethotel();
  }, []);

  const hotelData = hotelInfo?.[0] || {};
 

  return (
    <Card className="max-w-4xl mx-auto my-8">
      <CardContent className="p-6 space-y-6">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

        <section className="space-y-4">
          <p>
            At {hotelData?.name || '[Hotel Name]'}, we are committed to protecting your privacy and ensuring
            the security of your personal information. This Privacy Policy outlines how we
            collect, use, disclose, and safeguard your personal data when you interact
            with our website and booking services.
          </p>

          <h2 className="text-2xl font-semibold mt-6">1. Information We Collect</h2>
          <p>We may collect various types of information, including but not limited to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Personal Information:</strong> Name, address, email address,
              phone number, and other identifying information when you make a booking
              or create an account.
            </li>
            <li>
              <strong>Booking Information:</strong> Check-in/check-out dates, room
              preferences, special requests, and payment information.
            </li>
            <li>
              <strong>Payment Information:</strong> Credit card details or other
              payment information for processing reservations.
            </li>
            <li>
              <strong>Usage Data:</strong> Information about your interactions with
              our website, including IP address, browser type, and browsing history.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mt-6">2. How We Use Your Information</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Processing hotel reservations and providing guest services</li>
            <li>Sending booking confirmations and updates</li>
            <li>Improving our services and guest experience</li>
            <li>Complying with legal obligations</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-6">3. Data Security</h2>
          <p>
            We implement industry-standard security measures to protect your
            information during transmission and storage.
          </p>

          <h2 className="text-2xl font-semibold mt-6">4. Your Rights</h2>
          <p>
            You have the right to access, correct, or delete your personal
            information. You may also object to certain data processing activities.
          </p>

          <h2 className="text-2xl font-semibold mt-6">5. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us:</p>
          <div className="mt-2">
            <p><strong>Address:</strong> {hotelData?.address || '[Hotel Address]'}</p>
            <p><strong>Email:</strong> {hotelData?.Email}</p>
            <p><strong>Phone:</strong> {hotelData?.contactNumbers?.join(', ') || '[Hotel Phone Numbers]'}</p>
          </div>

          <div className="mt-8 text-sm text-gray-600">
            <p>Last updated: January 15, 2025</p>
          </div>

        </section>
      </CardContent>
    </Card>
  );
};

export default PrivacyPolicy;