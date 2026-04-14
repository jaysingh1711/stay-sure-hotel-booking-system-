import React, { useState, useEffect } from 'react';

const FloatingWhatsApp = () => {
    const [showTooltip, setShowTooltip] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowTooltip(false);
        }, 3000); // 10 seconds

        return () => clearTimeout(timer);
    }, []);

    const handleWhatsAppClick = () => {
        const phoneNumber = '7376717607';
        const whatsappUrl = `https://wa.me/${phoneNumber}`;
        window.open(whatsappUrl, '_blank');
    };

    return (
        <div className="fixed bottom-6 right-6 flex items-center">
            {showTooltip && (
                <div className="mr-4 bg-white text-gray-800 px-4 py-2 rounded-lg shadow-lg border border-gray-300 relative">
                    Click here to chat with us!
                    <div className="absolute right-[-8px] top-1/2 transform -translate-y-1/2">
                        <div className="border-8 border-transparent border-l-white"></div>
                    </div>
                </div>
            )}
            <button
                onClick={handleWhatsAppClick}
                className="bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg transition-transform hover:scale-110 z-50 flex items-center justify-center"
                aria-label="Chat on WhatsApp"
            >
                <img
                    src="/image/whatsapp.png"
                    className="w-16 h-16"
                    alt="WhatsApp Icon"
                />
            </button>
        </div>
    );
};

export default FloatingWhatsApp;