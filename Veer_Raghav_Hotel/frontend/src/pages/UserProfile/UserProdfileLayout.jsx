import React, { useEffect, useState } from "react";
import { useLocation, NavLink, Outlet, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Camera, User, Calendar } from "lucide-react";
import { FcBusinessman } from "react-icons/fc";
import { cn } from "@/lib/utils";

const UserProfileLayout = () => {
  const { user, loading, fetchUserProfile } = useAuth();
  const location = useLocation();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const navigationItems = [
    {
      title: "Profile",
      icon: User,
      path: "/profile"
    },
    {
      title: "My Bookings",
      icon: Calendar,
      path: "/profile/bookings"
    }
  ];

  const isLinkActive = (path) => {
    if (path === "/profile") {
      return location.pathname === "/profile";
    }
    return location.pathname === path;
  };

  useEffect(() => {
    const initializeProfile = async () => {
      await fetchUserProfile();
      setIsInitialLoad(false);
    };

    initializeProfile();
  }, []);

  if (isInitialLoad || loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin w-6 h-6 border-4 border-orange-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isInitialLoad && user === null) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <h1 className="text-xl font-semibold text-gray-900">You are not logged in, please login</h1>
        <Link
          to="/auth/login"
          className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
        >
          Login
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white border-t border-gray-200">
      {/* Mobile Navigation Header */}
      <div className="lg:hidden bg-white border-b sticky top-0 z-50 px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-bold text-gray-900">My Account</h1>
        </div>
        <div className="flex space-x-2">
          {navigationItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex-1 flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium transition-all",
                  isLinkActive(item.path) ? "bg-orange-100 text-orange-600" : "text-gray-500"
                )
              }
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.title}
            </NavLink>
          ))}
        </div>
      </div>

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex lg:flex-col w-72 h-screen bg-white border-r border-gray-200 sticky top-0">
          <div className="flex-shrink-0 flex items-center h-16 px-6 border-b">
            <h1 className="text-xl font-bold text-gray-900">My Account</h1>
          </div>
          <div className="w-full">
            <div className="space-y-4 py-4">
              <div className="px-3 py-2">
                <div className="space-y-1">
                  {navigationItems.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={
                        cn(
                          "flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:bg-orange-100 hover:text-orange-600",
                          isLinkActive(item.path) ? "bg-orange-100 text-orange-600" : "text-gray-500"
                        )
                      }
                    >
                      <item.icon className="mr-3 h-4 w-4" />
                      {item.title}
                    </NavLink>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1">
          <div className="px-4 sm:px-6 lg:px-8 py-8">
            <div className="relative mb-8 bg-gradient-to-r from-orange-600 to-orange-400 rounded-xl p-4 sm:p-8 shadow-lg">
              <div className="flex flex-col sm:flex-row items-center sm:space-x-6 space-y-4 sm:space-y-0">
                <div className="relative">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-full p-1">
                    <FcBusinessman className="w-full h-full rounded-full" />
                  </div>
                  <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full text-orange-600 hover:bg-gray-100 shadow-md transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-center sm:text-left">
                  <h1 className="text-2xl sm:text-3xl font-bold capitalize text-white mb-1">{user?.name}</h1>
                  <p className="text-orange-100">
                    Member since{" "}
                    {new Date(user?.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <div className="text-sm">
                    {location.pathname === "/profile" ? (
                      <Link className="text-orange-100 underline italic hover:no-underline" to="/profile/bookings">
                        Go to My Bookings
                      </Link>
                    ) : (
                      <Link className="text-orange-100 underline italic hover:no-underline" to="/profile">
                        Go to My Profile
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserProfileLayout;