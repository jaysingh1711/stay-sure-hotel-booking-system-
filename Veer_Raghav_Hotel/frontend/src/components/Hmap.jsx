import React, { useEffect } from 'react';
import { useSettings } from '@/context/SettingsContext';
import { MapPin, Phone, Mail, Clock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LocationSection() {
  const { hotelInfo, gethotel } = useSettings();

  useEffect(() => {
    gethotel();
  }, []);

  if (!hotelInfo || hotelInfo.length === 0) return null;

  const hotelData = hotelInfo[0];
  const { name, address, contactNumbers, Email } = hotelData;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.section 
      className="max-w-7xl mx-auto px-4 py-16"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
    >
      <motion.h2 
        className="text-3xl font-serif font-bold text-orange-800 text-center mb-12"
        variants={itemVariants}
      >
        Find Us Here
      </motion.h2>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="grid md:grid-cols-2 gap-0">
          {/* Hotel Details Section */}
          <div className="p-8 lg:p-12 bg-gradient-to-br from-orange-50 to-orange-100">
            <motion.div 
              className="max-w-md space-y-8"
              variants={containerVariants}
            >
              {/* Hotel Name */}
              <motion.div variants={itemVariants}>
                <h3 className="text-2xl font-bold text-orange-800 mb-2">{name}</h3>
                <div className="w-20 h-1 bg-orange-500 rounded-full"></div>
              </motion.div>

              {/* Contact Details */}
              <div className="space-y-6">
                {/* Address */}
                <motion.div 
                  className="flex items-start space-x-4"
                  variants={itemVariants}
                >
                  <div className="text-orange-600">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-orange-800 mb-1">Address</h4>
                    <p className="text-orange-700 leading-relaxed">{address}</p>
                  </div>
                </motion.div>

                {/* Phone Numbers */}
                <motion.div 
                  className="flex items-start space-x-4"
                  variants={itemVariants}
                >
                  <div className="text-orange-600">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-orange-800 mb-1">Phone</h4>
                    <div className="space-y-1">
                      {contactNumbers?.map((number, index) => (
                        <p key={index} className="text-orange-700">{number}</p>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Email */}
                <motion.div 
                  className="flex items-start space-x-4"
                  variants={itemVariants}
                >
                  <div className="text-orange-600">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-orange-800 mb-1">Email</h4>
                    <p className="text-orange-700">{!Email ? "contact@example.com" : Email}</p>
                  </div>
                </motion.div>

                {/* Business Hours */}
                <motion.div 
                  className="flex items-start space-x-4"
                  variants={itemVariants}
                >
                  <div className="text-orange-600">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-orange-800 mb-1">Business Hours</h4>
                    <p className="text-orange-700">24/7 Front Desk Service</p>
                  </div>
                </motion.div>
              </div>

              {/* CTA Button */}
              <motion.div variants={itemVariants}>
                <motion.a 
                  href="https://maps.google.com/?q=Uttar Paras math Near kanak bhavan mandir ayodhya 224123"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>Get Directions</span>
                  <motion.div
                    className="ml-2"
                    initial={{ x: 0 }}
                    whileHover={{ x: 5 }}
                  >
                    <ArrowRight size={20} />
                  </motion.div>
                </motion.a>
              </motion.div>
            </motion.div>
          </div>

          {/* Map Section */}
          <motion.div 
            className="h-[600px] w-full"
            variants={itemVariants}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <iframe
              className="w-full h-full"
              frameBorder="0"
              scrolling="no"
              marginHeight="0"
              marginWidth="0"
              src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=Uttar%20Paras%20math%20Near%20kanak%20bhavan%20mandir%20ayodhya%20224123%20uttar%20pradesh+(My%20Business%20Name)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
              title="Hotel Location"
            ></iframe>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}