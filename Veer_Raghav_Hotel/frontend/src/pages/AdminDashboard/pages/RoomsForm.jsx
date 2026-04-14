import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, X, Upload, Loader2, Trash2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRoom } from '@/context/RoomContext';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const AMENITY_CATEGORIES = [
  'No of Bed',
  'No of Washroom',
  'Popular Amenities',
  'Basic Facilities',
  'Transfers',
  'Safety and Security',
  'Health and Wellness',
  'Common Area'
];

const RoomsForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addRoom, updateRoom, getRoomById, addImagesToRoom, getImageUrl, deleteRoom } = useRoom();
  const { user } = useAuth();
  const isNewRoom = !id;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    pricePerNight: '',
    discountedPrice: '0',
    maxOccupancy: '',
    images: [],
    existingImages: [],
    amenities: [{
      category: 'Popular Amenities',
      items: [{ name: '', quantity: 1 }],
      description: ''
    }],
    taxes: {
      vat: 0,
      serviceTax: 0,
      other: 0
    },
    isAvailable: true,
    totalSlots: 10, // Default value
    bookedSlots: 0,
    availableSlots: 10
  });

  // window.location.reload();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    // Redirect if not authenticated
    if (!user) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    const fetchRoom = async () => {
      if (!isNewRoom) {
        try {
          const roomData = await getRoomById(id);
          setFormData({
            ...roomData,
            pricePerNight: roomData.pricePerNight.toString(),
            maxOccupancy: roomData.maxOccupancy.toString(),
            existingImages: roomData.images || [],
            images: [],
            totalSlots: roomData.totalSlots || 10,
            bookedSlots: roomData.bookedSlots || 0,
            availableSlots: roomData.availableSlots || 10
          });
        } catch (error) {
          if (error.message === 'Authentication required. Please log in again.') {
            navigate('/login', { state: { from: location.pathname } });
          } else {
            navigate('/dashboard/rooms');
          }
        }
      }
    };

    fetchRoom();
  }, [id, isNewRoom, getRoomById, navigate, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const roomData = {
        ...formData,
        pricePerNight: parseFloat(formData.pricePerNight),
        discountedPrice: parseFloat(formData.discountedPrice) || 0,
        maxOccupancy: parseInt(formData.maxOccupancy),
        amenities: formData.amenities.filter(category =>
          category.items.some(item => item.name.trim() !== '')
        ),
        images: formData.existingImages,
        totalSlots: parseInt(formData.totalSlots),
        bookedSlots: parseInt(formData.bookedSlots),
        availableSlots: parseInt(formData.totalSlots) - parseInt(formData.bookedSlots)
      };

      if (isNewRoom) {
        const newRoom = await addRoom({ ...roomData, images: [...roomData.images, ...formData.images] });
        toast({
          title: "Success",
          description: "Room created successfully",
        });
        navigate(`/dashboard/rooms/`);
      } else {
        await updateRoom(id, roomData);
        if (formData.images.length > 0) {
          await addImagesToRoom(id, formData.images);
        }
        navigate('/dashboard/rooms');
        toast({
          title: "Success",
          description: "Room updated successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to save room details.",
        variant: "destructive",
      });
      if (error.message === 'Authentication required. Please log in again.') {
        navigate('/login', { state: { from: location.pathname } });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
  };


  const addAmenityItem = (categoryIndex) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.map((category, idx) =>
        idx === categoryIndex
          ? { ...category, items: [...category.items, { name: '', quantity: 1 }] }
          : category
      )
    }));
  };


  const addAmenityCategory = () => {
    setFormData(prev => ({
      ...prev,
      amenities: [...prev.amenities, {
        category: '',
        items: [{ name: '', quantity: 1 }],
        description: ''
      }]
    }));
  };
  const updateAmenityCategory = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.map((category, idx) =>
        idx === index ? { ...category, [field]: value } : category
      )
    }));
  };

  const updateAmenityItem = (categoryIndex, itemIndex, field, value) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.map((category, idx) =>
        idx === categoryIndex
          ? {
            ...category,
            items: category.items.map((item, iIdx) =>
              iIdx === itemIndex ? { ...item, [field]: value } : item
            )
          }
          : category
      )
    }));
  };

  const removeAmenityCategory = (index) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter((_, idx) => idx !== index)
    }));
    toast({
      title: "Success",
      description: "Amenity item removed successfully",
      variant: "success",
      className: "bg-green-200 border-green-400 text-black text-lg",
      duration: 2000
    })
  };

  const removeAmenityItem = (categoryIndex, itemIndex) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.map((category, idx) =>
        idx === categoryIndex
          ? {
            ...category,
            items: category.items.filter((_, iIdx) => iIdx !== itemIndex)
          }
          : category
      )
    }));
    toast({
      title: "Success",
      description: "Amenity item removed successfully",
      variant: "success",
      className: "bg-green-200 border-green-400 text-black text-lg",
      duration: 2000
    })
  };

  const handleDeleteRoom = async () => {
    try {
      await deleteRoom();
      toast({
        title: "Success",
        description: "Room deleted successfully",
      });
      navigate('/dashboard/rooms');
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete room.",
        variant: "destructive",
      });
      if (error.message === 'Authentication required. Please log in again.') {
        navigate('/login', { state: { from: location.pathname } });
      }
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            className="flex items-center gap-2"
            onClick={() => navigate('/dashboard/rooms')}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Rooms
          </Button>
          <h1 className="text-2xl font-bold">
            {isNewRoom ? 'Add New Room' : 'Edit Room'}
          </h1>
        </div>
        {!isNewRoom && (
          <Badge variant={formData.isAvailable ? "success" : "secondary"}>
            {formData.isAvailable ? 'Available' : 'Not Available'}
          </Badge>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Room Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Availability Toggle */}
            <div className="flex items-center justify-between border-b pb-4">
              <div className="space-y-0.5">
                <Label>Room Availability</Label>
                <div className="text-sm text-muted-foreground">
                  Control whether this room can be booked by guests
                </div>
              </div>
              <Switch
                checked={formData.isAvailable}
                onCheckedChange={(checked) =>
                  setFormData(prev => ({ ...prev, isAvailable: checked }))
                }
              />
            </div>

            {/* room slots */}
            <div className="border-b pb-6">
              <h3 className="text-lg font-medium mb-4">Room Slots Management</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="totalSlots">Total Slots *</Label>
                  <Input
                    id="totalSlots"
                    type="number"
                    min="1"
                    value={formData.totalSlots}
                    onChange={(e) => {
                      const newTotalSlots = parseInt(e.target.value) || 0;
                      setFormData(prev => ({
                        ...prev,
                        totalSlots: newTotalSlots,
                        availableSlots: Math.max(0, newTotalSlots - prev.bookedSlots)
                      }));
                    }}
                    required
                    className="font-medium"
                  />
                  <span className="text-sm text-muted-foreground">
                    Set the total number of slots for this room
                  </span>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="bookedSlots">Currently Booked</Label>
                  <Input
                    id="bookedSlots"
                    type="number"
                    value={formData.bookedSlots}
                    disabled
                    className="bg-gray-50"
                  />
                  <span className="text-sm text-muted-foreground">
                    Number of slots currently booked
                  </span>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="availableSlots">Available Slots</Label>
                  <Input
                    id="availableSlots"
                    type="number"
                    value={formData.availableSlots}
                    disabled
                    className="bg-gray-50"
                  />
                  <span className="text-sm text-muted-foreground">
                    Remaining available slots
                  </span>
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Room Type *</Label>
                <Select
                  value={formData.name}
                  onValueChange={(value) => setFormData(prev => ({
                    ...prev,
                    name: value
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select room type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Premium">Premium</SelectItem>
                    <SelectItem value="Super Deluxe">Super Deluxe</SelectItem>
                    <SelectItem value="Deluxe">Deluxe</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    description: e.target.value
                  }))}
                  placeholder="Describe the room and its features"
                  required
                  className="min-h-[100px]"
                />
              </div>
            </div>

            {/* Room Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="pricePerNight">Price per Night (₹) *</Label>
                <Input
                  id="pricePerNight"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Enter the price per night"
                  value={formData.pricePerNight}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    pricePerNight: e.target.value
                  }))}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="discountedPrice">Discounted Price (₹)</Label>
                <Input
                  id="discountedPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Enter the discounted price"
                  value={formData.discountedPrice}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    discountedPrice: e.target.value
                  }))}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="maxOccupancy">Max Occupancy *</Label>
                <Input
                  id="maxOccupancy"
                  type="number"
                  min="1"
                  max="10"
                  placeholder="Enter the maximum occupancy"
                  value={formData.maxOccupancy}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    maxOccupancy: e.target.value
                  }))}
                  required
                />
              </div>
            </div>

            {/* Taxes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="vat">VAT (%)</Label>
                <Input
                  id="vat"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.taxes.vat}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    taxes: { ...prev.taxes, vat: parseFloat(e.target.value) || 0 }
                  }))}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="serviceTax">Service Tax (%)</Label>
                <Input
                  id="serviceTax"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.taxes.serviceTax}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    taxes: { ...prev.taxes, serviceTax: parseFloat(e.target.value) || 0 }
                  }))}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="otherTax">Other Tax (%)</Label>
                <Input
                  id="otherTax"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.taxes.other}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    taxes: { ...prev.taxes, other: parseFloat(e.target.value) || 0 }
                  }))}
                />
              </div>
            </div>

            {/* Images */}
            <div className="grid gap-4">
              <Label>Room Images</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.existingImages.map((image, index) => (
                  <div key={`existing-${index}`} className="relative group">
                    <img
                      src={getImageUrl(image)}
                      alt={`Room ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          existingImages: prev.existingImages.filter((_, i) => i !== index)
                        }));
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {formData.images.map((image, index) => (
                  <div key={`new-${index}`} className="relative group">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`New Room ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          images: prev.images.filter((_, i) => i !== index)
                        }));
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <label className="border-2 border-dashed rounded-lg p-4 hover:bg-gray-50 cursor-pointer flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                  <div className="flex flex-col items-center gap-1">
                    <Upload className="w-8 h-8" />
                    <span className="text-sm font-medium">Upload Images</span>
                    <span className="text-xs">Drag & drop or click</span>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
            </div>

            {/* Amenities */}
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <Label>Amenities</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addAmenityCategory}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Category
                </Button>
              </div>

              <div className="space-y-6">
                {formData.amenities.map((category, categoryIndex) => (
                  <Card key={categoryIndex} className="relative">
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6"
                      onClick={() => removeAmenityCategory(categoryIndex)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <CardContent className="pt-6">
                      <div className="grid gap-4">
                        <div className="grid gap-2">
                          <Label>Category</Label>
                          <Select
                            value={category.category}
                            onValueChange={(value) => updateAmenityCategory(categoryIndex, 'category', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {AMENITY_CATEGORIES.map((cat) => (
                                <SelectItem key={cat} value={cat}>
                                  {cat}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid gap-2">
                          <Label>Description</Label>
                          <Input
                            value={category.description}
                            onChange={(e) => updateAmenityCategory(categoryIndex, 'description', e.target.value)}
                            placeholder="Category description (optional)"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Items</Label>
                          {category.items.map((item, itemIndex) => (
                            <div key={itemIndex} className="flex gap-2">
                              <Input
                                value={item.name}
                                onChange={(e) => updateAmenityItem(categoryIndex, itemIndex, 'name', e.target.value)}
                                placeholder="Amenity name"
                                className="flex-grow"
                              />
                              <Input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => updateAmenityItem(categoryIndex, itemIndex, 'quantity', parseInt(e.target.value) || 1)}
                                min="1"
                                className="w-24"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                onClick={() => removeAmenityItem(categoryIndex, itemIndex)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addAmenityItem(categoryIndex)}
                            className="w-full flex items-center gap-2"
                          >
                            <Plus className="w-4 h-4" />
                            Add Item
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/dashboard/rooms')}
          >
            Cancel
          </Button>
          {!isNewRoom && (
            <Button
              type="button"
              variant="destructive"
              onClick={() => setIsDeleteModalOpen(true)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Room
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {isNewRoom ? 'Create Room' : 'Update Room'}
          </Button>
        </div>
      </form>

      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to delete this room?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the room
              and remove all associated data from our servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteRoom}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RoomsForm;