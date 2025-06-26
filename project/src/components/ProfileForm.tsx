import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { User, Phone, MapPin, Hash, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { ProfileFormData, ApiResponse } from '../types';
import { userService } from '../services/api';

interface ProfileFormProps {
  initialData?: ProfileFormData;
  onSubmit: (data: ProfileFormData) => Promise<void>;
  loading?: boolean;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ initialData, onSubmit, loading = false }) => {
  const { user } = useAuth0();
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    phoneNumber: initialData?.phoneNumber || '',
    city: initialData?.city || '',
    pincode: initialData?.pincode || '',
  });
  
  const [errors, setErrors] = useState<Partial<ProfileFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const validateForm = (): boolean => {
    const newErrors: Partial<ProfileFormData> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (formData.phoneNumber && !/^\+?[\d\s-()]+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }

    if (formData.pincode && !/^\d{5,6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Please enter a valid pincode (5-6 digits)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name as keyof ProfileFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      await onSubmit(formData);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = (fieldName: keyof ProfileFormData) => `
    w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200
    ${errors[fieldName] 
      ? 'border-red-300 bg-red-50' 
      : 'border-gray-300 bg-white hover:border-gray-400'
    }
  `;

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center mb-6">
        <User className="w-6 h-6 text-indigo-600 mr-2" />
        <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
      </div>

      {message && (
        <div className={`flex items-center p-4 rounded-lg mb-6 ${
          message.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
          )}
          <span className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
            {message.text}
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className={inputClasses('firstName')}
              placeholder="Enter your first name"
              required
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
            )}
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className={inputClasses('lastName')}
              placeholder="Enter your last name"
              required
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
            <Phone className="w-4 h-4 inline mr-1" />
            Phone Number
          </label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            className={inputClasses('phoneNumber')}
            placeholder="Enter your phone number"
          />
          {errors.phoneNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              City
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className={inputClasses('city')}
              placeholder="Enter your city"
            />
          </div>

          <div>
            <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-2">
              <Hash className="w-4 h-4 inline mr-1" />
              Pincode
            </label>
            <input
              type="text"
              id="pincode"
              name="pincode"
              value={formData.pincode}
              onChange={handleInputChange}
              className={inputClasses('pincode')}
              placeholder="Enter your pincode"
            />
            {errors.pincode && (
              <p className="mt-1 text-sm text-red-600">{errors.pincode}</p>
            )}
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting || loading}
            className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Updating Profile...
              </>
            ) : (
              'Update Profile'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;