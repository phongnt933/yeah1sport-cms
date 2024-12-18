import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useSearchParams from "../../hooks/useSearchParams";
import { useAppDispatch } from "../../redux";
import ROUTE from "../../constants/routes";
import { getCurrentUser } from "../../apis/user";
import { redirectToLogin } from "../../helpers";
import { saveUserInfo } from "../../redux/slices/authSlice";
import { setLocalForageItem } from "../../utils/localForage";
import LOCAL_FORAGE_KEY from "../../constants/localForageKey";

function AuthPage() {
  const navigate = useNavigate();
  const { getAllParams } = useSearchParams();
  const dispatch = useAppDispatch();
  const params = getAllParams<{ t?: string; id?: string }>({
    t: "",
    id: "",
  });

  useEffect(() => {
    async function getAuth() {
      if (params.t && params.id) {
        await getCurrentUser({
          token: params.t,
          param: {
            id: params.id,
          },
          successHandler: {
            callBack(data) {
              if (params.t) {
                setLocalForageItem(
                  LOCAL_FORAGE_KEY.USER_INFO,
                  JSON.stringify({
                    accessToken: params.t,
                    id: data.data.id,
                    username: data.data.name,
                    email: data.data.email,
                    role: data.data.role,
                    status: data.data.status,
                  })
                );
                dispatch(
                  saveUserInfo({
                    accessToken: params.t,
                    userId: data.data.id,
                    username: data.data.name,
                    email: data.data.email,
                    role: data.data.role,
                    status: data.data.status,
                  })
                );
                navigate(ROUTE.HOME, { replace: true });
              }
            },
          },
          errorHandler: {
            callBack(error) {
              redirectToLogin();
            },
          },
        });
      } else {
        redirectToLogin();
      }
    }
    getAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params)]);
  return <div></div>;
}

export default AuthPage;
