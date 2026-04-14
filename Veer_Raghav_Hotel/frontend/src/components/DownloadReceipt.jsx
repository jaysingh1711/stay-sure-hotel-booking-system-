import React, { useState } from 'react';
import { Button } from "./ui/button";
import { FileDown, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const ReceiptContent = ({ bookingData }) => {

  console.log(bookingData);
  
  const roomRate = (bookingData.totalPrice / 1.18).toFixed(2);
  const taxesAndFees = (bookingData.totalPrice - bookingData.totalPrice / 1.18).toFixed(2);

  return (
    <div className="bg-white p-8 max-w-2xl mx-auto font-sans">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Booking Receipt</h1>
        <p className="text-gray-600">Booking ID: {bookingData.booking._id}</p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Room Details</h2>
        <p><span className="font-medium">Room:</span> {bookingData.roomName}</p>
        {/* room number pending */}
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Stay Information</h2>
        <p><span className="font-medium">Check-in:</span> {new Date(bookingData.checkInDate).toLocaleDateString()}</p>
        <p><span className="font-medium">Check-out:</span> {new Date(bookingData.checkOutDate).toLocaleDateString()}</p>
        <p><span className="font-medium">Number of Guests:</span> {bookingData.guestCount}</p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Payment Details</h2>
        <p><span className="font-medium">Room Rate:</span> ₹{roomRate}</p>
        <p><span className="font-medium">Taxes & Fees:</span> ₹{taxesAndFees}</p>
        <p className="text-lg mt-4"><span className="font-medium">Total Amount Paid:</span> ₹{bookingData.totalPrice.toFixed(2)}</p>
      </div>

      <div className="mt-12 text-center text-gray-600 text-sm">
        <p>Please present this receipt during check-in</p>
        <p className="mt-2">Thank you for choosing our hotel!</p>
      </div>
    </div>
  );
};

const DownloadReceipt = ({ bookingData }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async () => {
    setIsGenerating(true);
    const receiptContent = document.createElement('div');
    receiptContent.style.width = '210mm';
    receiptContent.style.height = '297mm';
    document.body.appendChild(receiptContent);

    try {
      const ReactDOMServer = await import('react-dom/server');
      receiptContent.innerHTML = ReactDOMServer.renderToString(<ReceiptContent bookingData={bookingData} />);

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
      pdf.save(`booking-receipt-${bookingData.booking._id}-${Date.now()}-${bookingData.roomName}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('An error occurred while generating the PDF. Please try again.');
    } finally {
      document.body.removeChild(receiptContent);
      setIsGenerating(false);
    }
  };

  return (
    <Button 
      onClick={generatePDF}
      className="w-full"
      disabled={isGenerating}
    >
      {isGenerating ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <FileDown className="mr-2 h-4 w-4" />
      )}
      {isGenerating ? 'Generating PDF...' : 'Download Booking Receipt'}
    </Button>
  );
};

export default DownloadReceipt;

