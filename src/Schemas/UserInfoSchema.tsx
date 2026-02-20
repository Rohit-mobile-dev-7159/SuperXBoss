import * as yup from "yup";
let UserInfoSchema = yup.object({
  first_name: yup
    .string()
    .min(3, "Minimum at least 3 character")
    .max(25, "maximum chatacter in 25")
    .required("first name is required"),
  last_name: yup
    .string()
    .min(3, "Minimum at least 3 character")
    .max(25, "maximum chatacter in 25")
    .required("last name is required"),
  email: yup.string().email().required("email is required"),
  business_name: yup
    .string()
    .required("business name is required")
    .default(null),
  gst_number: yup
    .string()
    .matches(
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
      "Is not a Correct format",
    )
    .required("gst number is required")
    .default(null),
  business_contact_number: yup
    .string()
    .required("business contact is required")
    .default(null),
});
export default UserInfoSchema;
