
import * as Yup from "yup";

export const loginValidationSchema = Yup.object({
    email: Yup.string().required("Email should not be empty").email("Email is not valid"),
    password: Yup.string().required("Password should not be empty"),
});