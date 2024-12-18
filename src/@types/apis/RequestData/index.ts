import { ROLE } from "../../../constants/role";
import { IFieldForm } from "../../../pages/field/CreateFieldForm";

export interface RDCommon {
  body?: {
    [key: string]: any;
  };
  query?:
    | {
        [key: string]: any;
      }
    | FormData;
  param?: {
    [key: string]: any;
  };
}

export interface RDGetUserInfo extends RDCommon {}

export interface RDGetAllUser extends RDCommon {
  query?: {
    p?: number;
    r?: number;
  };
}

export interface RDCreateUser extends RDCommon {
  body: {
    email: string;
    password: string;
    name: string;
    phone: string;
    role: ROLE;
  };
}

export interface RDGetAllField extends RDCommon {
  query?: {
    p?: number;
    r?: number;
  };
}

export interface RDCreateField extends RDCommon {
  body: IFieldForm;
}

export interface RDDeleteField extends RDCommon {
  param: {
    fieldId: string;
  };
}

export interface RDGetAllBooking extends RDCommon {
  query?: {
    p?: number;
    r?: number;
  };
}
export interface RDGetAllTeam extends RDCommon {
  query?: {
    p?: number;
    r?: number;
  };
}

export interface RDDeleteUser extends RDCommon {
  param: {
    id: string;
  };
}
