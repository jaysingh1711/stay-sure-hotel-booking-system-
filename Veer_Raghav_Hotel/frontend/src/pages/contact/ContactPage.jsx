import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Clock, MapPin, Send } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';

function ContactPage() {
  const { hotelInfo, gethotel } = useSettings();
  const pageTitle = 'CONTACT US'.split('');

  useEffect(() => {
    gethotel();
  }, []);

  // Fallback data in case hotel info is not available
  const defaultData = {
    name: "Luxury Hotel",
    address: "Near Ram Mandir, Ayodhya",
    contactNumbers: ["+91 123 456 7890", "+91 098 765 4321"],
    Email: "contact@hotel.com",
    supportEmail: "support@hotel.com",
    checkInTime: "12:00 PM",
    checkOutTime: "11:00 AM",
    description: "Experience luxury and spirituality in the heart of Ayodhya",
  };

  // Use hotel data if available, otherwise use fallback data
  const hotelData = hotelInfo?.[0] || defaultData;
  const {
    name,
    address,
    contactNumbers = defaultData.contactNumbers,
    Email = defaultData.Email,
    supportEmail = defaultData.supportEmail,
    description = defaultData.description
  } = hotelData;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[500px]">
        <img
          src="/image/hotel4.jpeg"
          alt="Contact Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/80">
          <div className="container mx-auto h-full flex flex-col items-center justify-center px-4">
            <div className="space-y-6 text-center">
              <div className="flex flex-wrap justify-center gap-2">
                {pageTitle.map((letter, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-4xl md:text-6xl font-serif font-bold text-white"
                    whileHover={{ scale: 1.1, color: '#FF9933' }}
                  >
                    {letter}
                  </motion.span>
                ))}
              </div>
              <motion.p 
                className="text-white/90 text-lg md:text-xl max-w-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {description}
              </motion.p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Contact Cards */}
      <div className="container mx-auto px-4 -mt-20 relative z-10">
        <div className="grid md:grid-cols-3 gap-6">
          <QuickContactCard 
            icon={Phone}
            title="Call Us"
            content={contactNumbers[0]}
            subContent="24/7 Available"
          />
          <QuickContactCard 
            icon={Mail}
            title="Email Us"
            content={Email}
            subContent="Quick Response"
          />
          <QuickContactCard 
            icon={MapPin}
            title="Visit Us"
            content={address}
            subContent={name}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <h2 className="text-3xl font-serif font-bold text-orange-800 mb-6">Send Us a Message</h2>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid md:grid-cols-2 gap-6">
                <InputField 
                  type="text"
                  placeholder="Your Name"
                  icon={<span className="text-orange-500">01</span>}
                />
                <InputField 
                  type="Email"
                  placeholder="Your Email"
                  icon={<span className="text-orange-500">02</span>}
                />
              </div>
              <InputField 
                type="text"
                placeholder="Subject"
                icon={<span className="text-orange-500">03</span>}
              />
              <div className="relative">
                <span className="absolute top-3 left-4 text-orange-500">04</span>
                <textarea
                  rows={4}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  placeholder="Your Message"
                ></textarea>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white py-4 rounded-lg font-semibold flex items-center justify-center gap-2 group"
              >
                Send Message
                <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </form>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-3xl font-serif font-bold text-orange-800 mb-4">Welcome to {name}</h2>
              <p className="text-gray-600 leading-relaxed">
                We're here to help and answer any question you might have. We look forward to hearing from you.
              </p>
            </div>

            <div className="grid gap-6">
              <InfoCard
                icon={Clock}
                title="Reception Hours"
                content="24/7 Available"
                subcontent="Always at your service"
              />
              {contactNumbers.map((number, index) => (
                <InfoCard
                  key={index}
                  icon={Phone}
                  title="Phone Number"
                  content={number}
                />
              ))}
              <InfoCard
                icon={Mail}
                title="Email Address"
                content={Email}
              />
              <InfoCard
                icon={MapPin}
                title="Our Location"
                content={name}
                subcontent={address}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

const QuickContactCard = ({ icon: Icon, title, content, subContent }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="bg-white rounded-xl shadow-xl p-6 hover:shadow-2xl transition-shadow"
  >
    <div className="flex items-start gap-4">
      <div className="p-3 bg-orange-50 rounded-lg">
        <Icon className="w-6 h-6 text-orange-600" />
      </div>
      <div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <p className="text-orange-600 font-medium">{content}</p>
        <p className="text-sm text-gray-500">{subContent}</p>
      </div>
    </div>
  </motion.div>
);

const InputField = ({ type, placeholder, icon }) => (
  <div className="relative">
    <div className="absolute top-1/2 -translate-y-1/2 left-4">
      {icon}
    </div>
    <input
      type={type}
      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
      placeholder={placeholder}
    />
  </div>
);

const InfoCard = ({ icon: Icon, title, content, subcontent }) => (
  <motion.div
    whileHover={{ x: 10 }}
    className="flex items-start gap-4 p-4 rounded-lg hover:bg-orange-50 transition-colors"
  >
    <div className="p-2 bg-orange-100 rounded-lg">
      <Icon className="w-5 h-5 text-orange-600" />
    </div>
    <div>
      <h3 className="font-medium text-gray-900">{title}</h3>
      <p className="text-orange-600">{content}</p>
      {subcontent && <p className="text-sm text-gray-500">{subcontent}</p>}
    </div>
  </motion.div>
);

export default ContactPage;