export interface LoginDto {
  email: string;
  password: string;
}

export interface SignupDto {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  created_at: number;
  updated_at: number;
}
