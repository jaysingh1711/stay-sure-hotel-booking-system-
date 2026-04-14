import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";
import { useBooking } from '@/context/BookingContext';
import { useAdminContext } from '@/context/AdminContext';
import { useRoom } from '@/context/RoomContext';
import BookingDetailsDialog from '../components/BookingDetailsDialog';
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from '@/hooks/use-toast';
import { Trash2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

const BookingsContent = () => {
  const { getAllBookings, deleteBooking, UpdateBookingStatus } = useBooking();
  const { fetchUsers, Guests } = useAdminContext();
  const { Rooms, getAllRooms } = useRoom();
  const { toast } = useToast();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');
  // const [selectedBooking, setSelectedBooking] = useState(null);
  // const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedBookings, setSelectedBookings] = useState(new Set());
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [isMultiDeleteDialogOpen, setIsMultiDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const [bookingsResponse, usersResponse, roomsResponse] = await Promise.all([
          getAllBookings(),
          fetchUsers(),
          getAllRooms()
        ]);

        const processedBookings = processBookingData(bookingsResponse, usersResponse, roomsResponse);
        // Sort by newest first by default
        const sortedBookings = sortBookings(processedBookings, 'newest');
        setBookings(sortedBookings);
        setTotalPages(Math.ceil(sortedBookings.length / itemsPerPage));
      } catch (error) {
        console.error('Failed to fetch initial data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [ ]);

  // Update total pages when items per page changes
  const updateTotalPages = (totalItems) => {
    setTotalPages(Math.ceil(totalItems / itemsPerPage));
    // Reset to first page when changing items per page to avoid empty pages
    setCurrentPage(1);
  };

  useEffect(() => {
    const filteredBookings = getFilteredAndSortedBookings();
    updateTotalPages(filteredBookings.length);
  }, [itemsPerPage, searchTerm, statusFilter, sortOrder]);

  const formatDate = (date) => {
    try {
      if (!date) return "Invalid Date";
      const parsedDate = new Date(date);
      return isNaN(parsedDate.getTime()) ? "Invalid Date" : format(parsedDate, 'dd/MM/yyyy HH:mm');
    } catch (error) {
      return "Invalid Date";
    }
  };

  const processBookingData = (bookingsData, users, rooms) => {
    if (!Array.isArray(bookingsData)) return [];

    return bookingsData.map(booking => {
      // Check if dates are valid
      const createdAtDate = booking.createdAt ? new Date(booking.createdAt) : null;
      const checkInDate = booking.checkInDate ? new Date(booking.checkInDate) : null;
      const checkOutDate = booking.checkOutDate ? new Date(booking.checkOutDate) : null;

      return {
        ...booking,
        id: booking._id || booking.id || 'Invalid ID',
        guestName: users.find(u => u._id === booking.user?._id)?.name || 'Unknown',
        roomNumber: rooms.find(r => r._id === booking.room?._id)?.name || 'Unknown',
        roomImage: rooms.find(r => r._id === booking.room?._id)?.images?.[0] || null,
        totalPrice: booking.totalPrice || 0,
        status: booking.status || 'Pending',
        // Store both raw and formatted dates
        createdAt: createdAtDate ? createdAtDate.toISOString() : null,
        createdAtFormatted: formatDate(booking.createdAt),
        checkInDateFormatted: formatDate(booking.checkInDate),
        checkOutDateFormatted: formatDate(booking.checkOutDate),
      };
    });
  };


  const sortBookings = (bookingsToSort, order) => {
    return [...bookingsToSort].sort((a, b) => {
      // Handle cases where createdAt is missing or invalid
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;

      // Put invalid dates at the end regardless of sort order
      if (dateA === 0 && dateB === 0) return 0;
      if (dateA === 0) return 1;
      if (dateB === 0) return -1;

      return order === 'newest' ? dateB - dateA : dateA - dateB;
    });
  };

  const getFilteredAndSortedBookings = () => {
    let filtered = bookings.filter(booking => {
      const matchesSearch =
        booking.guestName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.roomNumber?.toString().includes(searchTerm) ||
        booking.id?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' ||
        booking.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });

    return sortBookings(filtered, sortOrder);
  };

  const getPaginatedBookings = () => {
    const filtered = getFilteredAndSortedBookings();
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filtered.slice(startIndex, startIndex + itemsPerPage);
  };

  // Rest of the handlers...
  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      setLoading(true); // Show loading state while updating

      // Call the update status function
      await UpdateBookingStatus(bookingId, newStatus);

      // Fetch fresh data after successful update
      const updatedBookingsData = await getAllBookings();
      const processedBookings = processBookingData(updatedBookingsData, Guests, Rooms);
      const sortedBookings = sortBookings(processedBookings, sortOrder);

      // Update the state with new data
      setBookings(sortedBookings);

      toast({
        title: 'Success',
        description: 'Booking status updated successfully',
        variant: 'success',
        className: 'bg-green-200 border-green-400 text-black text-lg',
      })

    } catch (error) {
      console.error('Failed to update booking status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update booking status',
        variant: 'error',
        className: 'bg-red-200 border-red-400 text-black text-lg',
      })
    } finally {
      setLoading(false);
    }
  };

  // const handleDeleteBooking = async () => {
  //   if (selectedBooking) {
  //     try {
  //       await deleteBooking(selectedBooking.id);
  //       const updatedBookings = await getAllBookings();
  //       const processedBookings = processBookingData(updatedBookings, Guests, Rooms);
  //       setBookings(sortBookings(processedBookings, sortOrder));
  //       setIsDeleteDialogOpen(false);
  //     } catch (error) {
  //       console.error('Failed to delete booking:', error);
  //     }
  //   }
  // };

  const toggleDeleteMode = () => {
    setIsDeleteMode(!isDeleteMode);
    setSelectedBookings(new Set());
  };

  const toggleBookingSelection = (bookingId) => {
    const newSelected = new Set(selectedBookings);
    if (newSelected.has(bookingId)) {
      newSelected.delete(bookingId);
    } else {
      newSelected.add(bookingId);
    }
    setSelectedBookings(newSelected);
  };

  const handleMultiDelete = async () => {
    try {
      setLoading(true);
      // Delete all selected bookings
      await Promise.all([...selectedBookings].map(id => deleteBooking(id)));

      // Refresh the bookings list
      const updatedBookings = await getAllBookings();
      const processedBookings = processBookingData(updatedBookings, Guests, Rooms);
      setBookings(sortBookings(processedBookings, sortOrder));

      // Reset selection state
      setSelectedBookings(new Set());
      setIsDeleteMode(false);
      setIsMultiDeleteDialogOpen(false);

      toast({
        title: 'Success',
        description: `Successfully deleted ${selectedBookings.size} bookings`,
        variant: 'success',
        className: 'bg-green-200 border-green-400 text-black text-lg',
      });
    } catch (error) {
      console.error('Failed to delete bookings:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete bookings',
        variant: 'error',
        className: 'bg-red-200 border-red-400 text-black text-lg',
      });
    } finally {
      setLoading(false);
    }
  };





  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-8 w-[250px]" />
          <Skeleton className="h-8 w-[100px]" />
        </div>
        <div className="border rounded-lg">
          <div className="divide-y">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="p-4">
                <div className="flex justify-between">
                  <Skeleton className="h-6 w-[250px]" />
                  <Skeleton className="h-6 w-[100px]" />
                </div>
                <div className="mt-2 flex justify-between">
                  <Skeleton className="h-4 w-[150px]" />
                  <Skeleton className="h-4 w-[100px]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg p-6 space-y-6 text-black">
      <h2 className="text-2xl font-semibold mb-4">Bookings Management</h2>

      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Search by ID, guest name, or room number"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
        />

        <Button
          variant={isDeleteMode ? "destructive" : "outline"}
          onClick={toggleDeleteMode}
          className="w-full sm:w-auto"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          {isDeleteMode ? "Cancel Delete" : "Delete Bookings"}
        </Button>

        {isDeleteMode && selectedBookings.size > 0 && (
          <Button
            variant="destructive"
            onClick={() => setIsMultiDeleteDialogOpen(true)}
            className="w-full sm:w-auto"
          >
            Delete Selected ({selectedBookings.size})
          </Button>
        )}

        {!isDeleteMode && (
          <>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Sort by date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => setItemsPerPage(Number(value))}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Items per page" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 per page</SelectItem>
                <SelectItem value="10">10 per page</SelectItem>
                <SelectItem value="20">20 per page</SelectItem>
                <SelectItem value="50">50 per page</SelectItem>
                <SelectItem value="100">100 per page</SelectItem>
              </SelectContent>
            </Select>
          </>
        )}
      </div>

      <div className="text-sm text-gray-500 mb-4">
        Showing {Math.min(itemsPerPage, getPaginatedBookings().length)} of {getFilteredAndSortedBookings().length} bookings
      </div>

      {/* Multi-Delete Confirmation Dialog */}
      <Dialog open={isMultiDeleteDialogOpen} onOpenChange={setIsMultiDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Multiple Bookings</DialogTitle>
            <DialogDescription>
              You are about to delete {selectedBookings.size} booking{selectedBookings.size !== 1 ? 's' : ''}.
              This action cannot be undone and will permanently remove these bookings from our database.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsMultiDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleMultiDelete}>
              Delete {selectedBookings.size} Booking{selectedBookings.size !== 1 ? 's' : ''}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Table>
        <TableHeader>
          <TableRow>
            {isDeleteMode && <TableHead className="w-12">Select</TableHead>}
            <TableHead>Booking ID</TableHead>
            <TableHead>Guest Name</TableHead>
            <TableHead>Room</TableHead>
            <TableHead>Check-in Date</TableHead>
            <TableHead>Check-out Date</TableHead>
            <TableHead>Total Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {getPaginatedBookings().map((booking) => (
            <TableRow
              key={booking.id}
              className={!booking.createdAt ? "bg-red-50" : ""}
            >
              {isDeleteMode && (
                <TableCell>
                  <Checkbox
                    checked={selectedBookings.has(booking.id)}
                    onCheckedChange={() => toggleBookingSelection(booking.id)}
                  />
                </TableCell>
              )}
              <TableCell>{booking.id}</TableCell>
              <TableCell>{booking.guestName}</TableCell>
              <TableCell>Room {booking.roomNumber}</TableCell>
              <TableCell>{booking.checkInDateFormatted}</TableCell>
              <TableCell>{booking.checkOutDateFormatted}</TableCell>
              <TableCell>₹ {booking.totalPrice.toFixed(2)}</TableCell>
              <TableCell>
                <Select
                  value={booking.status}
                  onValueChange={(value) => handleStatusChange(booking.id, value)}
                  disabled={loading} // Disable during loading
                >
                  <SelectTrigger className={`w-[130px] ${!booking.createdAt ? "border-red-300" : ""}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Confirmed">Confirmed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {booking.createdAtFormatted}
                  {!booking.createdAt && (
                    <span className="text-xs text-red-500 bg-red-100 px-2 py-1 rounded">
                      Invalid
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex justify-start space-x-2">
                  {!isDeleteMode && <BookingDetailsDialog booking={booking} />}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            />
          </PaginationItem>
          {[...Array(totalPages)].map((_, index) => {
            // Show first page, last page, and pages around current page
            if (
              index === 0 ||
              index === totalPages - 1 ||
              (index >= currentPage - 2 && index <= currentPage + 2)
            ) {
              return (
                <PaginationItem key={index}>
                  <PaginationLink
                    onClick={() => setCurrentPage(index + 1)}
                    isActive={currentPage === index + 1}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              );
            } else if (
              index === currentPage - 3 ||
              index === currentPage + 3
            ) {
              return (
                <PaginationItem key={index}>
                  <span className="px-4">...</span>
                </PaginationItem>
              );
            }
            return null;
          })}
          <PaginationItem>
            <PaginationNext
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default BookingsContent;