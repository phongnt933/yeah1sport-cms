import { callApi } from ".";
import {
  TApiProps,
  TResponseDataArr,
  TResponseDataObj,
  TResponseErrorCommon,
} from "../@types/apis";
import {
  RDCreateField,
  RDDeleteField,
  RDGetAllField,
} from "../@types/apis/RequestData";
import { IField } from "../@types/entities/Field";
import END_POINT from "../constants/endpoint";

export const getAllField = async ({
  name = "getAllField",
  query,
  successHandler,
  errorHandler,
}: {
  name?: string;
  query?: RDGetAllField["query"];
  successHandler?: TApiProps<
    RDGetAllField,
    TResponseDataArr<IField>,
    any
  >["successHandler"];
  errorHandler?: TApiProps<
    RDGetAllField,
    TResponseDataArr<IField>,
    TResponseErrorCommon<undefined>
  >["errorHandler"];
}) => {
  const result = await callApi<RDGetAllField, TResponseDataArr<IField>>({
    name,
    path: END_POINT.GET_LIST_FIELD,
    data: {
      query,
    },
    successHandler,
    errorHandler,
  });

  return result;
};

export const createField = async ({
  name = "createField",
  body,
  successHandler,
  errorHandler,
}: {
  name?: string;
  body: RDCreateField["body"];
  successHandler?: TApiProps<
    RDCreateField,
    TResponseDataObj<any>,
    any
  >["successHandler"];
  errorHandler?: TApiProps<
    RDCreateField,
    TResponseDataObj<any>,
    TResponseErrorCommon<undefined>
  >["errorHandler"];
}) => {
  const result = await callApi<RDCreateField, TResponseDataObj<any>>({
    name,
    path: END_POINT.GET_LIST_FIELD,
    data: {
      body,
    },
    method: "POST",
    successHandler,
    errorHandler,
  });

  return result;
};

export const deleteField = async ({
  name = "deleteField",
  param,
  successHandler,
  errorHandler,
}: {
  name?: string;
  param: RDDeleteField["param"];
  successHandler?: TApiProps<
    RDDeleteField,
    TResponseDataObj<any>,
    any
  >["successHandler"];
  errorHandler?: TApiProps<
    RDDeleteField,
    TResponseDataObj<any>,
    TResponseErrorCommon<undefined>
  >["errorHandler"];
}) => {
  const result = await callApi<RDDeleteField, TResponseDataObj<any>>({
    name,
    path: END_POINT.DELETE_FIELD,
    data: {
      param,
    },
    method: "DELETE",
    successHandler,
    errorHandler,
  });

  return result;
};
