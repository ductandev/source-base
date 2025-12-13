export interface ILoginRequest {
  email: string;
  password: string;
}

export interface ILoginResponse {
  usrId: string;
  username: string;
  creUsrId: string;
  creDt: Date;
  updUsrId: string;
  updDt: Date;
}