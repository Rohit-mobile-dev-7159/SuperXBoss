import {apiCall} from '../../Axios/Axios';
import AllUrls from '../../Constant/AllUrls';
import {CustomerUpdateInput} from './types';

// Customer
export const userUpdate = async (
  payload: CustomerUpdateInput,
): Promise<any> => {
  const data = await apiCall<any>('put', `${AllUrls.userUpdate}`, payload);
  return data;
};
