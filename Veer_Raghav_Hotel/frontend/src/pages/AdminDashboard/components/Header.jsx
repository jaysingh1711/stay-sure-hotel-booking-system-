import React from 'react';
import { Search, Bell, Menu, SquareArrowOutUpLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from '@/components/ui/tooltip';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Header = ({ title, onMenuToggle, onClick }) => {
    return (
        <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white z-10 p-4 flex justify-between items-center"
        >
            {/* Mobile Menu Toggle */}
            <button
                className="lg:hidden mr-4"
                onClick={onClick}
            >
                <Menu className="h-6 w-6 text-gray-600" />
            </button>

            {/* Page Title */}
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 truncate">
                {title}
            </h1>

            {/* Search and Notifications */}
            <div className="flex items-center space-x-2 sm:space-x-4">
                <Link to="/">
                <div className='w-full text-sm px-4 py-2 cursor-pointer text-orange-600 rounded-lg hover:bg-orange-100 transition-colors duration-200 flex items-center justify-center'>
                    <SquareArrowOutUpLeft className='h-5 w-5'/>
                    <span className="ml-2">Go to Main Website</span>
                </div>
                </Link>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Bell />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Notifications</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </motion.div>
    );
};

export default Header;