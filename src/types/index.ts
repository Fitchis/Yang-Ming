export interface RegisteredUser {
  id: string;
  companyName: string;
  email: string; // Acts as User ID
  password?: string;
  fileName: string;
  fileType: string;
  fileSize: string;
  fileDataUrl?: string; // Data URL or object URL for mock viewing
  createdAt: string;
  status: 'Verified' | 'Pending Review' | 'Active';
}

export interface RegistrationFormData {
  companyName: string;
  email: string;
  password: string;
  file: File | null;
  captchaVerified: boolean;
  otp: string;
}
