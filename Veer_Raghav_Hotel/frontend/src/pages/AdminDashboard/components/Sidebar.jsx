import React, { useState } from 'react';
import { useAuth } from "@/hooks/useAuth";
import { LayoutDashboard, UserCog, Users, CalendarCheck, Receipt, Bell, Settings, LogOut, ChevronRight, ChevronDown, Dot, Mail, House, Home, Calendar, CreditCard, BarChart, SquareArrowOutUpLeft } from 'lucide-react';
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import LogoutConfirmationModal from '@/components/LogoutConfirmationModal';
import { useToast } from '@/hooks/use-toast';


const Sidebar = () => {
    const { user, loading, logout } = useAuth();
    const location = useLocation();
    const [expandedSections, setExpandedSections] = useState({});
    const { toast } = useToast();
    //   const {notifications} = useAdmin();

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-orange-500"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex justify-center items-center min-h-screen text-gray-600">
                Please log in to view your profile
            </div>
        );
    }

    const handleLogout = () => {
        logout();
        window.location.href = "/auth/login";
        toast({
            title: "Logout successful",
            description: "You have successfully logged out.",
            variant: "success",
            className: "bg-green-200 border-green-400 text-black text-lg",
            duration: 3000
          });
    };

    const getLinkClass = (path, isNested = false) => {
        const isActive = location.pathname === path;
        return `flex items-center p-3 rounded-lg gap-3 cursor-pointer mb-2 transition-all duration-300 ease-in-out transform ${isActive
            ? 'bg-orange-100 text-orange-600 font-medium'
            : 'text-gray-700 hover:bg-orange-50 hover:text-orange-500'
            } ${isNested ? 'pl-10' : ''}`;
    };

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const navItems = [
        { icon: Home, label: 'Dashboard', path: '/dashboard' },
        { icon: Calendar, label: 'Bookings', path: '/dashboard/bookings' },
        { icon: Users, label: 'Guests', path: '/dashboard/guests' },
        { icon: UserCog, label: 'Users', path: '/dashboard/users' },
        { icon: House, label: 'Rooms', path: '/dashboard/Rooms' },
        { icon: CreditCard, label: 'Payments', path: '/dashboard/payments' },
        { icon: BarChart, label: 'Reports', path: '/dashboard/reports' },
        { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
    ];


    return (
        <div className="bg-white p-6 h-full w-80 sm:w-72 flex flex-col border-r border-gray-200 ">
            {/* Profile Section */}
            <div className="flex flex-col items-center mb-5">
                <div className="relative">
                    <img
                        className="rounded-md w-32 h-32 shadow-lg object-cover"
                        src={user.Image || "https://www.training.com.au/wp-content/uploads/admin-worker-vector.png"}
                        alt="Admin Profile"
                    />
                </div>
                <h2 className="text-xl font-semibold text-gray-800 pt-3">
                    {user.name}
                </h2>
                <p className="text-sm text-gray-600 mt-1">Administrator</p>
            </div>

            {/* Navigation Links */}
            <ScrollArea className="flex-grow overflow-y-auto text-base pt-5">
                <ul className="space-y-1">
                    {navItems.map((item) => (
                        <li key={item.label}>
                            {item.subItems ? (
                                <div>
                                    <motion.button
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => toggleSection(item.label)}
                                        className={`w-full ${getLinkClass('')}`}
                                    >
                                        <item.icon className="w-4 h-4" />
                                        <span className="flex-grow text-left">{item.label}</span>
                                        {expandedSections[item.label] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                    </motion.button>
                                    <AnimatePresence>
                                        {expandedSections[item.label] && (
                                            <motion.ul
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                                className="mt-1 space-y-1 overflow-hidden"
                                            >
                                                {item.subItems.map((subItem) => (
                                                    <motion.li
                                                        key={subItem.path}
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, x: -20 }}
                                                        transition={{ duration: 0.2 }}
                                                    >
                                                        <Link
                                                            to={subItem.path}
                                                            className={getLinkClass(subItem.path, true)}
                                                        >
                                                            <subItem.icon className="w-5 h-5" />
                                                            <span className="flex-grow">{subItem.label}</span>
                                                        </Link>
                                                    </motion.li>
                                                ))}
                                            </motion.ul>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <Link
                                    to={item.path}
                                    className={getLinkClass(item.path)}
                                >
                                    <item.icon className="w-4 h-4" />
                                    <span className="flex-grow">{item.label}</span>
                                </Link>
                            )}
                        </li>
                    ))}
                </ul>
            </ScrollArea>

            {/* Bottom Navigation */}
            <div className="mt-auto pt-4 border-t border-gray-200 flex flex-col space-y-2 md:space-y-0">
                <Link to="/">
                    <div className='md:hidden w-full px-4 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-200 flex items-center justify-center'>
                        <SquareArrowOutUpLeft />
                        <span className="ml-2">Go to Main Website</span>
                    </div>
                </Link>
                <LogoutConfirmationModal onConfirm={handleLogout} >
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        className="w-full px-4 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-200 flex items-center justify-center"
                    >
                        <LogOut className="w-5 h-5 mr-2" />
                        <span>Logout</span>
                    </motion.button>
                </LogoutConfirmationModal>
            </div>
        </div>
    );
}

export default Sidebar;