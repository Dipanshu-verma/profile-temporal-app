import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { User, Clock, CheckCircle, Activity, Calendar, Percent } from 'lucide-react';
import ProfileForm from '../components/ProfileForm';
import LogoutButton from '../components/LogoutButton';
import Loading from '../components/Loading';
import { userService } from '../services/api';
import { User as UserType, ProfileFormData } from '../types';

const Profile: React.FC = () => {
  const { user, isLoading } = useAuth0();
  const [profileData, setProfileData] = useState<UserType | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [workflowId, setWorkflowId] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  useEffect(() => {
    if (user?.email) {
      initializeUser();
    }
  }, [user]);

  const initializeUser = async () => {
    if (!user?.email) return;

    try {
      setFormLoading(true);
      
      // First, try to get existing profile
      try {
        const response = await userService.getProfile(user.email);
   
        if (response.email) {
          setProfileData(response );
          setLastUpdated(response.updatedAt || response.createdAt || null);
        }
      } catch (error) {
        // If user doesn't exist, create them
        const userData = {
          email: user.email,
          firstName: user.given_name || '',
          lastName: user.family_name || '',
          phoneNumber: '',
          city: '',
          pincode: '',
        };

        const createResponse = await userService.loginUser(user.email, userData);
   
        if (createResponse.user.email) {
          setProfileData(createResponse.user);
          setLastUpdated(createResponse.user.createdAt || null);
        }
      }
    } catch (error) {
      console.error('Failed to initialize user:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleProfileUpdate = async (formData: ProfileFormData) => {
    if (!user?.email) return;

    try {
      const response = await userService.updateProfile(user.email, formData);
      if (response.success && response.data) {
        setProfileData(response.data);
        setLastUpdated(new Date().toISOString());
        if (response.workflowId) {
          setWorkflowId(response.workflowId);
        }
      }
    } catch (error) {
      throw error;
    }
  };

  const calculateCompletionPercentage = (): number => {
    if (!profileData) return 0;
    
    const fields = [
      profileData.firstName,
      profileData.lastName,
      profileData.phoneNumber,
      profileData.city,
      profileData.pincode,
    ];
    
    const filledFields = fields.filter(field => field && field.trim() !== '').length;
    return Math.round((filledFields / fields.length) * 100);
  };

  if (isLoading || formLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
        <Loading message="Loading your profile..." />
      </div>
    );
  }

  const completionPercentage = calculateCompletionPercentage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/70 backdrop-blur-sm border-b border-white/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                {user?.picture ? (
                  <img
                    src={user.picture}
                    alt={user.name || 'User'}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-6 h-6 text-white" />
                )}
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Welcome, {user?.given_name || user?.name || 'User'}
                </h1>
                <p className="text-sm text-gray-600">{user?.email}</p>
              </div>
            </div>
            <LogoutButton />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <ProfileForm
              initialData={profileData ? {
                firstName: profileData.firstName,
                lastName: profileData.lastName,
                phoneNumber: profileData.phoneNumber || '',
                city: profileData.city || '',
                pincode: profileData.pincode || '',
              } : undefined}
              onSubmit={handleProfileUpdate}
              loading={formLoading}
            />

            {workflowId && (
              <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  <div>
                    <p className="text-green-800 font-medium">Workflow Started</p>
                    <p className="text-green-700 text-sm">
                      Workflow ID: <code className="bg-green-100 px-2 py-1 rounded">{workflowId}</code>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Completion */}
            <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20">
              <div className="flex items-center mb-4">
                <Percent className="w-5 h-5 text-indigo-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Profile Completion</h3>
              </div>
              <div className="mb-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium text-gray-900">{completionPercentage}%</span>
                </div>
                <div className="mt-2 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${completionPercentage}%` }}
                  ></div>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                {completionPercentage === 100 
                  ? 'Your profile is complete! 🎉'
                  : 'Complete your profile to unlock all features'
                }
              </p>
            </div>

            {/* Last Updated */}
            {lastUpdated && (
              <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20">
                <div className="flex items-center mb-4">
                  <Calendar className="w-5 h-5 text-indigo-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Last Updated</h3>
                </div>
                <p className="text-sm text-gray-600">
                  {new Date(lastUpdated).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            )}

            {/* How It Works */}
            <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20">
              <div className="flex items-center mb-4">
                <Activity className="w-5 h-5 text-indigo-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">How It Works</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-semibold text-indigo-600">1</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Update Profile</p>
                    <p className="text-xs text-gray-600">Make changes to your profile information</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-semibold text-indigo-600">2</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Temporal Workflow</p>
                    <p className="text-xs text-gray-600">System triggers automated workflow</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-semibold text-indigo-600">3</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Data Sync</p>
                    <p className="text-xs text-gray-600">Changes are synchronized across all systems</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;