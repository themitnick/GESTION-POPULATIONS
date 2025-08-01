export interface User {
  id: string;
  username: string;
  email: string;
  password?: string;
  role: 'admin' | 'agent' | 'consultant';
  firstName: string;
  lastName: string;
  phone?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}
