import { createContext, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/utils/api";
import { useToast } from "@/hooks/use-toast";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [ isAuthenticated, setIsAuthenticated ] = useState(false);
    const { toast } = useToast();


    const fetchUserProfile = async () => {
        try {
            const response = await api.get('/profile');
            if (response.data.success) {
                setUser(response.data.user);
            }
        } catch (error) {
            // console.error('Error fetching user profile:', error);
            // logout();
        }
    };


    useEffect(() => {
        fetchUserProfile();
        setLoading(false);
    }, [isAuthenticated]);


    const login = async (email, password) => {
        try {
            const response = await api.post('/login', { email, password });
            setIsAuthenticated(true);
            if (response.data.success) {
                await fetchUserProfile();

                const userRole = response.data.user.role;

                // Perform redirection logic based on role
                if (userRole === 'admin') {
                    window.location.href = '/dashboard'; // Redirect to admin dashboard
                } else {
                    window.location.href = '/'; // Redirect to user dashboard
                }

                return {
                    success: true,
                    message: response.data.message
                };
            }
            return {
                success: false,
                message: response.data.message || 'Login failed.'
            };
        } catch (error) {
            console.error('Error logging in:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'An error occurred during login.'
            };
        }
    };

    const register = async (userData) => {
        try {
            const registrationData = {
                name: userData.name,
                email: userData.email,
                password: userData.password,
                phoneno: userData.phoneno,
                gender: userData.gender || '',
                age: userData.age || '',
                role: userData.role || 'user'
            };
    
            const response = await api.post('/register', registrationData);
    
            if (response.data.success) {
                toast({
                    title: "Registration successful",
                    description: "Please login to continue.",
                    variant: "success",
                    className: "bg-green-200 border-green-400 text-black text-lg",
                    duration: 3000
                });
                
                return {
                    success: true,
                    message: "Registration successful. Please login to continue."
                };
            }
            
            return {
                success: false,
                message: response.data.message || 'Registration failed'
            };
        } catch (error) {
            console.error('Registration error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'An error occurred during registration'
            };
        }
    };

    const logout = useCallback(async () => {
        try {
            await api.get('/logout');
            setIsAuthenticated(false);
            setUser(null);
        } catch (error) {
            console.error('Logout error:', error);
            toast({
                title: "Logout failed",
                description: error.message || 'An error occurred while logging out',
                variant: "destructive",
                className: "bg-red-200 border-red-400 text-black text-lg",
                duration: 3000
            });
         }
    }, []);

    const updateProfile = async (userData) => {
        try {
            const response = await api.put(`/user/${user._id}`, userData);
            
            if (response.data.success) {
                const updatedUser = response.data.user;
                setUser(updatedUser);
                // Cookies.set('user', JSON.stringify(updatedUser), { expires: 1 });
                
                toast({
                    title: "Profile updated",
                    description: "Your profile has been successfully updated.",
                    variant: "success",
                    className: "bg-green-200 border-green-400 text-black text-lg",
                    duration: 3000
                });
                
                return { success: true, user: updatedUser };
            } else {
                throw new Error(response.data.message || 'Profile update failed');
            }
        } catch (error) {
            console.error('Profile update error:', error);
            toast({
                title: "Update failed",
                description: error.message || 'An error occurred while updating your profile',
                variant: "destructive",
                className: "bg-red-200 border-red-400 text-black text-lg",
                duration: 3000
            });
            return { 
                success: false, 
                message: error.message || 'An error occurred while updating your profile' 
            };
        }
    };

    const uploadProfilePicture = async (file) => {
        try {
            const formData = new FormData();
            formData.append('profilePicture', file);

            const response = await api.post('/upload-profile-picture', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                const updatedUser = { ...user, profilePicture: response.data.profilePictureUrl };
                setUser(updatedUser);

                toast({
                    title: "Profile picture updated",
                    description: "Your profile picture has been successfully updated.",
                    variant: "success",
                    className: "bg-green-200 border-green-400 text-black text-lg",
                    duration: 3000
                });

                return { success: true, profilePictureUrl: response.data.profilePictureUrl };
            } else {
                throw new Error(response.data.message || 'Profile picture upload failed');
            }
        } catch (error) {
            console.error('Profile picture upload error:', error);
            toast({
                title: "Upload failed",
                description: error.message || 'An error occurred while uploading your profile picture',
                variant: "destructive",
                className: "bg-red-200 border-red-400 text-black text-lg",
                duration: 3000
            });
            return { 
                success: false, 
                message: error.message || 'An error occurred while uploading your profile picture' 
            };
        }
    };


    const deleteAccount = async () => {
        try {
            const response = await api.delete(`/user/delete/${user._id}`);
            
            if (response.data.success) {
                toast({
                    title: "Account deleted",
                    description: "Your account has been successfully deleted.",
                    variant: "success",
                    className: "bg-green-200 border-green-400 text-black text-lg",
                    duration: 3000
                });
                
                await logout();
                return { success: true };
            } else {
                throw new Error(response.data.message || 'Account deletion failed');
            }
        } catch (error) {
            console.error('Account deletion error:', error);
            toast({
                title: "Deletion failed",
                description: error.message || 'An error occurred while deleting your account',
                variant: "destructive",
                className: "bg-red-200 border-red-400 text-black text-lg",
                duration: 3000
            });
            return { 
                success: false, 
                message: error.message || 'An error occurred while deleting your account' 
            };
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            register,
            logout,
            updateProfile,
            uploadProfilePicture,
            deleteAccount,
            fetchUserProfile
        }}>
            {children}
        </AuthContext.Provider>
    );
};