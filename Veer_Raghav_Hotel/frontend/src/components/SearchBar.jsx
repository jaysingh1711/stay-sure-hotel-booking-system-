import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { format } from "date-fns";
import { CalendarIcon, ArrowRight } from 'lucide-react';
import { useRoom } from '@/context/RoomContext';

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import ImageSlider from '@/pages/rooms/components/ImageSlider';
import RoomCard from '@/pages/rooms/components/RoomCard';

// Define room types constant to match schema
const ROOM_TYPES = ['Premium', 'Super Deluxe', 'Deluxe'];

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

const HotelBookingSystem = () => {
  const navigate = useNavigate();
  const { Rooms, getAllRooms, loading } = useRoom();
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [roomCount, setRoomCount] = useState("1");
  const [roomType, setRoomType] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);

  useEffect(() => {
    getAllRooms();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const searchParams = new URLSearchParams();
    if (checkIn) searchParams.set('checkIn', checkIn.toISOString());
    if (checkOut) searchParams.set('checkOut', checkOut.toISOString());
    searchParams.set('rooms', roomCount);
    searchParams.set('roomType', roomType);
    searchParams.set('adults', adults.toString());
    searchParams.set('children', children.toString());
    navigate(`/rooms?${searchParams.toString()}`);
  };

  const handleClearFilters = () => {
    setCheckIn(null);
    setCheckOut(null);
    setRoomCount("1");
    setRoomType("");
    setAdults(1);
    setChildren(0);
  };

  const isAnyFilterActive = () => {
    return checkIn !== null ||
      checkOut !== null ||
      roomCount !== "1" ||
      roomType !== "" ||
      adults !== 1 ||
      children !== 0;
  };

  const calculateAverageRating = (ratings) => {
    if (!ratings || ratings.length === 0) return "New";
    const average = ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length;
    return average.toFixed(1);
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-b from-orange-50 to-orange-200 p-6"
    >
      <motion.div className="space-y-12">
        {/* Search Form */}
        <Card className="backdrop-blur-sm bg-white/90 shadow-xl rounded-2xl overflow-hidden border-t border-white/60 mx-auto max-w-7xl">
          <CardContent className="p-6">
            <motion.h2
              className="text-2xl font-semibold text-orange-400 mb-6 text-center"
              variants={itemVariants}
            >
              Find Your Perfect Stay
            </motion.h2>

            <motion.form onSubmit={handleSearch} className="space-y-6" variants={containerVariants}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {/* Check-in Date */}
                <motion.div className="space-y-2" variants={itemVariants}>
                  <Label htmlFor="check-in">Check-in Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="check-in"
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !checkIn && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 text-orange-600" />
                        {checkIn ? format(checkIn, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={checkIn}
                        onSelect={setCheckIn}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </motion.div>

                {/* Check-out Date */}
                <motion.div className="space-y-2" variants={itemVariants}>
                  <Label htmlFor="check-out">Check-out Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="check-out"
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !checkOut && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 text-orange-600" />
                        {checkOut ? format(checkOut, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={checkOut}
                        onSelect={setCheckOut}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </motion.div>

                {/* Room Count */}
                <motion.div className="space-y-2" variants={itemVariants}>
                  <Label htmlFor="room-count">Number of Rooms</Label>
                  <Select value={roomCount} onValueChange={setRoomCount}>
                    <SelectTrigger id="room-count">
                      <SelectValue placeholder="Select rooms" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} {num === 1 ? 'Room' : 'Rooms'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </motion.div>

                {/* Room Type */}
                <motion.div className="space-y-2" variants={itemVariants}>
                  <Label htmlFor="room-type">Room Type</Label>
                  <Select value={roomType} onValueChange={setRoomType}>
                    <SelectTrigger id="room-type" className="w-full">
                      <SelectValue placeholder="Select room type" />
                    </SelectTrigger>
                    <SelectContent>
                      {ROOM_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </motion.div>

                {/* Guests */}
                <motion.div className="space-y-2" variants={itemVariants}>
                  <Label>Guests</Label>
                  <div className="flex space-x-2">
                    <div className="flex-1">
                      <Select value={adults.toString()} onValueChange={(value) => setAdults(Number(value))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Adults" />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4].map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} Adult{num !== 1 ? 's' : ''}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex-1">
                      <Select value={children.toString()} onValueChange={(value) => setChildren(Number(value))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Children" />
                        </SelectTrigger>
                        <SelectContent>
                          {[0, 1, 2, 3].map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} Child{num !== 1 ? 'ren' : ''}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </motion.div>
              </div>

              <motion.div className="flex justify-center gap-4" variants={itemVariants}>
                {isAnyFilterActive() && (
                  <Button
                    type="button"
                    onClick={handleClearFilters}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Clear All Filters
                  </Button>
                )}
                <Button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-medium shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Search Rooms
                </Button>
              </motion.div>
            </motion.form>
          </CardContent>
        </Card>

        {/* Featured Rooms */}
        <motion.div className="space-y-6 max-w-6xl mx-auto" variants={containerVariants}>
          <motion.h2
            className="text-2xl font-semibold text-center text-gray-800"
            variants={itemVariants}
          >
            Featured Rooms
          </motion.h2>
          <AnimatePresence>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                <motion.div
                  className="col-span-full flex justify-center items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-orange-500"></div>
                </motion.div>
              ) : Rooms.length === 0 ? (
                <motion.p
                  className="col-span-full text-center text-gray-600"
                  variants={itemVariants}
                >
                  No rooms available.
                </motion.p>
              ) : (
                Rooms.slice(0, 3).map((room) => (
                  <motion.div
                    key={room._id}
                    variants={itemVariants}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    className="bg-white rounded-xl overflow-hidden shadow-lg"
                  >
                    <ImageSlider images={room.images} />
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-semibold text-gray-800">{room.name}</h3>
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-gray-600">{calculateAverageRating(room.ratings)}</span>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-4">
                        {room.description?.length > 50
                          ? `${room.description.slice(0, 50)}...`
                          : room.description}

                      </p>
                      <RoomCard
                        room={room}
                        filters={{ startDate: checkIn, endDate: checkOut, rooms: roomCount }}
                        onBookNow={(roomId) => navigate(`/rooms/${roomId}`)}
                      />
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </AnimatePresence>
        </motion.div>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="flex justify-center mt-10"
      >
        <motion.a
          href="/rooms"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center space-x-2 bg-white text-orange-600 px-8 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200"
        >
          <span>View More Rooms</span>
          <ArrowRight className="h-4 w-4 ml-2" />
        </motion.a>
      </motion.div>
    </motion.div>
  );
};

export default HotelBookingSystem;

