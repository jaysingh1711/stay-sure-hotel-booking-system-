import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
    Loader2,
    Plus,
    Users,
    DollarSign,
    Star,
    CheckCircle2,
    XCircle,
    Edit,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Bed,
    Bath,
    Wifi
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useRoom } from '@/context/RoomContext';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { Skeleton } from "@/components/ui/skeleton";

const CustomizeRooms = () => {
    const navigate = useNavigate();
    const { Rooms, getAllRooms, deleteRoom, getImageUrl, loading } = useRoom();
    const { user } = useAuth();

    const [roomToDelete, setRoomToDelete] = useState(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeImageIndices, setActiveImageIndices] = useState({});

    useEffect(() => {
        if (!user) {
            navigate('/login', { state: { from: location.pathname } });
            return;
        }
        getAllRooms();
    }, []);

    const confirmDelete = (room) => {
        setRoomToDelete(room);
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteRoom = async () => {
        if (roomToDelete) {
            try {
                await deleteRoom(roomToDelete._id);
                toast({
                    title: "Success",
                    description: "Room deleted successfully",
                });
            } catch (error) {
                toast({
                    title: "Error",
                    description: error.message || "Failed to delete room",
                    variant: "destructive",
                });
                if (error.message === 'Authentication required. Please log in again.') {
                    navigate('/login', { state: { from: location.pathname } });
                }
            } finally {
                setIsDeleteDialogOpen(false);
                setRoomToDelete(null);
            }
        }
    };

    const handleNextImage = (roomId) => {
        setActiveImageIndices(prev => {
            const currentIndex = prev[roomId] || 0;
            const room = Rooms.find(r => r._id === roomId);
            const maxIndex = room.images.length - 1;
            return {
                ...prev,
                [roomId]: currentIndex >= maxIndex ? 0 : currentIndex + 1
            };
        });
    };

    const handlePrevImage = (roomId) => {
        setActiveImageIndices(prev => {
            const currentIndex = prev[roomId] || 0;
            const room = Rooms.find(r => r._id === roomId);
            const maxIndex = room.images.length - 1;
            return {
                ...prev,
                [roomId]: currentIndex <= 0 ? maxIndex : currentIndex - 1
            };
        });
    };

    const getKeyAmenities = (room) => {
        const amenitiesByCategory = {};
        room.amenities?.forEach(category => {
            amenitiesByCategory[category.category] = category.items;
        });

        return {
            beds: amenitiesByCategory['No of Bed']?.[0]?.quantity || 0,
            bathrooms: amenitiesByCategory['No of Washroom']?.[0]?.quantity || 0,
            hasWifi: amenitiesByCategory['Basic Facilities']?.some(item =>
                item.name.toLowerCase().includes('wifi'))
        };
    };

    const calculateTotalPrice = (price, taxes) => {
        const taxAmount = price * (
            (taxes?.vat || 0) / 100 +
            (taxes?.serviceTax || 0) / 100 +
            (taxes?.other || 0) / 100
        );
        return price + taxAmount;
    };

    const filteredRooms = Rooms.filter(room =>
        room.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const RoomSkeleton = () => (
        <Card className="overflow-hidden">
            <CardHeader className="p-0">
                <Skeleton className="w-full h-48" />
            </CardHeader>
            <CardContent className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/4 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-4" />
                <div className="grid grid-cols-2 gap-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                </div>
            </CardContent>
            <CardFooter className="flex justify-between p-4">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
            </CardFooter>
        </Card>
    );

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <Skeleton className="h-10 w-48" />
                    <Skeleton className="h-10 w-36" />
                </div>
                <Skeleton className="h-10 w-full max-w-sm mb-6" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, index) => (
                        <RoomSkeleton key={index} />
                    ))}
                </div>
            </div>
        );
    }

    if (Rooms.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Customize Rooms</h1>
                    <Link to="/dashboard/rooms/new">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Add New Room
                        </Button>
                    </Link>
                </div>
                <Card className="text-center py-16">
                    <CardContent>
                        <div className="space-y-4">
                            <h2 className="text-2xl font-semibold">No Rooms Available</h2>
                            <p className="text-gray-500">Get started by adding your first room!</p>
                            <Button asChild className="mt-4">
                                <Link to="/dashboard/rooms/new">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create New Room
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Customize Rooms</h1>
                <Link to="/dashboard/rooms/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add New Room
                    </Button>
                </Link>
            </div>

            <div className="mb-6">
                <Input
                    type="text"
                    placeholder="Search rooms..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRooms.map((room) => {
                    const keyAmenities = getKeyAmenities(room);
                    const totalPrice = calculateTotalPrice(room.pricePerNight, room.taxes);

                    return (
                        <Card key={room._id} className="overflow-hidden">
                            <CardHeader className="p-0 relative">
                                {room.images && room.images.length > 0 ? (
                                    <>
                                        <img
                                            src={getImageUrl(room.images[activeImageIndices[room._id] || 0])}
                                            alt={room.name}
                                            className="w-full h-48 object-cover"
                                        />
                                        {room.images.length > 1 && (
                                            <>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                                                    onClick={() => handlePrevImage(room._id)}
                                                >
                                                    <ChevronLeft className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                                                    onClick={() => handleNextImage(room._id)}
                                                >
                                                    <ChevronRight className="h-4 w-4" />
                                                </Button>
                                                <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded-md text-sm">
                                                    {(activeImageIndices[room._id] || 0) + 1}/{room.images.length}
                                                </div>
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                                        <span className="text-gray-400">No image available</span>
                                    </div>
                                )}
                            </CardHeader>
                            <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <CardTitle className="text-xl">{room.name}</CardTitle>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Badge variant={room.isAvailable ? "success" : "secondary"}>
                                                {room.isAvailable ?
                                                    <CheckCircle2 className="w-3 h-3 mr-1" /> :
                                                    <XCircle className="w-3 h-3 mr-1" />
                                                }
                                                {room.isAvailable ? 'Available' : 'Not Available'}
                                            </Badge>
                                            <Badge variant="outline">
                                                {room.availableSlots}/{room.totalSlots} slots
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 mb-4">
                                    {room?.description?.length > 70
                                        ? `${room?.description.slice(0, 70)}...`
                                        : room?.description}
                                </p>
                                <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                                    <div className="flex items-center gap-1">
                                        <span className="font-semibold text-base">
                                            {room.DiscountedPrice > 0 ? (
                                                <>
                                                    <span className="text-green-600">₹{room.DiscountedPrice}</span>
                                                    <span className="text-sm line-through text-gray-400 ml-2">
                                                        ₹{room.pricePerNight}
                                                    </span>
                                                </>
                                            ) : (
                                                <span>₹{room.pricePerNight}</span>
                                            )}
                                            <span className="text-sm text-gray-500">/night</span>
                                        </span>
                                    </div>
                                    {room.ratings && room.ratings.length > 0 && (
                                        <div className="flex items-center gap-1">
                                            <Star className="w-4 h-4 text-yellow-400" />
                                            <span>
                                                {(room.ratings.reduce((acc, curr) => acc + curr.rating, 0) / room.ratings.length).toFixed(1)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-1">
                                        <Bed className="w-4 h-4" />
                                        <span>{keyAmenities.beds} Beds</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Bath className="w-4 h-4" />
                                        <span>{keyAmenities.bathrooms} Baths</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Users className="w-4 h-4" />
                                        <span>Max {room.maxOccupancy}</span>
                                    </div>
                                    {keyAmenities.hasWifi && (
                                        <div className="flex items-center gap-1">
                                            <Wifi className="w-4 h-4" />
                                            <span>WiFi</span>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between p-4">
                                <Button variant="outline" asChild>
                                    <Link to={`/dashboard/rooms/${room._id}`}>
                                        <Edit className="w-4 h-4 mr-2" />
                                        Edit
                                    </Link>
                                </Button>
                                <Button variant="destructive" onClick={() => confirmDelete(room)}>
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                </Button>
                            </CardFooter>
                        </Card>
                    );
                })}
            </div>

            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you sure you want to delete this room?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently delete the room
                            and remove all associated data from our servers including bookings,
                            ratings, and images.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={loading}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteRoom} disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CustomizeRooms;