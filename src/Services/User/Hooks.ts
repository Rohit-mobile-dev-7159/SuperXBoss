import {useMutation} from '@tanstack/react-query';
import {userUpdate} from './apis';
export const useCustomerUpdate = () => {
  return useMutation({
    mutationFn: (payload: any) => userUpdate(payload),
  });
};
