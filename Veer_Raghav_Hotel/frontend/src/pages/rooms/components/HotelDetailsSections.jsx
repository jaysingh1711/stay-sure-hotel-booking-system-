import React from 'react';
import { useSettings } from '@/context/SettingsContext';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { MessageSquare, User, Languages, Clock, Check } from 'lucide-react';

const HotelDetailsSections = ({ onMessageHost }) => {
  const { hotelData } = useSettings();

  if (!hotelData) {
    return null;
  }

  const { foodAndDining, hostDetails, caretakerDetails } = hotelData;

  return (
    <div className="space-y-6">
      {/* Food & Dining Section */}
      <div className="space-y-2">
        <h3 className="font-semibold text-xl text-orange-900">Food & Dining</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-2 text-sm  text-orange-900">Meal options are provided at the property</h4>
            <ul className="space-y-2 list-disc text-grey-700">
              <li className="text-sm ml-5">
                Meals offered: {foodAndDining?.mealsOffered?.join(', ')}
              </li>
              <li className="text-sm ml-5">
                {foodAndDining?.vegetarianOnly 
                  ? 'Only veg meals will be served by the property'
                  : 'Both veg and non-veg meals are available'}
              </li>
              <li className="text-sm ml-5">
                Cuisines available: {foodAndDining?.cuisinesAvailable?.join(', ')}
              </li>
              <li className="text-sm ml-5">
                Meal charges (approx): {foodAndDining?.mealChargesApprox}
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2 text-sm  text-orange-900">Additional information</h4>
            <ul className='list-disc text-grey-700'>
              <li className="text-sm ml-5">
                {foodAndDining?.outsideFoodAllowed 
                  ? 'Outside food is allowed'
                  : 'Outside food is not allowed'}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <Separator />

      {/* Host Information Card */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-gray-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-orange-900">
                Hosted by {hostDetails?.hostName}
              </h3>
              <p className="text-gray-600">
                Hosting since {hostDetails?.hostingSince}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Languages className="text-primary" />
              <span>Speaks {hostDetails?.speaks?.join(', ')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="text-primary" />
              <span>Responds {hostDetails?.responseTime}</span>
            </div>
          </div>

          <p className="text-gray-600">{hostDetails?.description}</p>

          {/* Caretaker Section */}
          {caretakerDetails?.available && (
            <div className="space-y-2">
              <h4 className="font-semibold text-orange-900">
                During your stay, a Caretaker will be available at the property.
              </h4>
              <p className="text-gray-600 text-orange-900">
                <strong>Caretaker Responsibilities:</strong>
              </p>
              <div className="grid grid-cols-2 gap-2">
                {caretakerDetails?.responsibilities?.map((responsibility, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check className="text-primary h-4 w-4" />
                    <span className="text-sm">{responsibility}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            onClick={onMessageHost}
          >
            <MessageSquare className="h-4 w-4" />
            MESSAGE HOST
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default HotelDetailsSections;