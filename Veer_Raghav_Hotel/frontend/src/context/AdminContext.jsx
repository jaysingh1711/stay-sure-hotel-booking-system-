import { useAuth } from '@/hooks/useAuth';
import api from '@/utils/api';
import React, { createContext, useContext, useState } from 'react';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
    const [Guests, setGuests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dashboardStats, setDashboardStats] = useState({
        totalBookings: 0,
        totalGuests: 0,
        totalUsers: 0,
        revenue: 0,
        recentBookings: []
    });

    const [Percentage, setPercentage] = useState(0);

    const fetchDashboardStats = async () => {
        setLoading(true);
        try {
            const response = await api.get('/admindashboard');
            const recentBookings = Array.isArray(response.data.recentBookings) 
                ? response.data.recentBookings 
                : [];
            console.log('recentBookings:', recentBookings);
            
            setDashboardStats({
                totalBookings: response.data.totalBookings || 0,
                totalGuests: response.data.totalGuests || 0,
                totalUsers: response.data.totalUsers || 0,
                revenue: response.data.revenue || 0,
                recentBookings: recentBookings
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            setDashboardStats({
                totalBookings: 0,
                totalGuests: 0,
                totalUsers: 0,
                revenue: 0,
                recentBookings: []
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await api.get('/user');
            if (Array.isArray(response.data)) {
                const guestUsers = response.data.filter(user => user.role !== 'admin');
                setGuests(guestUsers);
                return guestUsers;
            } else {
                console.error('Invalid users response format:', response.data);
                setGuests([]);
                return [];
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            setGuests([]);
            return [];
        } finally {
            setLoading(false);
        }
    };

    const deleteUser = async (userId) => {
        setLoading(true);
        try {
            const response = await api.delete(`/user/delete/${userId}`);
            if (response.data) {
                // Refresh users list after deletion
                await fetchUsers();
            }
            return response.data;
        } catch (error) {
            console.error('Error deleting user:', error);
        } finally {
            setLoading(false);
        }
    };

    const getBookingsPercentage = async () => {
        setLoading(true);
        try {
            const response = await api.get('/getallchange');
            if (response.data) {
                setPercentage(response.data);
                return response.data;
            } 
        } catch (error) {
            console.error('Error fetching bookings percentage:', error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <AdminContext.Provider value={{ 
            fetchUsers,
            deleteUser,
            fetchDashboardStats,
            dashboardStats,
            Guests,
            loading,
            getBookingsPercentage,
            Percentage
        }}>
            {children}
        </AdminContext.Provider>
    );
};

export const useAdminContext = () => useContext(AdminContext);