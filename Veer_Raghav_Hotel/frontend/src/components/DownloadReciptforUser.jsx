import React, { useState, useContext } from 'react';
import { Button } from "./ui/button";
import { FileDown, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useSettings } from '@/context/SettingsContext';

const DownloadReceiptforUser = ({ bookingData }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { hotelData } = useSettings();

  const generatePDF = async () => {
    setIsGenerating(true);
    const receiptContent = document.createElement('div');
    receiptContent.style.width = '210mm';
    receiptContent.style.height = '297mm';
    document.body.appendChild(receiptContent);

    try {
      const ReactDOMServer = await import('react-dom/server');
      receiptContent.innerHTML = ReactDOMServer.renderToString(<ReceiptContent booking={bookingData} hotel={hotelData} />);

      const canvas = await html2canvas(receiptContent, {
        scale: 2,
        useCORS: true,
        logging: false,
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);
      pdf.save(`${hotelData.name}-booking-receipt-${bookingData._id}-${Date.now()}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('An error occurred while generating the PDF. Please try again.');
    } finally {
      document.body.removeChild(receiptContent);
      setIsGenerating(false);
    }
  };

  const ReceiptContent = ({ booking, hotel }) => {
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC'
      });
    };

    const roomRate = (booking.totalPrice - booking.totaltax).toFixed(2);

    return (
      <div className="p-8 bg-white font-sans">
        <div className="flex justify-between items-center mb-8">
          <div>
            <img src={hotel.logo} alt={`${hotel.name} Logo`} className="w-32 h-auto" />
          </div>
          <div className="text-right">
            <h1 className="text-3xl font-bold text-gray-800">{hotel.name}</h1>
            <p className="text-gray-600">{hotel.address}</p>
            <p className="text-gray-600">
              {hotel.contactNumbers.join(' | ')}
            </p>
            <p className="text-gray-600">{hotel.Email}</p>
          </div>
        </div>

        <div className="border-t border-b border-gray-300 py-4 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Booking Receipt</h2>
          <p className="text-gray-600">Booking ID: {booking._id}</p>
          <p className="text-gray-600">Booked on: {formatDate(booking.createdAt)}</p>
          <p className="text-gray-600">Status: <span className="font-semibold">{booking.status}</span></p>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Guest Information</h3>
            <p className="text-gray-600">Name: {booking.user.name}</p>
            <p className="text-gray-600">Email: {booking.user.email}</p>
            <p className="text-gray-600">Phone: {booking.user.phoneno}</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Stay Details</h3>
            <p className="text-gray-600">Check-in: {formatDate(booking.checkInDate)} (After {hotel.checkInTime})</p>
            <p className="text-gray-600">Check-out: {formatDate(booking.checkOutDate)} (Before {hotel.checkOutTime})</p>
            <p className="text-gray-600">Duration: {Math.ceil((new Date(booking.checkOutDate) - new Date(booking.checkInDate)) / (1000 * 60 * 60 * 24))} night(s)</p>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Room Details</h3>
          <p className="text-gray-600">Room Type: {booking.room.name}</p>
          <p className="text-gray-600">Number of Rooms: {booking.noOfRooms}</p>
          <p className="text-gray-600">Guests: {booking.noofguests}</p>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Payment Details</h3>
          <div className="border-t border-gray-300 pt-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Room Rate:</span>
              <span className="text-gray-800">₹{roomRate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Service Tax:</span>
              <span className="text-gray-800">₹{booking.taxes.serviceTax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">VAT:</span>
              <span className="text-gray-800">₹{booking.taxes.vat.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Other Taxes:</span>
              <span className="text-gray-800">₹{booking.taxes.other.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold border-t border-gray-300 mt-2 pt-2">
              <span className="text-gray-800">Total Amount:</span>
              <span className="text-gray-800">₹{booking.totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="text-center text-gray-600 text-sm mt-8">
          <p>Please present this receipt during check-in.</p>
          <p className="font-semibold mt-2">Thank you for choosing {hotel.name}!</p>
          <p className="mt-4">For any queries, please contact our support team.</p>
          <p>{hotel.Email} | {hotel.contactNumbers[0]}</p>
        </div>
      </div>
    );
  };

  return (
    <Button onClick={generatePDF} disabled={isGenerating}>
      {isGenerating ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <FileDown className="mr-2 h-4 w-4" />
      )}
      {isGenerating ? 'Generating PDF...' : 'Download Booking Receipt'}
    </Button>
  );
};

export default DownloadReceiptforUser;

