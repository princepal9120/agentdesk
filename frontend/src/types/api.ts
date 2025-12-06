import { User } from './entities';

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface AuthResponse {
  user_id: string;
  token: string;
  refresh_token: string;
  expires_in: number;
  user: User;
}

export interface ApiError {
  detail: string | { loc: (string | number)[]; msg: string; type: string }[];
}
