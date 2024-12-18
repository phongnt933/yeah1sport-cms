import { callApi } from ".";
import {
  TApiProps,
  TResponseDataArr,
  TResponseErrorCommon,
} from "../@types/apis";
import { RDGetAllBooking } from "../@types/apis/RequestData";
import { IBooking } from "../@types/entities/Booking";
import END_POINT from "../constants/endpoint";

export const getAllBooking = async ({
  name = "getAllBooking",
  query,
  successHandler,
  errorHandler,
}: {
  name?: string;
  query?: RDGetAllBooking["query"];
  successHandler?: TApiProps<
    RDGetAllBooking,
    TResponseDataArr<IBooking>,
    any
  >["successHandler"];
  errorHandler?: TApiProps<
    RDGetAllBooking,
    TResponseDataArr<IBooking>,
    TResponseErrorCommon<undefined>
  >["errorHandler"];
}) => {
  const result = await callApi<RDGetAllBooking, TResponseDataArr<IBooking>>({
    name,
    path: END_POINT.GET_LIST_BOOKING,
    data: {
      query,
    },
    successHandler,
    errorHandler,
  });

  return result;
};
