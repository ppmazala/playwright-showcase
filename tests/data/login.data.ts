import { UserCredentials } from '../../pages/LoginPage';

export const VALID_USER: UserCredentials = {
  username: process.env.STANDARD_USER ?? 'standard_user',
  password: process.env.PASSWORD ?? 'secret_sauce',
};

export const ERROR_USER: UserCredentials = {
  username: 'error_user',
  password: process.env.PASSWORD ?? 'secret_sauce',
};

export const REQUIRED_FIELDS = [
  { key: 'username', label: 'Username' },
  { key: 'password', label: 'Password' },
] as const;

export const BUSINESS_LOGIC_CASES = [
  {
    description: 'invalid credentials',
    credentials: { username: 'invalid_user', password: 'wrong_password' },
    expectedError: 'Epic sadface: Username and password do not match any user in this service',
  },
  {
    description: 'locked out user',
    credentials: { username: 'locked_out_user', password: VALID_USER.password },
    expectedError: 'Epic sadface: Sorry, this user has been locked out.',
  },
] as const;
