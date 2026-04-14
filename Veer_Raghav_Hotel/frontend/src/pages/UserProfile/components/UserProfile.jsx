import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Edit, Upload, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

const UserProfile = () => {
    const { user, updateProfile, uploadProfilePicture } = useAuth();
    // const { toast } = useToast();
    
    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phoneno: user?.phoneno || '',
        gender: user?.gender || '',
        age: user?.age || '',
        address: user?.address || '',
        facebook: user?.facebook || '',
        twitter: user?.twitter || '',
        instagram: user?.instagram || '',
        linkedin: user?.linkedin || '',
    });

    const [avatar, setAvatar] = useState(user?.profilePicture || '');

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phoneno: user.phoneno || '',
                gender: user.gender || '',
                age: user.age || '',
                address: user.address || '',
                facebook: user.facebook || '',
                twitter: user.twitter || '',
                instagram: user.instagram || '',
                linkedin: user.linkedin || '',
            });
            setAvatar(user.profilePicture || '');
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const result = await updateProfile(formData);
            if (result.success) {
                setIsEditing(false);
                toast({
                    title: "Profile Updated",
                    description: "Your profile has been successfully updated.",
                    status: "success",
                    className: "bg-green-200 border-green-400 text-black text-lg",
                });
            }
            window.location.reload();
        } catch (error) {
            toast({
                title: "Update Failed",
                description: error.message,
                status: "error",
            });
        }
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const result = await uploadProfilePicture(file);
                if (result.success) {
                    setAvatar(result.profilePictureUrl);
                }
            } catch (error) {
                toast({
                    title: "Upload Failed",
                    description: error.message,
                    status: "error",
                });
            }
        }
    };

    return (
        <Card className="w-full max-w-4xl ">
            <CardHeader>
                <CardTitle className="text-3xl font-bold text-left">Your Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex justify-center mb-6">
                    <div className="relative">
                        <Avatar className="w-32 h-32">
                            <AvatarImage src={avatar} alt={user?.name} />
                            <AvatarFallback>{user?.name}</AvatarFallback>
                        </Avatar>
                        {/* <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 p-1 bg-primary text-primary-foreground rounded-full cursor-pointer">
                            <Upload className="w-4 h-4" />
                            <input
                                id="avatar-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleAvatarChange}
                            />
                        </label> */}
                    </div>
                </div>
                <div className="flex justify-between items-center mb-4">
                    <Button
                        variant={isEditing ? "secondary" : "default"}
                        onClick={() => setIsEditing(!isEditing)}
                    >
                        <Edit className="w-4 h-4 mr-2" />
                        {isEditing ? 'Cancel' : 'Edit Profile'}
                    </Button>
                </div>
                {isEditing ? (
                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="phoneno">Phone Number</Label>
                                <Input
                                    id="phoneno"
                                    name="phoneno"
                                    value={formData.phoneno}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div>
                                <Label htmlFor="gender">Gender</Label>
                                <Input
                                    id="gender"
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div>
                                <Label htmlFor="age">Age</Label>
                                <Input
                                    id="age"
                                    name="age"
                                    type="number"
                                    value={formData.age}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div>
                                <Label htmlFor="address">Address</Label>
                                <Input
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        {/* <div className="space-y-2">
                            <Label>Social Media Links</Label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center space-x-2">
                                    <Facebook className="w-5 h-5 text-blue-600" />
                                    <Input
                                        name="facebook"
                                        placeholder="Facebook URL"
                                        value={formData.facebook}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Twitter className="w-5 h-5 text-blue-400" />
                                    <Input
                                        name="twitter"
                                        placeholder="Twitter URL"
                                        value={formData.twitter}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Instagram className="w-5 h-5 text-pink-600" />
                                    <Input
                                        name="instagram"
                                        placeholder="Instagram URL"
                                        value={formData.instagram}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Linkedin className="w-5 h-5 text-blue-700" />
                                    <Input
                                        name="linkedin"
                                        placeholder="LinkedIn URL"
                                        value={formData.linkedin}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        </div> */}
                        <Button type="submit" className="w-full">Save Changes</Button>
                    </form>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label>Name</Label>
                            <p className="mt-1 font-medium">{user?.name}</p>
                        </div>
                        <div>
                            <Label>Email</Label>
                            <p className="mt-1 font-medium">{user?.email}</p>
                        </div>
                        <div>
                            <Label>Phone Number</Label>
                            <p className="mt-1 font-medium">{user?.phoneno || 'Not provided'}</p>
                        </div>
                        <div>
                            <Label>Gender</Label>
                            <p className="mt-1 font-medium">{user?.gender || 'Not provided'}</p>
                        </div>
                        <div>
                            <Label>Age</Label>
                            <p className="mt-1 font-medium">{user?.age || 'Not provided'}</p>
                        </div>
                        <div>
                            <Label>Address</Label>
                            <p className="mt-1 font-medium">{user?.address || 'Not provided'}</p>
                        </div>
                        {/* <div className="col-span-2">
                            <Label>Social Media</Label>
                            <div className="mt-2 flex space-x-4">
                                {user?.facebook && (
                                    <a href={user.facebook} target="_blank" rel="noopener noreferrer">
                                        <Facebook className="w-6 h-6 text-blue-600" />
                                    </a>
                                )}
                                {user?.twitter && (
                                    <a href={user.twitter} target="_blank" rel="noopener noreferrer">
                                        <Twitter className="w-6 h-6 text-blue-400" />
                                    </a>
                                )}
                                {user?.instagram && (
                                    <a href={user.instagram} target="_blank" rel="noopener noreferrer">
                                        <Instagram className="w-6 h-6 text-pink-600" />
                                    </a>
                                )}
                                {user?.linkedin && (
                                    <a href={user.linkedin} target="_blank" rel="noopener noreferrer">
                                        <Linkedin className="w-6 h-6 text-blue-700" />
                                    </a>
                                )}
                            </div>
                        </div> */}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default UserProfile;

