import { useAuth } from '@/hooks/useAuth';
import api from '@/utils/api';
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
  const [hotel, setHotel] = useState(null);
  const [ hotelInfo, setHotelInfo ] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hotelData, setHotelData] = useState(null);

  useEffect(() => {
    fetchHotel();
  }, []);

  const fetchHotel = async () => {
    try {
      const response = await api.get('/hotel');
      if (response.data) {
        setHotel(response.data);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to fetch hotel:', error);
      setIsLoading(false);
    }
  };

  const gethotel = async () => {
    try {
      const response = await api.get('/hotel');
      if (response.data) {
        setHotelInfo(response.data);
        setHotelData(response.data[0]);
      }
    } catch (error) {
      console.error('Failed to fetch hotel:', error);
    }
  };

  const createHotel = async (hotelData) => {
    try {
      const response = await api.post('/hotel', hotelData);
      setHotel(response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to create hotel:', error);
      throw error;
    }
  };

  const updateHotel = async (hotelId, hotelData) => {
    try {
      console.log('Making PUT request to:', `/hotel/${hotelId}`);
      console.log('With data:', hotelData);
      const response = await api.put(`/hotel/${hotelId}`, hotelData);
      
      if (response.data) {
        setHotel(Array.isArray(response.data) ? response.data : [response.data]);
        return response.data;
      }
      
      throw new Error('No data received from server');
    } catch (error) {
      console.error('Failed to update hotel:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
      }
      throw error;
    }
  };

  const uploadLogo = async (file) => {
    try {
      const formData = new FormData();
      formData.append('logo', file);
      if (!hotel?.[0]?._id) {
        throw new Error('Hotel ID not found');
      }

      const response = await api.put(`/hotel/image/${hotel[0]._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data) {
        setHotel(prevHotel => {
          const updatedHotel = [...prevHotel];
          updatedHotel[0] = {
            ...updatedHotel[0],
            logo: response.data.logo
          };
          return updatedHotel;
        });
      }
      
      return response.data;
    } catch (error) {
      console.error('Failed to upload logo:', error);
      throw error;
    }
  };


  return (
    <SettingsContext.Provider value={{ hotel, isLoading, createHotel, updateHotel, uploadLogo, fetchHotel, gethotel, hotelInfo,hotelData }}>
      {children}
    </SettingsContext.Provider>
  );
};

