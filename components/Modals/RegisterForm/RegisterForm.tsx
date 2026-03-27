"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import { RegisterSchema } from "@/app/utils/validationSchemas";
import { useAuthActions } from "@/app/hooks/useAuthActions";
import css from "./RegisterForm.module.css";

interface RegisterFormProps {
  onClose: () => void;
  onOpen: () => void;
}

export default function RegisterForm({ onClose, onOpen }: RegisterFormProps) {
  const { handleRegister, error } = useAuthActions(onClose);

  return (
    <>
      <button
        type="button"
        className={css.closeBtn}
        onClick={onClose}
        aria-label="Закрити"
      >
        ✕
      </button>
      <h2 className={css.title}>Реєстрація</h2>
      <p className={css.subtitle}>Створіть акаунт, щоб розпочати навчання.</p>

      <Formik
        initialValues={{ name: "", surname: "", email: "", password: "" }}
        validationSchema={RegisterSchema}
        enableReinitialize={false}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            await handleRegister(values);
          } catch {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form className={css.form}>
            {error && <div className={css.serverError}>{error}</div>}

            <div className={css.inputGroup}>
              <label className={css.label} htmlFor="reg-name">
                Ім’я
              </label>
              <Field
                name="name"
                id="reg-name"
                className={`${css.input} ${errors.name && touched.name ? css.inputInvalid : ""}`}
                placeholder="Ваше ім'я"
              />
              <ErrorMessage
                name="name"
                component="span"
                className={css.errorText}
              />
            </div>

            <div className={css.inputGroup}>
              <label className={css.label} htmlFor="reg-surname">
                Прізвище
              </label>
              <Field
                name="surname"
                id="reg-surname"
                className={`${css.input} ${errors.surname && touched.surname ? css.inputInvalid : ""}`}
                placeholder="Ваше прізвище"
              />
              <ErrorMessage
                name="surname"
                component="span"
                className={css.errorText}
              />
            </div>

            <div className={css.inputGroup}>
              <label className={css.label} htmlFor="reg-email">
                Електронна пошта
              </label>
              <Field
                name="email"
                type="email"
                id="reg-email"
                className={`${css.input} ${errors.email && touched.email ? css.inputInvalid : ""}`}
                placeholder="mail@example.com"
              />
              <ErrorMessage
                name="email"
                component="span"
                className={css.errorText}
              />
            </div>

            <div className={css.inputGroup}>
              <label className={css.label} htmlFor="reg-password">
                Пароль
              </label>
              <Field
                name="password"
                type="password"
                id="reg-password"
                className={`${css.input} ${errors.password && touched.password ? css.inputInvalid : ""}`}
                placeholder="Створіть пароль"
              />
              <ErrorMessage
                name="password"
                component="span"
                className={css.errorText}
              />
            </div>

            <button
              type="submit"
              className={css.submitBtn}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Завантаження..." : "Зареєструватись"}
            </button>
          </Form>
        )}
      </Formik>

      <p className={css.switchText}>
        Вже є акаунт?{" "}
        <button type="button" className={css.switchBtn} onClick={onOpen}>
          Увійти
        </button>
      </p>
    </>
  );
}
