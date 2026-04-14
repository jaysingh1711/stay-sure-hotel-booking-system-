import React, { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertCircle, Lock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const UserSettings = () => {
    const { deleteAccount } = useAuth();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(true);
    const [privacySettings, setPrivacySettings] = useState('friends');
    const [language, setLanguage] = useState('en');
    const navigate = useNavigate();

    const handleChangePassword = (e) => {
        navigate('/forgot-password', { state: { from: '/profile' } });
    };

    const handleDeleteAccount = () => {
        // Static implementation
        deleteAccount();
        setShowDeleteModal(false);
        alert('Account deleted successfully!');
    };

    return (
        <div className="textblack p-4 space-y-8">
            <h1 className="text-3xl font-bold mb-6">User Settings</h1>

            {/* Change Password */}
            <section className="space-y-4">
                <h2 className="text-xl font-semibold">Change Password</h2>
                <Button onClick={handleChangePassword}>Change Password</Button>
            </section>

            {/* Notification Preferences */}
            <section className="space-y-4">
                <h2 className="text-xl font-semibold">Notification Preferences</h2>
                <div className="flex items-center justify-between">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <Switch
                        id="email-notifications"
                        checked={emailNotifications}
                        onCheckedChange={setEmailNotifications}
                    />
                </div>
                <div className="flex items-center justify-between">
                    <Label htmlFor="push-notifications">Push Notifications</Label>
                    <Switch
                        id="push-notifications"
                        checked={pushNotifications}
                        onCheckedChange={setPushNotifications}
                    />
                </div>
            </section>

            {/* Language Preferences */}
            <section className="space-y-4">
                <h2 className="text-xl font-semibold">Language Preferences</h2>
                <div>
                    <Label htmlFor="language-settings">Preferred Language</Label>
                    <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger id="language-settings">
                            <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Español</SelectItem>
                            <SelectItem value="fr">Français</SelectItem>
                            <SelectItem value="de">Deutsch</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </section>

            {/* Delete Account */}
            <section className="space-y-4">
                <h2 className="text-xl font-semibold">Delete Account</h2>
                <p className="text-red-500">Warning: This action cannot be undone.</p>
                <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
                    <DialogTrigger asChild>
                        <Button variant="destructive">Delete Account</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Are you sure you want to delete your account?</DialogTitle>
                            <DialogDescription>
                                This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex items-center space-x-2 text-red-500">
                            <AlertCircle className="h-5 w-5" />
                            <p>All your data will be lost</p>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                            <Button variant="destructive" onClick={handleDeleteAccount}>Delete Account</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </section>
        </div>
    )
}

export default UserSettings

