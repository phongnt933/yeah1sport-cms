import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import LOCAL_FORAGE_KEY from "../../constants/localForageKey";
import {
  getLocalForageItem,
  removeLocalForageItem,
  setLocalForageItem,
} from "../../utils/localForage";
import { jsonParse } from "../../utils/object";
import { ROLE } from "../../constants/role";

export type TStorage = {
  userId: string;
  username: string;
  email: string;
  accessToken: string;
  role: ROLE;
  status: string;
};

export type TAuthState = {
  storage: TStorage | null;
  authenticated: boolean;
  loading: boolean;
};

const storageLocal = jsonParse(
  getLocalForageItem(LOCAL_FORAGE_KEY.USER_INFO)
) as TStorage;

const initialState: TAuthState = {
  storage: storageLocal ?? null,
  authenticated: !!storageLocal,
  loading: false,
};

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    saveUserInfo: (state, action: PayloadAction<TStorage>): void => {
      state.storage = { ...state.storage, ...action.payload };
      state.authenticated = true;
      state.loading = false;
    },
    clearData: (state): void => {
      removeLocalForageItem(LOCAL_FORAGE_KEY.USER_INFO);
      state.storage = null;
      state.authenticated = false;
      state.loading = false;
    },
    updateToken: (state, action: PayloadAction<{ accessToken: string }>): void => {
      setLocalForageItem(
        LOCAL_FORAGE_KEY.USER_INFO,
        JSON.stringify({ ...state.storage, accessToken: { ...action.payload } })
      );
      state.storage = {
        ...(state.storage as TStorage),
        accessToken: action.payload.accessToken,
      };
    },
  },
});

export const { saveUserInfo, clearData, updateToken } = slice.actions;

export default slice.reducer;
