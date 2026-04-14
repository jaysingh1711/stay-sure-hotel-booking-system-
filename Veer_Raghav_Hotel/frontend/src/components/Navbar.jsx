import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Typewriter from "typewriter-effect";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlignJustify,
  User,
  LogOut,
  Settings,
  BookOpen,
  Home,
  Home as GalleryIcon,
  PhoneCall,
  LayoutDashboard,
  ShieldCheck,
  Users,
  BarChart,
  Image,
  CircleUserRound
} from 'lucide-react';
import { LiaPrayingHandsSolid } from "react-icons/lia";
import { useAuth } from "@/hooks/useAuth";
import LogoutConfirmationModal from "./LogoutConfirmationModal";
import { useToast } from "@/hooks/use-toast";
import { useSettings } from "@/context/SettingsContext";

const Navbar = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const { gethotel, hotelData } = useSettings();
  

  useEffect(() => {
    const fetchHotelInfo = async () => {
      await gethotel();
    };

    fetchHotelInfo();
  }, []);


  const menuItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Gallery", path: "/gallery", icon: Image },
    { name: "Rooms", path: "/rooms", icon: LayoutDashboard },
    { name: "Contact", path: "/contact", icon: PhoneCall },
  ];

  const renderUserDropdown = () => {
    // Check if user is an admin
    const isAdmin = user?.role === 'admin';

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center text-black">
            <User className="mr-2 h-4 w-4" />
            <span className="hidden md:inline italic font-light">hello,</span> {user.name || user.email}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="capitalize">{user.role == ! 'admin' ? `Admin Controls` : `${user.name}'s Account`}</DropdownMenuLabel>
          {user.role == 'admin' ?
            <>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link to="/dashboard" className="flex items-center">
                  <BarChart className="mr-2 h-4 w-4" /> Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link to="/dashboard/guests" className="flex items-center">
                  <Users className="mr-2 h-4 w-4" /> Manage Users
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link to="/dashboard/settings" className="flex items-center">
                  <ShieldCheck className="mr-2 h-4 w-4" /> Admin Settings
                </Link>
              </DropdownMenuItem>
            </>
            : <>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link to="/profile" className="flex items-center">
                  <CircleUserRound className="mr-2 h-4 w-4" /> My Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link to="/profile/bookings" className="flex items-center">
                  <BookOpen className="mr-2 h-4 w-4" /> My Bookings
                </Link>
              </DropdownMenuItem>
            </>}

          {/* <DropdownMenuItem asChild>
                <Link to="/bookings" className="flex items-center">
                  <BookOpen className="mr-2 h-4 w-4" /> My Bookings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings" className="flex items-center">
                  <Settings className="mr-2 h-4 w-4" /> Settings
                </Link>
              </DropdownMenuItem> */}
          {/* Admin-specific menu items */}

          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <LogoutConfirmationModal onConfirm={handleLogout}>
              <div className="flex items-center p-2 text-sm hover:bg-red-600 rounded-md hover:text-white w-full cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </div>
            </LogoutConfirmationModal>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  const handleLogout = () => {
    logout();
    window.location.reload();
    toast({
      title: "Logout successful",
      description: "You have successfully logged out.",
      variant: "success",
      className: "bg-green-200 border-green-400 text-black text-lg",
      duration: 3000
    });
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white shadow-lg"
    >
      <div className="max-w-screen-xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="items-center text-[#FF9933] pr-5">
          <h1 className="text-xl font-bold">{hotelData?.name}</h1>
          <motion.div className="flex ml-4">
            <Typewriter
              options={{
                strings: ["Welcome", "स्वागत", "ਸੁਆਗਤ ਹੈ", "સ્વાગત છે"],
                autoStart: true,
                loop: true,
                delay: 75,
              }}
            />
            <LiaPrayingHandsSolid size={25} className="ml-2" />
          </motion.div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex flex-grow justify-end items-center space-x-4">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={
                location.pathname === item.path
                  ? "py-2 px-3 shadow-lg bg-[#FF9933] hover:text-black hover:bg-[#FF9933] text-white transition duration-200 rounded-md relative cursor-pointer border-double"
                  : "py-1.5 px-3 text-[#FF9933] hover:bg-[#FF9933] hover:text-black transition duration-200 rounded-md"
              }
            >
              {item.name}
            </Link>
          ))}

          {/* User Menu for Desktop */}
          {user ? (
            renderUserDropdown()
          ) : (
            <div className="space-x-2">
              <Button asChild variant="default" className="bg-[#FF9933] hover:bg-[#FF9933] hover:text-black">
                <Link to="/auth/login">Login</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/auth/register">Register</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        <Sheet open={isMenuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" className="md:hidden">
              <AlignJustify className="text-[#FF9933] text-lg" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[80%]">
            <SheetHeader>
              <SheetTitle className="text-2xl font-bold text-[#FF9933] text-center">Menu</SheetTitle>
            </SheetHeader>
            <div className="grid gap-4 py-6">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center space-x-2 text-lg border-b border-gray-200 py-2 hover:bg-[#FF9933]/10 hover:text-[#FF9933] transition-colors duration-200"
                >
                  <Button
                    variant="ghost"
                    className="w-full justify-start hover:bg-[#FF9933]/10 hover:text-[#FF9933] gap-4"
                  >
                    <item.icon className="h-5 w-5" />
                    <span className='text-base'>{item.name}</span>
                  </Button>
                </Link>
              ))}

              {user &&
                <>
                  {user?.role === 'admin' ? (
                    <>
                      <DropdownMenuSeparator className="my-2" />
                      <div className="text-sm font-semibold text-gray-500 px-4 mb-2">Admin Controls</div>
                      {[
                        { name: "Dashboard", path: "/dashboard", icon: BarChart },
                        { name: "Manage Users", path: "/dashboard/users", icon: Users },
                        { name: "Admin Settings", path: "/dashboard/settings", icon: ShieldCheck }
                      ].map((item) => (
                        <Link
                          key={item.name}
                          to={item.path}
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center space-x-2 text-lg border-b border-gray-200 py-2 hover:bg-[#FF9933]/10 hover:text-[#FF9933] transition-colors duration-200"
                        >
                          <Button
                            variant="ghost"
                            className="w-full justify-start hover:bg-[#FF9933]/10 hover:text-[#FF9933] gap-4"
                          >
                            <item.icon className="h-5 w-5" />
                            <span className='text-base'>{item.name}</span>
                          </Button>
                        </Link>
                      ))}
                    </>
                  ) : (
                    <>
                      <DropdownMenuSeparator className="my-2" />
                      <div className="text-sm font-semibold text-gray-500 px-4 mb-2">My Controls</div>
                      {[
                        { name: "My Profile", path: "/profile", icon: CircleUserRound },
                        { name: "My Bookings", path: "/profile/bookings", icon: BookOpen },
                      ].map((item) => (
                        <Link
                          key={item.name}
                          to={item.path}
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center space-x-2 text-lg border-b border-gray-200 py-2 hover:bg-[#FF9933]/10 hover:text-[#FF9933] transition-colors duration-200"
                        >
                          <Button
                            variant="ghost"
                            className="w-full justify-start hover:bg-[#FF9933]/10 hover:text-[#FF9933] gap-4"
                          >
                            <item.icon className="h-5 w-5" />
                            <span className='text-base'>{item.name}</span>
                          </Button>
                        </Link>
                      ))}
                    </>
                  )}
                </>
              }


            </div>

            {!user ? (
              <div className="mt-6 flex flex-col gap-2">
                <Link to="/auth/login" onClick={() => setMenuOpen(false)}>
                  <Button className="w-full bg-[#FF9933] hover:bg-[#a3611f] text-white">Login</Button>
                </Link>
                <Link to="/auth/register" onClick={() => setMenuOpen(false)}>
                  <Button variant="outline" className="w-full">Register</Button>
                </Link>
              </div>
            ) : (
              <div className="mt-6">
                <LogoutConfirmationModal onConfirm={handleLogout}>
                  <Button className="bg-[#FF9933] hover:bg-[#a3611f] text-white absolute bottom-36 right-1/2 transform translate-x-1/2">
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </Button>
                </LogoutConfirmationModal>
              </div>
            )}

            <div className='absolute w-32 text-center bottom-4 left-1/2 transform -translate-x-1/2'>
              <p className="text-xs text-gray-500">© 2024 Veer Raghav. All rights reserved.</p>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </motion.nav>
  );
};

export default Navbar;