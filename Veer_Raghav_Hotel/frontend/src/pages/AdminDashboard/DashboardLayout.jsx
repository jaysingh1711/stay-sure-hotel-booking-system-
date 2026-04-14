import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { X } from 'lucide-react';
import { Link, Outlet, useNavigate } from 'react-router-dom';

const DashboardLayout = () => {
    const { user, loading, fetchUserProfile } = useAuth();
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const initializeProfile = async () => {
            await fetchUserProfile();
            setIsInitialLoad(false);
        };
        initializeProfile();
    }, []);

    useEffect(() => {
        if (user && user.role !== 'admin') {
            navigate('/auth/login');
        }
    }, [user, navigate]);

    useEffect(() => {
        const handleResize = () => {
            setIsSidebarOpen(window.innerWidth >= 1024);
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Set initial state
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (isInitialLoad || loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin w-6 h-6 border-4 border-orange-500 border-t-transparent rounded-full" />
            </div>
        );
    }

    if (!isInitialLoad && !user) {
        return (
            <div className="flex flex-col items-center justify-center h-screen space-y-4">
                <h1 className="text-xl font-semibold text-gray-900">
                    You are not authorized to access this page. Please login.
                </h1>
                <Link
                    to="/auth/login"
                    className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
                >
                    Login
                </Link>
            </div>
        );
    }

    const toggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    return (
        <div className="flex h-screen overflow-hidden">
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <button
                    className="lg:hidden absolute top-4 right-4 z-60"
                    onClick={toggleSidebar}
                >
                    <X className="h-6 w-6 text-gray-600" />
                </button>
                <Sidebar />
            </aside>
            <div className="flex w-full flex-col overflow-hidden">
                <div className="px-4 sm:px-6 lg:px-8">
                    <Header title="Admin Dashboard" onClick={toggleSidebar} />
                </div>
                <main className="flex-grow overflow-y-auto border-t">
                    <div className="p-4 sm:p-6 lg:p-8">
                        <Outlet />
                    </div>
                </main>
            </div>
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={toggleSidebar}
                ></div>
            )}
        </div>
    );
};

export default DashboardLayout;
