export interface RRCommonArray<T> {
  ec: number;
  total?: number;
  data: T[];
  msg?: string;
}
export interface RRCommonObject<T> {
  ec: number;
  total?: number;
  data: T;
  msg?: string;
}

export interface RRRefreshToken {
  ec: number;
  data: { uid: string; accessToken: string; url: string };
}
