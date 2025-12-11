export interface User {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
}

export interface LoginResponse {
  token: string;
  user: User;
}