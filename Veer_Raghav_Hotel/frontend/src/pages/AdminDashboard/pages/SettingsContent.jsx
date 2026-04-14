import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Clock, Mail, Phone, MapPin, Image, Plus, Trash2, Settings, Edit, X, Loader2, AlertCircle } from 'lucide-react';
import { useSettings } from '../../../context/SettingsContext';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useRoom } from '@/context/RoomContext';
import api from '@/utils/api';
// import { validateHotelData } from '../components/hotelValidation';


const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB in bytes

const SkeletonLoader = () => (
  <div className="space-y-6">
    <Card>
      <CardHeader className="space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-3 gap-4">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

const SettingsContent = () => {
  const { hotel, isLoading, createHotel, updateHotel, fetchHotel } = useSettings();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [fileError, setFileError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    contactNumbers: [''],
    address: '',
    checkInTime: '',
    checkOutTime: '',
    Email: '',
    foodAndDining: {
      mealOptionsProvided: true,
      mealsOffered: ['Breakfast', 'Lunch', 'Dinner'],
      vegetarianOnly: true,
      cuisinesAvailable: ['Local', 'South Indian', 'North Indian', 'Chinese'],
      mealChargesApprox: 'INR 200 per person per meal',
      outsideFoodAllowed: true
    },
    hostDetails: {
      hostName: '',
      hostingSince: '',
      speaks: ['English', 'Hindi'],
      responseTime: 'within 24 hours',
      description: ''
    },
    caretakerDetails: {
      available: true,
      responsibilities: [
        'Cleaning kitchen/utensils',
        'Cab bookings',
        'Car/bike rentals',
        'Gardening',
        'Help buying groceries',
        'Restaurant reservations',
        'Pick up and Drop services'
      ]
    }
  });


  const [logo, setLogo] = useState(null);

  useEffect(() => {
    if (Array.isArray(hotel) && hotel.length > 0) {
      const hotelData = hotel[0];
      setFormData({
        name: hotelData.name || '',
        contactNumbers: hotelData.contactNumbers || [''],
        address: hotelData.address || '',
        checkInTime: hotelData.checkInTime || '',
        checkOutTime: hotelData.checkOutTime || '',
        Email: hotelData.Email || '',
        foodAndDining: {
          mealOptionsProvided: hotelData.foodAndDining?.mealOptionsProvided ?? true,
          mealsOffered: hotelData.foodAndDining?.mealsOffered || ['Breakfast', 'Lunch', 'Dinner'],
          vegetarianOnly: hotelData.foodAndDining?.vegetarianOnly ?? true,
          cuisinesAvailable: hotelData.foodAndDining?.cuisinesAvailable || ['Local', 'South Indian', 'North Indian', 'Chinese'],
          mealChargesApprox: hotelData.foodAndDining?.mealChargesApprox || 'INR 200 per person per meal',
          outsideFoodAllowed: hotelData.foodAndDining?.outsideFoodAllowed ?? true
        },
        hostDetails: {
          hostName: hotelData.hostDetails?.hostName || '',
          hostingSince: hotelData.hostDetails?.hostingSince || '',
          speaks: hotelData.hostDetails?.speaks || ['English', 'Hindi'],
          responseTime: hotelData.hostDetails?.responseTime || 'within 24 hours',
          description: hotelData.hostDetails?.description || ''
        },
        caretakerDetails: {
          available: hotelData.caretakerDetails?.available ?? true,
          responsibilities: hotelData.caretakerDetails?.responsibilities || [
            'Cleaning kitchen/utensils',
            'Cab bookings',
            'Car/bike rentals',
            'Gardening',
            'Help buying groceries',
            'Restaurant reservations',
            'Pick up and Drop services'
          ]
        }
      });
    }
  }, []);


  const validateLogoFile = (file) => {
    setFileError('');

    if (file.size > MAX_FILE_SIZE) {
      setFileError('Logo file size must be less than 2MB');
      return false;
    }

    // Instead of using Image constructor, we'll check the file type
    if (!file.type.startsWith('image/')) {
      setFileError('Invalid file type. Please upload an image.');
      return false;
    }

    return true;
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (index, value) => {
    const newPhones = [...formData.contactNumbers];
    newPhones[index] = value;
    setFormData(prev => ({ ...prev, contactNumbers: newPhones }));
  };

  const addPhone = () => {
    setFormData(prev => ({ ...prev, contactNumbers: [...prev.contactNumbers, ''] }));
  };

  const removePhone = (index) => {
    const newPhones = formData.contactNumbers.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, contactNumbers: newPhones }));
  };

  const handleLogoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const isValid = await validateLogoFile(file);
      if (isValid) {
        setLogo(file);
      } else {
        e.target.value = ''; // Reset input
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // First, let's log the current formData to debug
      console.log('Current formData:', formData);

      // Create the hotel data object, checking for undefined values
      const hotelData = {
        name: formData?.name || '',
        contactNumbers: formData?.contactNumbers?.filter(num => num && num.trim() !== '') || [],
        address: formData?.address || '',
        checkInTime: formData?.checkInTime || '',
        checkOutTime: formData?.checkOutTime || '',
        Email: formData?.Email || '',
        foodAndDining: {
          mealOptionsProvided: formData?.foodAndDining?.mealOptionsProvided ?? true,
          mealsOffered: formData?.foodAndDining?.mealsOffered || ['Breakfast', 'Lunch', 'Dinner'],
          vegetarianOnly: formData?.foodAndDining?.vegetarianOnly ?? true,
          cuisinesAvailable: formData?.foodAndDining?.cuisinesAvailable || ['Local', 'South Indian', 'North Indian', 'Chinese'],
          mealChargesApprox: formData?.foodAndDining?.mealChargesApprox || 'INR 200 per person per meal',
          outsideFoodAllowed: formData?.foodAndDining?.outsideFoodAllowed ?? true
        },
        hostDetails: {
          hostName: formData?.hostDetails?.hostName || '',
          hostingSince: formData?.hostDetails?.hostingSince || '',
          speaks: formData?.hostDetails?.speaks || ['English', 'Hindi'],
          responseTime: formData?.hostDetails?.responseTime || 'within 24 hours',
          description: formData?.hostDetails?.description || ''
        },
        caretakerDetails: {
          available: formData?.caretakerDetails?.available ?? true,
          responsibilities: formData?.caretakerDetails?.responsibilities || [
            'Cleaning kitchen/utensils',
            'Cab bookings',
            'Car/bike rentals',
            'Gardening',
            'Help buying groceries',
            'Restaurant reservations',
            'Pick up and Drop services'
          ]
        }
      };

      // Log the constructed hotelData for debugging
      console.log('Constructed hotelData:', hotelData);

      let response;

      // Update or create hotel
      if (Array.isArray(hotel) && hotel.length > 0) {
        const hotelId = hotel[0]._id;
        console.log('Updating hotel with ID:', hotelId);
        response = await updateHotel(hotelId, hotelData);
      } else {
        console.log('Creating new hotel');
        response = await createHotel(hotelData);
      }

      // Handle logo upload
      if (logo && (response?._id || (Array.isArray(hotel) && hotel[0]?._id))) {
        const hotelId = response?._id || hotel[0]._id;
        const logoFormData = new FormData();
        logoFormData.append('logo', logo);

        try {
          console.log('Uploading logo for hotel ID:', hotelId);
          await api.put(`/hotel/image/${hotelId}`, logoFormData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          console.log('Logo uploaded successfully');
        } catch (logoError) {
          console.error('Failed to upload logo:', logoError);
          toast({
            title: "Warning",
            description: "Hotel data saved but logo upload failed. Please try uploading the logo again.",
            variant: "warning",
          });
        }
      }

      await fetchHotel(); // Refresh the data

      toast({
        title: hotel?.length > 0 ? "Hotel Updated" : "Hotel Created",
        description: hotel?.length > 0 ? "Your changes have been saved successfully." : "New hotel has been created successfully.",
      });

      setIsEditing(false);

    } catch (error) {
      console.error('Failed to save hotel:', error);
      toast({
        title: "Error",
        description: `Failed to ${hotel?.length > 0 ? 'update' : 'create'} hotel. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };


  const getLogoUrl = (logoPath) => {
    if (!logoPath) return null;
    // Assuming your API base URL is configured in your environment
    return `${import.meta.env.VITE_BACKEND_UPLOAD_URL}/${logoPath}`;
  };


  const handleCancel = () => {
    if (Array.isArray(hotel) && hotel.length > 0) {
      const hotelData = hotel[0];
      setFormData({
        name: hotelData.name || '',
        contactNumbers: hotelData.contactNumbers || [''],
        address: hotelData.address || '',
        checkInTime: hotelData.checkInTime || '',
        checkOutTime: hotelData.checkOutTime || '',
        Email: hotelData.Email || '',
        foodAndDining: {
          mealOptionsProvided: hotelData.foodAndDining?.mealOptionsProvided ?? true,
          mealsOffered: hotelData.foodAndDining?.mealsOffered || ['Breakfast', 'Lunch', 'Dinner'],
          vegetarianOnly: hotelData.foodAndDining?.vegetarianOnly ?? true,
          cuisinesAvailable: hotelData.foodAndDining?.cuisinesAvailable || ['Local', 'South Indian', 'North Indian', 'Chinese'],
          mealChargesApprox: hotelData.foodAndDining?.mealChargesApprox || 'INR 200 per person per meal',
          outsideFoodAllowed: hotelData.foodAndDining?.outsideFoodAllowed ?? true
        },
        hostDetails: {
          hostName: hotelData.hostDetails?.hostName || '',
          hostingSince: hotelData.hostDetails?.hostingSince || '',
          speaks: hotelData.hostDetails?.speaks || ['English', 'Hindi'],
          responseTime: hotelData.hostDetails?.responseTime || 'within 24 hours',
          description: hotelData.hostDetails?.description || ''
        },
        caretakerDetails: {
          available: hotelData.caretakerDetails?.available ?? true,
          responsibilities: hotelData.caretakerDetails?.responsibilities || [
            'Cleaning kitchen/utensils',
            'Cab bookings',
            'Car/bike rentals',
            'Gardening',
            'Help buying groceries',
            'Restaurant reservations',
            'Pick up and Drop services'
          ]
        }
      });
    } else {
      // Reset to default values if no hotel data exists
      setFormData({
        name: '',
        contactNumbers: [''],
        address: '',
        checkInTime: '',
        checkOutTime: '',
        Email: '',
        foodAndDining: {
          mealOptionsProvided: true,
          mealsOffered: ['Breakfast', 'Lunch', 'Dinner'],
          vegetarianOnly: true,
          cuisinesAvailable: ['Local', 'South Indian', 'North Indian', 'Chinese'],
          mealChargesApprox: 'INR 200 per person per meal',
          outsideFoodAllowed: true
        },
        hostDetails: {
          hostName: '',
          hostingSince: '',
          speaks: ['English', 'Hindi'],
          responseTime: 'within 24 hours',
          description: ''
        },
        caretakerDetails: {
          available: true,
          responsibilities: [
            'Cleaning kitchen/utensils',
            'Cab bookings',
            'Car/bike rentals',
            'Gardening',
            'Help buying groceries',
            'Restaurant reservations',
            'Pick up and Drop services'
          ]
        }
      });
    }
    setIsEditing(false);
    setLogo(null); // Reset logo state
    setFileError(''); // Reset file error state
  };

  if (isLoading || isSaving) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center mb-6">
          <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
          <span className="text-xl font-semibold">
            {isSaving ? 'Saving changes...' : 'Loading...'}
          </span>
        </div>
        <SkeletonLoader />
      </div>
    );
  }

  
  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <Card className="w-full">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
          <div>
            <CardTitle className="text-2xl sm:text-3xl font-bold">
              Hotel Information
            </CardTitle>
            <CardDescription className="mt-1">
              {isEditing ? 'Edit your hotel settings' : 'View your hotel settings'}
            </CardDescription>
          </div>
          <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-2">
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} variant="outline" className="w-full sm:w-auto">
                <Edit className="mr-2 h-4 w-4" />
                Edit Settings
              </Button>
            ) : (
              <>
                <Button onClick={handleCancel} variant="outline" className="w-full sm:w-auto">
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button onClick={handleSubmit} type="submit" className="w-full sm:w-auto">
                  Save Changes
                </Button>
              </>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="w-full flex flex-col md:flex-row gap-2 h-full mb-5 sm:mb-6 bg-orange-50">
              <TabsTrigger value="general" className="w-full">General</TabsTrigger>
              <TabsTrigger value="booking" className="w-full">Booking</TabsTrigger>
              <TabsTrigger value="dining" className="w-full">Food & Dining</TabsTrigger>
              <TabsTrigger value="host" className="w-full">Host Details</TabsTrigger>
              <TabsTrigger value="caretaker" className="w-full">Caretaker</TabsTrigger>
              <TabsTrigger value="appearance" className="w-full">Appearance</TabsTrigger>
            </TabsList>

            {/* General Tab Content */}
            <TabsContent value="general">
              <Card>
                <CardHeader className="space-y-1">
                  <CardTitle className="text-xl sm:text-2xl">General Information</CardTitle>
                  <CardDescription>Basic details about your hotel</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-base sm:text-lg font-semibold">Hotel Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Enter hotel name"
                          className="w-full"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-base sm:text-lg font-semibold">Email</Label>
                        <div className="flex items-center gap-2">
                          <Mail className="flex-shrink-0 text-gray-500" />
                          <Input
                            id="Email"
                            name="Email"
                            type="email"
                            value={formData.Email}
                            onChange={handleInputChange}
                            placeholder="Enter email address"
                            className="flex-1"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-base sm:text-lg font-semibold">Contact Numbers</Label>
                        {formData.contactNumbers.map((phone, index) => (
                          <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                            <div className="flex-1 flex items-center w-full gap-2">
                              <Phone className="flex-shrink-0 text-gray-500" />
                              <Input
                                value={phone}
                                onChange={(e) => handlePhoneChange(index, e.target.value)}
                                placeholder="Enter contact phone"
                                className="flex-1"
                              />
                            </div>
                            {index > 0 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removePhone(index)}
                                className="flex-shrink-0"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                        <Button type="button" variant="outline" onClick={addPhone} className="w-full sm:w-auto">
                          <Plus className="mr-2 h-4 w-4" /> Add Phone
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address" className="text-base sm:text-lg font-semibold">Address</Label>
                        <div className="flex items-center gap-2">
                          <MapPin className="flex-shrink-0 text-gray-500" />
                          <Input
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            placeholder="Enter hotel address"
                            className="flex-1"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="space-y-1">
                        <span className="text-sm text-gray-500">Hotel Name</span>
                        <p className="text-base sm:text-lg">{formData.name || 'Not set'}</p>
                      </div>

                      <div className="space-y-1">
                        <span className="text-sm text-gray-500">Email</span>
                        <div className="flex items-center gap-2">
                          <Mail className="flex-shrink-0 text-gray-500" />
                          <p className="text-base sm:text-lg">{formData.Email || 'Not set'}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <span className="text-sm text-gray-500">Contact Numbers</span>
                        <div className="space-y-2">
                          {formData.contactNumbers.map((phone, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <Phone className="flex-shrink-0 text-gray-500" />
                              <span className="text-base sm:text-lg">{phone}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-sm text-gray-500">Address</span>
                        <div className="flex items-center gap-2">
                          <MapPin className="flex-shrink-0 text-gray-500" />
                          <p className="text-base sm:text-lg">{formData.address || 'Not set'}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Food & Dining Tab Content */}
            <TabsContent value="dining">
              <Card>
                <CardHeader className="space-y-1">
                  <CardTitle className="text-xl sm:text-2xl">Food & Dining Options</CardTitle>
                  <CardDescription>Configure meal services and dining preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {isEditing ? (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">Meal Options Provided</Label>
                          <p className="text-sm text-gray-500">Enable if you provide meal services</p>
                        </div>
                        <Switch
                          checked={formData.foodAndDining.mealOptionsProvided}
                          onCheckedChange={(checked) =>
                            setFormData(prev => ({
                              ...prev,
                              foodAndDining: {
                                ...prev.foodAndDining,
                                mealOptionsProvided: checked
                              }
                            }))
                          }
                        />
                      </div>

                      {formData.foodAndDining.mealOptionsProvided && (
                        <>
                          <div className="space-y-2">
                            <Label className="text-base">Meals Offered</Label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {['Breakfast', 'Lunch', 'Dinner'].map((meal) => (
                                <div key={meal} className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    checked={formData.foodAndDining.mealsOffered.includes(meal)}
                                    onChange={(e) => {
                                      const updatedMeals = e.target.checked
                                        ? [...formData.foodAndDining.mealsOffered, meal]
                                        : formData.foodAndDining.mealsOffered.filter(m => m !== meal);
                                      setFormData(prev => ({
                                        ...prev,
                                        foodAndDining: {
                                          ...prev.foodAndDining,
                                          mealsOffered: updatedMeals
                                        }
                                      }));
                                    }}
                                    className="h-4 w-4"
                                  />
                                  <Label>{meal}</Label>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="mealCharges" className="text-base">Meal Charges</Label>
                            <Input
                              id="mealCharges"
                              value={formData.foodAndDining.mealChargesApprox}
                              onChange={(e) =>
                                setFormData(prev => ({
                                  ...prev,
                                  foodAndDining: {
                                    ...prev.foodAndDining,
                                    mealChargesApprox: e.target.value
                                  }
                                }))
                              }
                              placeholder="Enter approximate meal charges"
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label className="text-base">Vegetarian Only</Label>
                              <p className="text-sm text-gray-500">Offer only vegetarian meals</p>
                            </div>
                            <Switch
                              checked={formData.foodAndDining.vegetarianOnly}
                              onCheckedChange={(checked) =>
                                setFormData(prev => ({
                                  ...prev,
                                  foodAndDining: {
                                    ...prev.foodAndDining,
                                    vegetarianOnly: checked
                                  }
                                }))
                              }
                            />
                          </div>

                          <div className="space-y-2">
                            <Label className="text-base">Cuisines Available</Label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {['Local', 'South Indian', 'North Indian', 'Chinese'].map((cuisine) => (
                                <div key={cuisine} className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    checked={formData.foodAndDining.cuisinesAvailable.includes(cuisine)}
                                    onChange={(e) => {
                                      const updatedCuisines = e.target.checked
                                        ? [...formData.foodAndDining.cuisinesAvailable, cuisine]
                                        : formData.foodAndDining.cuisinesAvailable.filter(c => c !== cuisine);
                                      setFormData(prev => ({
                                        ...prev,
                                        foodAndDining: {
                                          ...prev.foodAndDining,
                                          cuisinesAvailable: updatedCuisines
                                        }
                                      }));
                                    }}
                                    className="h-4 w-4"
                                  />
                                  <Label>{cuisine}</Label>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label className="text-base">Outside Food Allowed</Label>
                              <p className="text-sm text-gray-500">Allow guests to bring outside food</p>
                            </div>
                            <Switch
                              checked={formData.foodAndDining.outsideFoodAllowed}
                              onCheckedChange={(checked) =>
                                setFormData(prev => ({
                                  ...prev,
                                  foodAndDining: {
                                    ...prev.foodAndDining,
                                    outsideFoodAllowed: checked
                                  }
                                }))
                              }
                            />
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <span className="text-base font-medium">Meal Options Provided</span>
                        <span className={formData.foodAndDining.mealOptionsProvided ? "text-green-600" : "text-red-600"}>
                          {formData.foodAndDining.mealOptionsProvided ? "Yes" : "No"}
                        </span>
                      </div>

                      {formData.foodAndDining.mealOptionsProvided && (
                        <>
                          <div className="space-y-2">
                            <span className="text-sm text-gray-500">Meals Offered</span>
                            <div className="flex flex-wrap gap-2">
                              {formData.foodAndDining.mealsOffered.map((meal) => (
                                <span key={meal} className="px-2 py-1 bg-gray-100 rounded-md text-sm">
                                  {meal}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-1">
                            <span className="text-sm text-gray-500">Meal Charges</span>
                            <p className="text-base">{formData.foodAndDining.mealChargesApprox}</p>
                          </div>

                          <div className="space-y-2">
                            <span className="text-sm text-gray-500">Cuisines Available</span>
                            <div className="flex flex-wrap gap-2">
                              {formData.foodAndDining.cuisinesAvailable.map((cuisine) => (
                                <span key={cuisine} className="px-2 py-1 bg-gray-100 rounded-md text-sm">
                                  {cuisine}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-base font-medium">Vegetarian Only</span>
                            <span className={formData.foodAndDining.vegetarianOnly ? "text-green-600" : "text-gray-600"}>
                              {formData.foodAndDining.vegetarianOnly ? "Yes" : "No"}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-base font-medium">Outside Food Allowed</span>
                            <span className={formData.foodAndDining.outsideFoodAllowed ? "text-green-600" : "text-red-600"}>
                              {formData.foodAndDining.outsideFoodAllowed ? "Yes" : "No"}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Host Details Tab */}
            <TabsContent value="host">
              <Card>
                <CardHeader className="space-y-1">
                  <CardTitle className="text-xl sm:text-2xl">Host Information</CardTitle>
                  <CardDescription>Manage host details and preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {isEditing ? (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="hostName" className="text-base">Host Name</Label>
                        <Input
                          id="hostName"
                          value={formData.hostDetails.hostName}
                          onChange={(e) =>
                            setFormData(prev => ({
                              ...prev,
                              hostDetails: {
                                ...prev.hostDetails,
                                hostName: e.target.value
                              }
                            }))
                          }
                          placeholder="Enter host name"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="hostingSince" className="text-base">Hosting Since</Label>
                        <Input
                          id="hostingSince"
                          value={formData.hostDetails.hostingSince}
                          onChange={(e) =>
                            setFormData(prev => ({
                              ...prev,
                              hostDetails: {
                                ...prev.hostDetails,
                                hostingSince: e.target.value
                              }
                            }))
                          }
                          placeholder="Enter year started hosting"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="responseTime" className="text-base">Response Time</Label>
                        <Input
                          id="responseTime"
                          value={formData.hostDetails.responseTime}
                          onChange={(e) =>
                            setFormData(prev => ({
                              ...prev,
                              hostDetails: {
                                ...prev.hostDetails,
                                responseTime: e.target.value
                              }
                            }))
                          }
                          placeholder="Enter typical response time"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="hostDescription" className="text-base">Host Description</Label>
                        <textarea
                          id="hostDescription"
                          value={formData.hostDetails.description}
                          onChange={(e) =>
                            setFormData(prev => ({
                              ...prev,
                              hostDetails: {
                                ...prev.hostDetails,
                                description: e.target.value
                              }
                            }))
                          }
                          placeholder="Enter host description"
                          className="w-full min-h-[100px] p-2 border rounded-md"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-base">Languages Spoken</Label>
                        <div className="grid grid-cols-2 gap-4">
                          {['English', 'Hindi'].map((language) => (
                            <div key={language} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={formData.hostDetails.speaks.includes(language)}
                                onChange={(e) => {
                                  const updatedLanguages = e.target.checked
                                    ? [...formData.hostDetails.speaks, language]
                                    : formData.hostDetails.speaks.filter(l => l !== language);
                                  setFormData(prev => ({
                                    ...prev,
                                    hostDetails: {
                                      ...prev.hostDetails,
                                      speaks: updatedLanguages
                                    }
                                  }));
                                }}
                                className="h-4 w-4"
                              />
                              <Label>{language}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="space-y-1">
                        <span className="text-sm text-gray-500">Host Name</span>
                        <p className="text-base">{formData.hostDetails.hostName}</p>
                      </div>

                      <div className="space-y-1">
                        <span className="text-sm text-gray-500">Hosting Since</span>
                        <p className="text-base">{formData.hostDetails.hostingSince}</p>
                      </div>

                      <div className="space-y-1">
                        <span className="text-sm text-gray-500">Response Time</span>
                        <p className="text-base">{formData.hostDetails.responseTime}</p>
                      </div>

                      <div className="space-y-1">
                        <span className="text-sm text-gray-500">Languages Spoken</span>
                        <div className="flex flex-wrap gap-2">
                          {formData.hostDetails.speaks.map((language) => (
                            <span key={language} className="px-2 py-1 bg-gray-100 rounded-md text-sm">
                              {language}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-sm text-gray-500">About the Host</span>
                        <p className="text-base">{formData.hostDetails.description}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Add the Caretaker tab content right after the Host Details tab */}
            <TabsContent value="caretaker">
              <Card>
                <CardHeader className="space-y-1">
                  <CardTitle className="text-xl sm:text-2xl">Caretaker Services</CardTitle>
                  <CardDescription>Manage caretaker availability and responsibilities</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {isEditing ? (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">Caretaker Available</Label>
                          <p className="text-sm text-gray-500">Toggle caretaker services availability</p>
                        </div>
                        <Switch
                          checked={formData.caretakerDetails.available}
                          onCheckedChange={(checked) =>
                            setFormData(prev => ({
                              ...prev,
                              caretakerDetails: {
                                ...prev.caretakerDetails,
                                available: checked
                              }
                            }))
                          }
                        />
                      </div>

                      {formData.caretakerDetails.available && (
                        <div className="space-y-4">
                          <Label className="text-base">Caretaker Responsibilities</Label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                              'Cleaning kitchen/utensils',
                              'Cab bookings',
                              'Car/bike rentals',
                              'Gardening',
                              'Help buying groceries',
                              'Restaurant reservations',
                              'Pick up and Drop services'
                            ].map((responsibility) => (
                              <div key={responsibility} className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={formData.caretakerDetails.responsibilities.includes(responsibility)}
                                  onChange={(e) => {
                                    const updatedResponsibilities = e.target.checked
                                      ? [...formData.caretakerDetails.responsibilities, responsibility]
                                      : formData.caretakerDetails.responsibilities.filter(r => r !== responsibility);
                                    setFormData(prev => ({
                                      ...prev,
                                      caretakerDetails: {
                                        ...prev.caretakerDetails,
                                        responsibilities: updatedResponsibilities
                                      }
                                    }));
                                  }}
                                  className="h-4 w-4"
                                />
                                <Label>{responsibility}</Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <span className="text-base font-medium">Caretaker Available</span>
                        <span className={formData.caretakerDetails.available ? "text-green-600" : "text-red-600"}>
                          {formData.caretakerDetails.available ? "Yes" : "No"}
                        </span>
                      </div>

                      {formData.caretakerDetails.available && (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <span className="text-sm text-gray-500">Services Provided</span>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {formData.caretakerDetails.responsibilities.map((responsibility) => (
                                <div key={responsibility} className="flex items-center gap-2">
                                  <svg
                                    className="h-5 w-5 text-green-500"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path d="M5 13l4 4L19 7" />
                                  </svg>
                                  <span className="text-sm">{responsibility}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="booking">
              <Card>
                <CardHeader className="space-y-1">
                  <CardTitle className="text-xl sm:text-2xl">Booking Configuration</CardTitle>
                  <CardDescription>Set up your booking preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {isEditing ? (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="checkInTime" className="text-base sm:text-lg font-semibold">Check-in Time</Label>
                          <div className="flex items-center gap-2">
                            <Clock className="flex-shrink-0 text-gray-500" />
                            <Input
                              id="checkInTime"
                              name="checkInTime"
                              type="time"
                              value={formData.checkInTime}
                              onChange={handleInputChange}
                              className="flex-1"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="checkOutTime" className="text-base sm:text-lg font-semibold">Check-out Time</Label>
                          <div className="flex items-center gap-2">
                            <Clock className="flex-shrink-0 text-gray-500" />
                            <Input
                              id="checkOutTime"
                              name="checkOutTime"
                              type="time"
                              value={formData.checkOutTime}
                              onChange={handleInputChange}
                              className="flex-1"
                            />
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="space-y-1">
                          <span className="text-sm text-gray-500">Check-in Time</span>
                          <div className="flex items-center gap-2">
                            <Clock className="flex-shrink-0 text-gray-500" />
                            <span className="text-base sm:text-lg">{formData.checkInTime || 'Not set'}</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <span className="text-sm text-gray-500">Check-out Time</span>
                          <div className="flex items-center gap-2">
                            <Clock className="flex-shrink-0 text-gray-500" />
                            <span className="text-base sm:text-lg">{formData.checkOutTime || 'Not set'}</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appearance">
              <Card>
                <CardHeader className="space-y-1">
                  <CardTitle className="text-xl sm:text-2xl">Appearance Settings</CardTitle>
                  <CardDescription>Customize your hotel's visual identity</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <Label htmlFor="logo" className="text-base sm:text-lg font-semibold">Hotel Logo</Label>
                    {fileError && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{fileError}</AlertDescription>
                      </Alert>
                    )}
                    <div className="flex flex-col sm:flex-row gap-6">
                      <div className="w-full sm:w-1/3">
                        {console.log(hotel)}
                        {hotel?.[0]?.logo ? (
                          <img
                            src={getLogoUrl(hotel[0].logo)}
                            alt="Hotel Logo"
                            className="w-full max-w-[200px] h-auto object-contain rounded-lg border mx-auto sm:mx-0"
                          />
                        ) : (
                          <div className="flex flex-col sm:flex-row items-center gap-4">
                            <div className="w-full max-w-[200px] h-[200px] bg-muted rounded-lg flex items-center justify-center mx-auto sm:mx-0">
                              <Image className="h-12 w-12 text-muted-foreground" />
                            </div>
                            <span className="text-muted-foreground text-sm italic text-center sm:text-left">
                              {isEditing ? 'Upload a logo' : 'No logo uploaded'}
                            </span>
                          </div>
                        )}
                      </div>
                      {isEditing && (
                        <div className="w-full sm:w-2/3 space-y-4">
                          <Input
                            id="logo"
                            type="file"
                            onChange={handleLogoChange}
                            accept="image/*"
                            className="w-full"
                          />
                          <div className="text-sm text-muted-foreground space-y-1">
                            <p>Requirements:</p>
                            <ul className="list-disc list-inside ml-2">
                              <li>Maximum file size: 2MB</li>
                              <li>Maximum dimensions: 200x200 pixels</li>
                              <li>Accepted formats: PNG, JPG, JPEG</li>
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsContent;