import React, { createContext, useContext, useCallback, useState } from 'react';
import api from '@/utils/api';

const RoomContext = createContext();

const API_BASE_URL = import.meta.env.VITE_BACKEND_UPLOAD_URL;

export const RoomProvider = ({ children }) => {
  const [Rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [availabilityData, setAvailabilityData] = useState(null);

  const getImageUrl = useCallback((imagePath) => {
    if (!imagePath) return '/placeholder-room.jpg';
    return `${API_BASE_URL}/${imagePath}`;
  }, []);

  const putRating = async (roomId, ratingData) => {
    try {
      const response = await api.post(`/room/rating/${roomId}`, ratingData);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  };

  const getAverageRating = async (roomId) => {
    try {
      const response = await api.get(`/room/rating/${roomId}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  };

  const addRoom = async (roomData) => {
    try {
      const basicRoomData = {
        name: roomData.name,
        pricePerNight: roomData.pricePerNight,
        amenities: roomData.amenities,
        description: roomData.description,
        maxOccupancy: roomData.maxOccupancy,
        isAvailable: roomData.isAvailable
      };

      const response = await api.post('/room', basicRoomData);

      if (!response.data.room || !response.data.room._id) {
        throw new Error('Invalid response from server when creating room');
      }

      if (roomData.images && roomData.images.length > 0) {
        await addImagesToRoom(response.data.room._id, roomData.images);
      }

      return response.data.room;
    } catch (error) {
      console.error('Error in addRoom:', error);
      handleApiError(error);
    }
  };

  const addImagesToRoom = async (roomId, images) => {
    try {
      if (!roomId) {
        throw new Error('Room ID is required to add images');
      }

      const formData = new FormData();
      images.forEach((image, index) => {
        formData.append(`images`, image);
      });

      const response = await api.post(`/room/images/${roomId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (!response.data) {
        throw new Error('Failed to upload images');
      }

      return response.data;
    } catch (error) {
      console.error('Error in addImagesToRoom:', error);
      handleApiError(error);
    }
  };

  const deleteRoom = async (roomId) => {
    try {
      setLoading(true);
      const response = await api.delete(`/room/${roomId}`);
      await getAllRooms();
      return response.data;
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const getAllRooms = async () => {
    try {
      setLoading(true);
      const response = await api.get('/rooms');
      setRooms(response.data);
      return response.data;
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const getRoomById = async (roomId) => {
    try {
      const response = await api.get(`/room/${roomId}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  };

  const updateRoom = async (roomId, roomData) => {
    try {
      const response = await api.put(`/room/${roomId}`, roomData);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  };

  const getRoomBookingDates = async (roomId) => {
    try {
      const response = await api.get(`/booking/roomdates/${roomId}`);
      return response.data.dates;
    } catch (error) {
      handleApiError(error);
    }
  };

  const getRoomAvailability = async (roomId) => {
    try {
      const response = await api.get(`/booking/rooms/${roomId}`);
      console.log(response.data);
      
      setAvailabilityData(response.data.availability);
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleApiError = (error) => {
    if (error.response?.status === 401) {
      throw new Error('Authentication required. Please log in again.');
    }
    throw error;
  };

  const value = {
    putRating,
    getAverageRating,
    addRoom,
    addImagesToRoom,
    deleteRoom,
    getAllRooms,
    getRoomById,
    updateRoom,
    Rooms,
    getImageUrl,
    loading,
    getRoomBookingDates,
    getRoomAvailability,
    availabilityData
  };

  return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
};

export const useRoom = () => {
  const context = useContext(RoomContext);
  if (context === undefined) {
    throw new Error('useRoom must be used within a RoomProvider');
  }
  return context;
};