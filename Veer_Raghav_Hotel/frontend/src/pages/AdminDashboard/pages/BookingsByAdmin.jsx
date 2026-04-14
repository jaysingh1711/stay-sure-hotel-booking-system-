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
import { useToast } from '@/hooks/use-toast';
import { Trash2, Plus } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const initialStaticBookings = [
  {
    id: "ADM001",
    guestName: "John Smith",
    roomNumber: "101",
    checkInDate: "2025-01-15T14:00:00",
    checkOutDate: "2025-01-20T11:00:00",
    totalPrice: 15000,
    status: "Confirmed",
    createdAt: "2025-01-08T10:30:00",
    adminName: "Admin User",
    paymentMethod: "Cash",
    specialRequests: "Extra bed required"
  },
  {
    id: "ADM002",
    guestName: "Sarah Johnson",
    roomNumber: "205",
    checkInDate: "2025-01-20T15:00:00",
    checkOutDate: "2025-01-25T10:00:00",
    totalPrice: 18500,
    status: "Pending",
    createdAt: "2025-01-08T11:45:00",
    adminName: "Admin User",
    paymentMethod: "Card",
    specialRequests: "Late check-in"
  }
];

const BookingsByAdmin = () => {
  const { toast } = useToast();
  const [bookings, setBookings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedBookings, setSelectedBookings] = useState(new Set());
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [isMultiDeleteDialogOpen, setIsMultiDeleteDialogOpen] = useState(false);
  const [isAddBookingOpen, setIsAddBookingOpen] = useState(false);
  const [newBooking, setNewBooking] = useState({
    guestName: '',
    roomNumber: '',
    checkInDate: '',
    checkOutDate: '',
    totalPrice: '',
    status: 'Pending',
    paymentMethod: 'Cash',
    specialRequests: '',
    adminName: 'Admin User' // This could be dynamic based on logged-in admin
  });

  // Load bookings from localStorage on initial render
  useEffect(() => {
    const savedBookings = localStorage.getItem('adminBookings');
    if (savedBookings) {
      setBookings(JSON.parse(savedBookings));
    } else {
      setBookings(initialStaticBookings);
      localStorage.setItem('adminBookings', JSON.stringify(initialStaticBookings));
    }
  }, []);

  // Save bookings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('adminBookings', JSON.stringify(bookings));
  }, [bookings]);

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
  };

  const generateBookingId = () => {
    const lastBooking = bookings[0];
    if (!lastBooking) return 'ADM001';
    
    const lastNumber = parseInt(lastBooking.id.slice(3));
    return `ADM${String(lastNumber + 1).padStart(3, '0')}`;
  };

  const handleAddBooking = () => {
    const bookingToAdd = {
      ...newBooking,
      id: generateBookingId(),
      createdAt: new Date().toISOString(),
      totalPrice: parseFloat(newBooking.totalPrice)
    };

    setBookings(prev => [bookingToAdd, ...prev]);
    setIsAddBookingOpen(false);
    setNewBooking({
      guestName: '',
      roomNumber: '',
      checkInDate: '',
      checkOutDate: '',
      totalPrice: '',
      status: 'Pending',
      paymentMethod: 'Cash',
      specialRequests: '',
      adminName: 'Admin User'
    });

    toast({
      title: 'Success',
      description: 'New booking added successfully',
      variant: 'success',
      className: 'bg-green-200 border-green-400 text-black text-lg',
    });
  };

  const getFilteredAndSortedBookings = () => {
    let filtered = bookings.filter(booking => {
      const matchesSearch =
        booking.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.roomNumber.toString().includes(searchTerm) ||
        booking.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' ||
        booking.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });

    return filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
  };

  const getPaginatedBookings = () => {
    const filtered = getFilteredAndSortedBookings();
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filtered.slice(startIndex, startIndex + itemsPerPage);
  };

  const totalPages = Math.ceil(getFilteredAndSortedBookings().length / itemsPerPage);

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

  const handleMultiDelete = () => {
    const updatedBookings = bookings.filter(booking => !selectedBookings.has(booking.id));
    setBookings(updatedBookings);
    setSelectedBookings(new Set());
    setIsDeleteMode(false);
    setIsMultiDeleteDialogOpen(false);
    
    toast({
      title: 'Success',
      description: `Successfully deleted ${selectedBookings.size} bookings`,
      variant: 'success',
      className: 'bg-green-200 border-green-400 text-black text-lg',
    });
  };

  const handleStatusChange = (bookingId, newStatus) => {
    const updatedBookings = bookings.map(booking =>
      booking.id === bookingId ? { ...booking, status: newStatus } : booking
    );
    setBookings(updatedBookings);
    
    toast({
      title: 'Success',
      description: 'Booking status updated successfully',
      variant: 'success',
      className: 'bg-green-200 border-green-400 text-black text-lg',
    });
  };

  return (
    <div className="rounded-lg p-6 space-y-6 text-black">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Admin Bookings Management</h2>
        <Button onClick={() => setIsAddBookingOpen(true)} className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" />
          Add New Booking
        </Button>
      </div>

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
              </SelectContent>
            </Select>
          </>
        )}
      </div>

      {/* Add New Booking Dialog */}
      <Dialog open={isAddBookingOpen} onOpenChange={setIsAddBookingOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Booking</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="guestName" className="text-right">Guest Name</Label>
              <Input
                id="guestName"
                className="col-span-3"
                value={newBooking.guestName}
                onChange={(e) => setNewBooking({...newBooking, guestName: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="roomNumber" className="text-right">Room Number</Label>
              <Input
                id="roomNumber"
                className="col-span-3"
                value={newBooking.roomNumber}
                onChange={(e) => setNewBooking({...newBooking, roomNumber: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="checkIn" className="text-right">Check In</Label>
              <Input
                id="checkIn"
                type="datetime-local"
                className="col-span-3"
                value={newBooking.checkInDate}
                onChange={(e) => setNewBooking({...newBooking, checkInDate: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="checkOut" className="text-right">Check Out</Label>
              <Input
                id="checkOut"
                type="datetime-local"
                className="col-span-3"
                value={newBooking.checkOutDate}
                onChange={(e) => setNewBooking({...newBooking, checkOutDate: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">Total Price</Label>
              <Input
                id="price"
                type="number"
                className="col-span-3"
                value={newBooking.totalPrice}
                onChange={(e) => setNewBooking({...newBooking, totalPrice: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="payment" className="text-right">Payment Method</Label>
              <Select
                value={newBooking.paymentMethod}
                onValueChange={(value) => setNewBooking({...newBooking, paymentMethod: value})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Card">Card</SelectItem>
                  <SelectItem value="UPI">UPI</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="requests" className="text-right">Special Requests</Label>
              <Input
                id="requests"
                className="col-span-3"
                value={newBooking.specialRequests}
                onChange={(e) => setNewBooking({...newBooking, specialRequests: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddBookingOpen(false)}>Cancel</Button>
            <Button onClick={handleAddBooking}>Add Booking</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isMultiDeleteDialogOpen} onOpenChange={setIsMultiDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
          <DialogTitle>Delete Multiple Bookings</DialogTitle>
            <DialogDescription>
              You are about to delete {selectedBookings.size} booking{selectedBookings.size !== 1 ? 's' : ''}.
              This action cannot be undone.
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

      <div className="text-sm text-gray-500 mb-4">
        Showing {Math.min(itemsPerPage, getPaginatedBookings().length)} of {getFilteredAndSortedBookings().length} bookings
      </div>

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
            <TableHead>Admin</TableHead>
            <TableHead>Payment Method</TableHead>
            <TableHead>Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {getPaginatedBookings().map((booking) => (
            <TableRow key={booking.id}>
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
              <TableCell>{formatDate(booking.checkInDate)}</TableCell>
              <TableCell>{formatDate(booking.checkOutDate)}</TableCell>
              <TableCell>₹ {booking.totalPrice.toFixed(2)}</TableCell>
              <TableCell>
                <Select
                  value={booking.status}
                  onValueChange={(value) => handleStatusChange(booking.id, value)}
                >
                  <SelectTrigger className="w-[130px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Confirmed">Confirmed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>{booking.adminName}</TableCell>
              <TableCell>{booking.paymentMethod}</TableCell>
              <TableCell>{formatDate(booking.createdAt)}</TableCell>
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
          {[...Array(totalPages)].map((_, index) => (
            <PaginationItem key={index}>
              <PaginationLink
                onClick={() => setCurrentPage(index + 1)}
                isActive={currentPage === index + 1}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
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

export default BookingsByAdmin;