import * as yup from 'yup';

// User profile schema
export const userProfileSchema = yup.object({
  firstName: yup
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(30, 'First name must be less than 30 characters')
    .required('First name is required'),
  lastName: yup
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(30, 'Last name must be less than 30 characters')
    .required('Last name is required'),
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  phone: yup
    .string()
    .matches(
      /^[+]?[1-9][\d]{0,15}$/,
      'Please enter a valid phone number'
    )
    .optional(),
  bio: yup
    .string()
    .max(500, 'Bio must be less than 500 characters')
    .optional(),
  website: yup
    .string()
    .url('Please enter a valid URL')
    .optional(),
  location: yup
    .string()
    .max(100, 'Location must be less than 100 characters')
    .optional(),
});

// User preferences schema
export const userPreferencesSchema = yup.object({
  theme: yup
    .string()
    .oneOf(['light', 'dark', 'system'], 'Invalid theme selection')
    .required('Theme is required'),
  language: yup
    .string()
    .min(2, 'Language code must be at least 2 characters')
    .max(5, 'Language code must be less than 5 characters')
    .required('Language is required'),
  notifications: yup.object({
    email: yup.boolean().required(),
    push: yup.boolean().required(),
    sms: yup.boolean().required(),
  }),
  sidebar: yup.object({
    collapsed: yup.boolean().required(),
    position: yup
      .string()
      .oneOf(['left', 'right'], 'Invalid sidebar position')
      .required(),
  }),
});

// Contact form schema
export const contactFormSchema = yup.object({
  name: yup
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .required('Name is required'),
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  subject: yup
    .string()
    .min(5, 'Subject must be at least 5 characters')
    .max(100, 'Subject must be less than 100 characters')
    .required('Subject is required'),
  message: yup
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must be less than 1000 characters')
    .required('Message is required'),
});

// Address schema
export const addressSchema = yup.object({
  street: yup
    .string()
    .min(5, 'Street address must be at least 5 characters')
    .max(100, 'Street address must be less than 100 characters')
    .required('Street address is required'),
  city: yup
    .string()
    .min(2, 'City must be at least 2 characters')
    .max(50, 'City must be less than 50 characters')
    .required('City is required'),
  state: yup
    .string()
    .min(2, 'State must be at least 2 characters')
    .max(50, 'State must be less than 50 characters')
    .required('State is required'),
  zipCode: yup
    .string()
    .matches(/^\d{5}(-\d{4})?$/, 'Please enter a valid ZIP code')
    .required('ZIP code is required'),
  country: yup
    .string()
    .min(2, 'Country must be at least 2 characters')
    .max(50, 'Country must be less than 50 characters')
    .required('Country is required'),
});

// Types
export type UserProfileFormData = yup.InferType<typeof userProfileSchema>;
export type UserPreferencesFormData = yup.InferType<typeof userPreferencesSchema>;
export type ContactFormData = yup.InferType<typeof contactFormSchema>;
export type AddressFormData = yup.InferType<typeof addressSchema>;