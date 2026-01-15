"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import {
  User,
  Mail,
  Calendar,
  Building2,
  MapPin,
  Phone,
  Globe,
  Camera,
  Lock,
  Bell,
  Shield,
  ExternalLink,
} from "lucide-react";

const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.first_name || "",
    lastName: user?.last_name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    bio: user?.bio || "",
    company: user?.company || "",
    website: user?.website || "",
    location: user?.location || "",
  });

  // console.log(user)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // In a real application, you would call an API to update the user profile
    // For now, we'll just simulate the update
    try {
      // Update the user in context
      updateUser({
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        bio: formData.bio,
        company: formData.company,
        website: formData.website,
        location: formData.location,
      });

      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
    }
  };

  const handleCancel = () => {
    // Reset form data to original values
    setFormData({
      firstName: user?.first_name || "",
      lastName: user?.last_name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      bio: user?.bio || "",
      company: user?.company || "",
      website: user?.website || "",
      location: user?.location || "",
    });
    setIsEditing(false);
  };


  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold pb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
          Profile Settings
        </h1>
        <p className="text-xl text-muted-foreground">
          Manage your personal information and account settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column - Profile Picture and Info */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="overflow-hidden border-0 bg-gradient-to-br from-primary/5 to-secondary/5 shadow-sm">
            <div className="bg-gradient-to-r from-primary to-blue-500 h-32 relative" />
            <CardHeader className="flex flex-col items-center pt-16 pb-6 relative">
              <div className="relative -mt-24 mb-4 group">
                <Avatar className="h-36 w-36 border-4 border-background ring-4 ring-white dark:ring-gray-800 transition-transform duration-300 group-hover:scale-105 shadow-lg">
                  <AvatarImage
                    src={`https://api.dicebear.com/6.x/initials/svg?seed=${
                      user?.first_name || user?.email
                    }&backgroundColor=b6e6a1&fontSize=36`}
                    alt={`${user?.first_name || user?.email}'s avatar`}
                  />
                  <AvatarFallback className="text-2xl bg-primary/10">
                    {user?.first_name?.charAt(0)?.toUpperCase()}
                    {user?.last_name?.charAt(0)?.toUpperCase() ||
                      user?.email?.charAt(0)?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  className="absolute bottom-2 right-2 rounded-full h-10 w-10 bg-primary hover:bg-primary/90 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  aria-label="Change profile picture"
                >
                  <Camera className="h-5 w-5" />
                </Button>
              </div>
              <CardTitle className="text-lg font-bold text-center">
                {user?.first_name || user?.last_name
                  ? `${user?.first_name || ""} ${user?.last_name || ""}`.trim()
                  : user?.email || "Anonymous User"}
              </CardTitle>

              <CardDescription className="text-lg text-center mt-2">
                {user?.company || "Company not specified"}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center pb-6">
              <p className="text-base text-muted-foreground italic max-w-xs mx-auto">
                {user?.bio ||
                  "No bio specified. Add a short description about yourself."}
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-gradient-to-br from-muted/30 to-background shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                About
              </CardTitle>
              <CardDescription className="text-xs">
                Personal information and details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                <div className="p-2 rounded-full bg-primary/10 mt-0.5 flex-shrink-0">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-muted-foreground font-medium">
                    Email
                  </p>
                  <p className="font-semibold text-base truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
              {user?.phone && (
                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="p-2 rounded-full bg-primary/10 mt-0.5 flex-shrink-0">
                    <Phone className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-muted-foreground font-medium">
                      Phone
                    </p>
                    <p className="font-semibold text-base truncate">
                      {user.phone}
                    </p>
                  </div>
                </div>
              )}
              {user?.company && (
                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="p-2 rounded-full bg-primary/10 mt-0.5 flex-shrink-0">
                    <Building2 className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-muted-foreground font-medium">
                      Company
                    </p>
                    <p className="font-semibold text-base truncate">
                      {user.company}
                    </p>
                  </div>
                </div>
              )}
              {user?.location && (
                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="p-2 rounded-full bg-primary/10 mt-0.5 flex-shrink-0">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-muted-foreground font-medium">
                      Location
                    </p>
                    <p className="font-semibold text-base truncate">
                      {user.location}
                    </p>
                  </div>
                </div>
              )}
              {user?.website && (
                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="p-2 rounded-full bg-primary/10 mt-0.5 flex-shrink-0">
                    <Globe className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-muted-foreground font-medium">
                      Website
                    </p>
                    <a
                      href={
                        user.website.startsWith("http")
                          ? user.website
                          : `https://${user.website}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-base text-primary hover:underline inline-flex items-center gap-1 truncate"
                    >
                      {user.website}
                      <ExternalLink className="h-3 w-3 flex-shrink-0" />
                    </a>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                <div className="p-2 rounded-full bg-primary/10 mt-0.5 flex-shrink-0">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-muted-foreground font-medium">
                    Joined
                  </p>
                  <p className="font-semibold text-base">
                    {" "}
                    {user?.created_at
                      ? new Date(user.created_at).toLocaleDateString()
                      : "Unknown"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Editable Profile Form */}
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl font-bold">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
              <CardDescription className="text-base">
                Update your personal details and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-base">
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="Enter your first name"
                      className={
                        isEditing
                          ? "focus:ring-2 focus:ring-primary focus:ring-offset-2 text-base py-2"
                          : "cursor-not-allowed opacity-70 text-base py-2"
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-base">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="Enter your last name"
                      className={
                        isEditing
                          ? "focus:ring-2 focus:ring-primary focus:ring-offset-2 text-base py-2"
                          : "cursor-not-allowed opacity-70 text-base py-2"
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-base">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="your.email@example.com"
                    className={
                      isEditing
                        ? "focus:ring-2 focus:ring-primary focus:ring-offset-2 text-base py-2"
                        : "cursor-not-allowed opacity-70 text-base py-2"
                    }
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-base">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="(123) 456-7890"
                      className={
                        isEditing
                          ? "focus:ring-2 focus:ring-primary focus:ring-offset-2 text-base py-2"
                          : "cursor-not-allowed opacity-70 text-base py-2"
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company" className="text-base">
                      Company
                    </Label>
                    <Input
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="Company name"
                      className={
                        isEditing
                          ? "focus:ring-2 focus:ring-primary focus:ring-offset-2 text-base py-2"
                          : "cursor-not-allowed opacity-70 text-base py-2"
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-base">
                      Location
                    </Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="City, Country"
                      className={
                        isEditing
                          ? "focus:ring-2 focus:ring-primary focus:ring-offset-2 text-base py-2"
                          : "cursor-not-allowed opacity-70 text-base py-2"
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website" className="text-base">
                      Website
                    </Label>
                    <Input
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="https://example.com"
                      className={
                        isEditing
                          ? "focus:ring-2 focus:ring-primary focus:ring-offset-2 text-base py-2"
                          : "cursor-not-allowed opacity-70 text-base py-2"
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-base">
                    Bio
                  </Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    disabled={!isEditing}
                    rows={4}
                    placeholder="Tell us about yourself..."
                    className={
                      isEditing
                        ? "focus:ring-2 focus:ring-primary focus:ring-offset-2 text-base py-2"
                        : "cursor-not-allowed opacity-70 text-base py-2"
                    }
                  />
                </div>

                <div className="border-t pt-6" />

                <div className="flex justify-end gap-3">
                  {!isEditing ? (
                    <Button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="px-6 py-2 text-base"
                    >
                      Edit Profile
                    </Button>
                  ) : (
                    <>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        className="px-6 py-2 text-base"
                      >
                        Cancel
                      </Button>
                      <Button type="submit" className="px-6 py-2 text-base">
                        Save Changes
                      </Button>
                    </>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl font-bold">
                <Shield className="h-5 w-5" />
                Account Preferences
              </CardTitle>
              <CardDescription className="text-base">
                Manage your account settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-lg border">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Bell className="h-5 w-5 text-primary" />
                      <Label className="font-medium text-lg">
                        Email Notifications
                      </Label>
                    </div>
                    <p className="text-base text-muted-foreground mt-1">
                      Receive updates and notifications via email
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto text-base"
                  >
                    Manage
                  </Button>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-lg border">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Lock className="h-5 w-5 text-primary" />
                      <Label className="font-medium text-lg">
                        Privacy Settings
                      </Label>
                    </div>
                    <p className="text-base text-muted-foreground mt-1">
                      Control who can see your profile
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto text-base"
                  >
                    Manage
                  </Button>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-lg border">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-primary" />
                      <Label className="font-medium text-lg">
                        Security Settings
                      </Label>
                    </div>
                    <p className="text-base text-muted-foreground mt-1">
                      Change password and manage access
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto text-base"
                  >
                    Manage
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
