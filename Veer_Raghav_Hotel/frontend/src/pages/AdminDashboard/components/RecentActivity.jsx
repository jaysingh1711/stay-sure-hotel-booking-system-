import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, User, Clock, LogIn, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAdminContext } from '@/context/AdminContext';
import { useRoom } from '@/context/RoomContext';
import { Link } from 'react-router-dom';

const RecentActivity = () => {
  const { dashboardStats, Guests, fetchDashboardStats, fetchUsers } = useAdminContext();
  const { Rooms, getAllRooms } = useRoom();
  const [showAllGuests, setShowAllGuests] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      await Promise.all([
        fetchUsers(),
        fetchDashboardStats(),
        getAllRooms()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, []);
  

  const formatDate = useCallback((dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }, []);

  // Modified getRoomDetails with null check
  const getRoomDetails = useCallback((roomId) => {
    if (!roomId || !Rooms) return {};
    return Rooms.find(room => room._id === roomId) || {};
  }, [Rooms]);

  // Modified getUserDetails with null check
  const getUserDetails = useCallback((userId) => {
    if (!userId || !Guests) return {};
    return Guests.find(user => user._id === userId) || {};
  }, [Guests]);

  // Ensure bookings is always an array
  const bookings = Array.isArray(dashboardStats?.recentBookings)
    ? dashboardStats.recentBookings
    : [];

  const sortedGuests = React.useMemo(() =>
    Guests?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) || [],
    [Guests]
  );

  const displayedGuests = showAllGuests ? sortedGuests : sortedGuests.slice(0, 5);

  const getStatusStyles = useCallback((status) => {
    return status?.toLowerCase() === 'confirmed'
      ? 'bg-green-100 text-green-800'
      : 'bg-yellow-100 text-yellow-800';
  }, []);

  // Modified BookingCard component
  const BookingCard = React.memo(({ booking }) => {
    if (!booking) return null;

    console.log('bookinggs', booking?.user?._id);
    

    const roomDetails = getRoomDetails(booking.room);
    const userDetails = getUserDetails(booking?.user?._id);

    return (
      <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors space-y-3">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="font-medium text-gray-900">
              {userDetails?.name || 'Unknown User'}
            </p>
            <p className="text-sm text-gray-500">
              {roomDetails?.name || 'Unknown Room'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">
              ₹ {booking.totalPrice?.toLocaleString() || '0'}
            </p>
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusStyles(booking.status)}`}>
              {booking.status || 'Pending'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <LogIn className="h-3 w-3" />
            <span>Check-in: {formatDate(booking.checkInDate)}</span>
          </div>
          <div className="flex items-center gap-1">
            <LogOut className="h-3 w-3" />
            <span>Check-out: {formatDate(booking.checkOutDate)}</span>
          </div>
        </div>
      </div>
    );
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-500" />
            Recent Bookings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {bookings.length === 0 ? (
              <p className="text-center text-gray-500 py-4">No recent bookings</p>
            ) : (
              bookings.map((booking, index) => (
                <BookingCard key={booking._id || index} booking={booking} />
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <User className="h-5 w-5 text-green-500" />
            Recent Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {!displayedGuests.length ? (
              <p className="text-center text-gray-500 py-4">No guests found</p>
            ) : (
              <>
                {displayedGuests.map((guest) => (
                  <div
                    key={guest._id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="space-y-1">
                      <p className="font-medium text-gray-900">{guest?.name}</p>
                      <p className="text-sm text-gray-500">{guest?.email}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="flex items-center justify-end gap-1 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        {formatDate(guest?.createdAt)}
                      </div>
                      <p title="User Phone Number" className="text-xs text-gray-500">
                        {guest?.phoneno || 'No phone'}
                      </p>
                    </div>
                  </div>
                ))}
                {/* {sortedGuests.length > 5 && (
                  <Button
                    variant="outline"
                    className="w-full mt-4"
                    onClick={() => setShowAllGuests(!showAllGuests)}
                  >
                    {showAllGuests ? 'Show Less' : `Show All (${sortedGuests.length})`}
                  </Button>
                )} */}
              </>
            )}
          </div>

          <Link to="/dashboard/users">
            <Button  className='mt-5 w-full' variant="outline">View More</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default React.memo(RecentActivity);