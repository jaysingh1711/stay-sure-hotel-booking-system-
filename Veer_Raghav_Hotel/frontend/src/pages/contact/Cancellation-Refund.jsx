import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useSettings } from '@/context/SettingsContext';

const CancellationandRefund = () => {
  const { hotelInfo, gethotel } = useSettings();

  useEffect(() => {
    gethotel();
  }, []);

  const hotelData = hotelInfo?.[0] || {};

  return (
    <Card className="max-w-4xl mx-auto my-8">
      <CardContent className="p-6 space-y-6">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">Cancellation and Refund Policy</h1>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold">General Policy</h2>
            <p>
              At {hotelData?.name || 'our hotel'}, we understand that plans can change.
              Our cancellation and refund policies are designed to be fair and transparent
              while maintaining the quality of service for all our guests.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold">Cancellation Timeline</h2>
            <div className="space-y-2">
              <h3 className="font-medium">Free Cancellation</h3>
              <p>
                Cancellations made more than 48 hours before the check-in date will receive
                a full refund of the booking amount.
              </p>

              <h3 className="font-medium">Late Cancellation</h3>
              <p>
                Cancellations made within 48-24 hours of the check-in date will incur a charge
                equivalent to one night's stay.
              </p>

              <h3 className="font-medium">Last Minute Cancellation</h3>
              <p>
                Cancellations made less than 24 hours before check-in or in case of no-show
                will be charged the full amount of the booking.
              </p>
            </div>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold">Refund Process</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Refunds will be processed through the original payment method used for booking.
              </li>
              <li>
                Processing time for refunds typically takes 5-7 business days, depending on your
                bank or credit card provider.
              </li>
              <li>
                Any applicable taxes and fees will be included in the refund amount as per the
                cancellation timeline.
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold">Special Circumstances</h2>
            <p>
              We understand that emergencies can occur. In case of:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Medical emergencies (with valid documentation)
              </li>
              <li>
                Natural disasters or severe weather conditions affecting travel
              </li>
              <li>
                Government-imposed travel restrictions
              </li>
            </ul>
            <p>
              Please contact our support team for special consideration regarding cancellations
              and refunds.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold">Early Check-out Policy</h2>
            <p>
              In case of early check-out, the remaining nights will be charged as per our
              last-minute cancellation policy unless the room can be rebooked for the
              remaining period.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold">Contact for Cancellations</h2>
            <p>
              To request a cancellation or for any queries regarding refunds, please contact us:
            </p>
            <ul className="list-none space-y-1">
              <li>Email: {hotelData?.email || 'contact@hotel.com'}</li>
              <li>Phone: {hotelData?.contactNumbers?.[0] || 'Please contact the hotel'}</li>
              <li>Address: {hotelData?.address || 'Hotel Address'}</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold">Policy Modifications</h2>
            <p>
              {hotelData?.name || 'We'} reserve the right to modify this cancellation and refund
              policy at any time. Any changes will be effective immediately upon posting on our website.
            </p>
          </section>
        </div>
      </CardContent>
    </Card>
  );
};

export default CancellationandRefund;