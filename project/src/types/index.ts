export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  city: string;
  pincode: string;
  auth0Id: string;
  picture: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserFormData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  city: string;
  pincode: string;
}

export interface WorkflowResponse {
  message: string;
  workflowId: string;
  runId: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
