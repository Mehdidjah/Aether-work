import { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Building2, 
  Globe, 
  Calendar,
  Camera,
  Save,
  Github,
  Linkedin,
  Twitter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

interface ProfileData {
  displayName: string;
  email: string;
  phone: string;
  bio: string;
  jobTitle: string;
  company: string;
  location: string;
  website: string;
  timezone: string;
  github: string;
  linkedin: string;
  twitter: string;
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<ProfileData>({
    displayName: 'Alex Chen',
    email: 'alex.chen@example.com',
    phone: '+1 (555) 123-4567',
    bio: 'Full-stack developer passionate about building great user experiences. Love working with React, TypeScript, and modern web technologies.',
    jobTitle: 'Senior Developer',
    company: 'Tech Corp',
    location: 'San Francisco, CA',
    website: 'https://alexchen.dev',
    timezone: 'America/Los_Angeles',
    github: 'alexchen',
    linkedin: 'alexchen',
    twitter: 'alexchen_dev',
  });

  const handleSave = () => {
    setIsEditing(false);
    toast.success('Profile updated successfully');
  };

  const handleChange = (field: keyof ProfileData, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Profile</h1>
          <p className="text-muted-foreground">Manage your personal information</p>
        </div>
        <Button 
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className="gap-2"
        >
          {isEditing ? (
            <>
              <Save className="h-4 w-4" />
              Save Changes
            </>
          ) : (
            'Edit Profile'
          )}
        </Button>
      </div>

      {/* Avatar Section */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src="" />
                <AvatarFallback className="text-2xl bg-primary/10 text-primary">AC</AvatarFallback>
              </Avatar>
              {isEditing && (
                <Button 
                  size="icon" 
                  variant="secondary" 
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold">{profile.displayName}</h2>
              <p className="text-muted-foreground">{profile.jobTitle} at {profile.company}</p>
              <div className="flex gap-2 mt-2">
                <Badge variant="secondary">Pro Member</Badge>
                <Badge variant="outline">Verified</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Basic Information */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="h-5 w-5" />
            Basic Information
          </CardTitle>
          <CardDescription>Your public profile information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                value={profile.displayName}
                onChange={(e) => handleChange('displayName', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  disabled={!isEditing}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  disabled={!isEditing}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="location"
                  value={profile.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  disabled={!isEditing}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={profile.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
              disabled={!isEditing}
              rows={3}
              placeholder="Tell us about yourself..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Work Information */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Work Information
          </CardTitle>
          <CardDescription>Your professional details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="jobTitle">Job Title</Label>
              <Input
                id="jobTitle"
                value={profile.jobTitle}
                onChange={(e) => handleChange('jobTitle', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="company"
                  value={profile.company}
                  onChange={(e) => handleChange('company', e.target.value)}
                  disabled={!isEditing}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="website"
                  type="url"
                  value={profile.website}
                  onChange={(e) => handleChange('website', e.target.value)}
                  disabled={!isEditing}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="timezone"
                  value={profile.timezone}
                  onChange={(e) => handleChange('timezone', e.target.value)}
                  disabled={!isEditing}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Social Links
          </CardTitle>
          <CardDescription>Connect your social profiles</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="github">GitHub</Label>
              <div className="relative">
                <Github className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="github"
                  value={profile.github}
                  onChange={(e) => handleChange('github', e.target.value)}
                  disabled={!isEditing}
                  className="pl-10"
                  placeholder="username"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn</Label>
              <div className="relative">
                <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="linkedin"
                  value={profile.linkedin}
                  onChange={(e) => handleChange('linkedin', e.target.value)}
                  disabled={!isEditing}
                  className="pl-10"
                  placeholder="username"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="twitter">Twitter</Label>
              <div className="relative">
                <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="twitter"
                  value={profile.twitter}
                  onChange={(e) => handleChange('twitter', e.target.value)}
                  disabled={!isEditing}
                  className="pl-10"
                  placeholder="username"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
