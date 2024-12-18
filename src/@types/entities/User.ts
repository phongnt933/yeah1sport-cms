import { ROLE } from "../../constants/role";

export interface User {
  userId: string;
  username: string;
  email: string;
  accessToken: string;
}

export interface ICurrentUser {
  email: string;
  name: string;
  role: ROLE;
  status: string;
  id: string;
}

export interface IUser {
  id: string;
  username: string;
  email: string;
  phoneNumber?: string;
  address?: string;
}
