import * as yup from 'yup';
let LoginSchema = yup.object({
  mobile: yup?.string().min(10).max(10).required('please enter phone number'),
});
export default LoginSchema;
