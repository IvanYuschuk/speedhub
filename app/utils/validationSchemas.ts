import * as Yup from "yup";

export const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Невірний формат пошти")
    .required("Електронна пошта обов'язкова"),
  password: Yup.string()
    .min(6, "Пароль має бути не менше 6 символів")
    .required("Пароль обов'язковий"),
});

export const RegisterSchema = Yup.object().shape({
  name: Yup.string().required("Ім'я обов'язкове"),
  surname: Yup.string().required("Прізвище обов'язкове"),
  email: Yup.string()
    .email("Невірний формат пошти")
    .required("Електронна пошта обов'язкова"),
  password: Yup.string()
    .min(6, "Пароль має бути не менше 6 символів")
    .required("Пароль обов'язковий"),
});
