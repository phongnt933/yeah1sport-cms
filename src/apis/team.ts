import { callApi } from ".";
import {
  TApiProps,
  TResponseDataArr,
  TResponseErrorCommon,
} from "../@types/apis";
import { RDGetAllTeam } from "../@types/apis/RequestData";
import { ITeam } from "../@types/entities/Team";
import END_POINT from "../constants/endpoint";

export const getAllTeam = async ({
  name = "getAllTeam",
  query,
  successHandler,
  errorHandler,
}: {
  name?: string;
  query?: RDGetAllTeam["query"];
  successHandler?: TApiProps<
    RDGetAllTeam,
    TResponseDataArr<ITeam>,
    any
  >["successHandler"];
  errorHandler?: TApiProps<
    RDGetAllTeam,
    TResponseDataArr<ITeam>,
    TResponseErrorCommon<undefined>
  >["errorHandler"];
}) => {
  const result = await callApi<RDGetAllTeam, TResponseDataArr<ITeam>>({
    name,
    path: END_POINT.TEAM,
    data: {
      query,
    },
    successHandler,
    errorHandler,
  });

  return result;
};
