import { useToast } from "@/hooks/use-toast";

// hotelValidation.js
const validateHotelData = (formData) => {
    const errors = {};

    const {toast } = useToast();
    
    // Required field validation
    if (!formData.hotelName?.trim()) {
      errors.hotelName = "Please enter a name for your hotel.";
      toast({
        title: "Validation Error",
        description: "Please enter a name for your hotel.",
        variant: "destructive",
      })
    }
    
    if (!formData.address?.trim()) {
    errors.address = "Please enter an address for your hotel.";
      toast({
        title: "Validation Error",
        description: "Please enter an address for your hotel.",
        variant: "destructive",
      })
    }
    
    if (!formData.contactPhones?.length || !formData.contactPhones.some(phone => phone.trim())) {
      errors.contactPhones = "Please enter at least one contact phone number.";
      toast({
        title: "Validation Error",
        description: "Please enter at least one contact phone number.",
        variant: "destructive",
      })
    }
    
    if (!formData.checkInTime?.trim()) {
      errors.checkInTime = "Please enter a check-in time for your hotel.";
      toast({
        title: "Validation Error",
        description: "Please enter a check-in time for your hotel.",
        variant: "destructive",
      })
    }
    
    if (!formData.checkOutTime?.trim()) {
      errors.checkOutTime = "Please enter a check-out time for your hotel.";
      toast({
        title: "Validation Error",
        description: "Please enter a check-out time for your hotel.",
        variant: "destructive",
      })
    }
    
    // Format validation
    if (formData.contactPhones?.some(phone => !/^\+?[\d\s-]{8,}$/.test(phone.trim()))) {
      errors.contactPhones = "Please enter valid phone numbers.";
      toast({
        title: "Validation Error",
        description: "Please enter valid phone numbers.",
        variant: "destructive",
      })
    }
    
    // Time format validation
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (formData.checkInTime && !timeRegex.test(formData.checkInTime)) {
      errors.checkInTime = 'Invalid check-in time format';
      toast({
        title: "Validation Error",
        description: "Please enter a valid check-in time format.",
        variant: "destructive",
      })
    }
    if (formData.checkOutTime && !timeRegex.test(formData.checkOutTime)) {
      errors.checkOutTime = 'Invalid check-out time format';
      toast({
        title: "Validation Error",
        description: "Please enter a valid check-out time format.",
        variant: "destructive",
      })
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };
  
  // Mapper to transform frontend data to match backend schema
  const mapFormDataToSchema = (formData) => {
    return {
      name: formData.hotelName,
      address: formData.address,
      contactNumbers: formData.contactPhones.filter(phone => phone.trim()),
      checkInTime: formData.checkInTime,
      checkOutTime: formData.checkOutTime,
      logo: formData.logo
    };
  };
  
  export { validateHotelData, mapFormDataToSchema };