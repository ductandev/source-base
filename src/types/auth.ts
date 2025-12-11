export interface ILoginRequest {
  email: string;
  password: string;
  isRememberMe: boolean;
}

export interface ILoginResponse {
  email: string;
  username: string;
  accountStatus: string;
  lastLoginDt: string;
  roles: string[];
}

export interface IEmailExistsRequest {
  email: string;
}

export interface IRegisterRequest {
  email: string;
  password: string;
  fullName: string;
  nickName: string;
  phone: string;
  dob: string;
  genreIds?: number[];
  relationshipStatusId?: number;
  favoriteLocalArea?: string;
  bio?: string;
  genderId?: number;
  linkedinUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  threadUrl?: string;
  twitterUrl?: string;
}

export interface IRegisterResponse {
  email: string;
  username: string;
  accountStatus: string;
  lastLoginDt: string;
  roles: string[];
}

export interface IRegisterConfirmRequest {
  token: string;
  email: string;
}

export interface IResendEmailRequest {
  email: string;
}

export interface IForgotPasswordRequest {
  email: string;
}

export interface IForgotConfirmRequest {
  token: string;
}

export interface IResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface IOrganizerLoginRequest {
  username: string;
  password: string;
  isRememberMe: boolean;
}

export interface IAdminLoginRequest {
  username: string;
  password: string;
}

export interface IOrganizerLoginResponse {
  email: string;
  username: string;
  accountStatus: string;
  lastLoginDt: string;
  roles: string[];
}
