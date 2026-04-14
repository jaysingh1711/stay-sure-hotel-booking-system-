import React, { createContext, useContext, useCallback, useState } from 'react';
import api from '@/utils/api';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [userBookings, setUserBookings] = useState([]);
  const { toast } = useToast();


  const createBooking = useCallback(async (bookingData) => {

    try {
      const response = await api.post('/booking', bookingData);
      console.log(response.data);

      return {
        success: true,
        message: "Booking created successfully.",
        booking: response.data.booking
      };
    } catch (error) {
      console.error('Booking error:', error);

      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to create booking',
        booking: null
      };
    }
  }, []);
  const cancelBooking = async (bookingId) => {
    try {
      const response = await api.put(`/booking/${bookingId}/cancel`, {});
      return response.data;
    } catch (error) {
      console.error('Error cancelling booking:', error);
      throw error;
    }
  };

  const getAllBookings = async () => {
    try {
      const response = await api.get('/bookings');
      return Array.isArray(response.data) ? response.data :
        Array.isArray(response.data.bookings) ? response.data.bookings : [];
    } catch (error) {
      console.error('Error fetching all bookings:', error);
      throw error;
    }
  };

  const getBookingById = async (bookingId) => {
    try {
      const response = await api.get(`/booking/${bookingId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching booking:', error);
      throw error;
    }
  };

  const getBookingsByUserId = async (user) => {
    try {
      const response = await api.get(`/booking/user/${user._id}`);
      const bookingsArray = response.data.bookings || response.data || [];
      setUserBookings(Array.isArray(bookingsArray) ? bookingsArray : []);
      if (response.data.success) {
        return response.data;
      }
    } catch (error) {
      console.error('Error fetching bookings by user:', error);
      throw error;
    }
  };

  const getBookingsByUserIdbyAdmin = async (userId) => {
    try {
      const response = await api.get(`/booking/user/${userId}`);
      console.log('Bookings by user:', response.data);
      setUserBookings(response.data);
      if (response.data.success) {
        toast({
          title: 'Success',
          description: response.data.message,
          variant: 'success',
          className: 'bg-green-200 border-green-400 text-black text-lg',
          duration: 3000
        })
        return response.data;
      } else {
        console.log(response.data.message);
        return response.data;
      }

    } catch (error) {
      console.error('Error fetching bookings by user:', error);
      throw error;
    }
  };

  const UpdateBookingStatus = async (bookingId, status) => {
    try {
      const response = await api.put(`/booking/status/${bookingId}`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  };


  const value = {
    createBooking,
    cancelBooking,
    getAllBookings,
    getBookingById,
    getBookingsByUserId,
    userBookings,
    getBookingsByUserIdbyAdmin,
    UpdateBookingStatus
  };

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};