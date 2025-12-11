import { number } from 'zod';

export interface IResponseApi<T = unknown> {
  content: T;
  hasErrors: boolean;
  errors: string[];
  timeStamp: string;
  statusCode: number;
}

export interface ICountry {
  code: string;
  name: string;
}

export interface ICity {
  id: number;
  name: string;
  countryCode: string;
}

export interface ICommonCode {
  id: number;
  name: string;
}

export type IGender = ICommonCode;
export type IRelationship = ICommonCode;

export enum EModeType {
  CREATE = 'CREATE',
  EDIT = 'EDIT',
  VIEW = 'VIEW'
}

export interface ICommonPage {
  totalItems: number;
  totalPages: number;
}

export type SupportedLanguages = 'ko' | 'vi' | 'enUS';
