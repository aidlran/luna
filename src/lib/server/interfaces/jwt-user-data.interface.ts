export interface JwtUserData {
  id: string;
  email: string;
  username: string;
  name: string | null;
  createdAt: Date;
  updatedAt: Date;
}
