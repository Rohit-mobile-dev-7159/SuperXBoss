import axios from "axios";
import {NavigationString, Variable} from "../Constant/AllImports";
import {setToken} from "../Redux/Slices/Token";
import {store} from "../Redux/Store";
import {navigate} from "../Utils/NavigationService";

export const apiCall = async <R, D = {}>(
  method: "get" | "post" | "patch" | "delete" | "put",
  url: string,
  data?: D,
  params?: any,
  contentType?: string,
): Promise<R> => {
  try {
    const token: any = store.getState().token.token;

    const response = await axios({
      method,
      url,
      data,
      params,
      withCredentials: true,
      baseURL: Variable.Main_Base,
      headers: {
        Authorization: `Bearer ${token?.token}`,
        "Content-Type": contentType || "application/json",
      },
    });

    return response.data;
  } catch (error: any) {
    const errorMessage = error?.response?.data?.error;

    if (error?.response?.status === 401) {
      store.dispatch(setToken({}));
      navigate(NavigationString.Login);

      return {
        success: false,
        message: "JWT Error - Token expired or malformed",
      } as R;
    }

    return {
      success: false,
      message: error?.response?.data?.message || "No Response From Server",
    } as R;
  }
};
