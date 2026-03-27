"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import { LoginSchema } from "@/app/utils/validationSchemas";
import { useAuthActions } from "@/app/hooks/useAuthActions";
import css from "./LoginForm.module.css";

interface LoginFormProps {
  onClose: () => void;
  onOpen: () => void;
}

export default function LoginForm({ onClose, onOpen }: LoginFormProps) {
  // Викликаємо наш хук, який зробить всю роботу
  const { handleLogin, error } = useAuthActions(onClose);

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
      <h2 className={css.title}>Вхід</h2>
      <p className={css.subtitle}>З поверненням! Увійдіть до свого акаунта.</p>

      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={LoginSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            await handleLogin(values);
          } catch {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form className={css.form}>
            {error && <div className={css.serverError}>{error}</div>}

            <div className={css.inputGroup}>
              <label className={css.label} htmlFor="login-email">
                Електронна пошта
              </label>
              <Field
                name="email"
                type="email"
                id="login-email"
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
              <label className={css.label} htmlFor="login-password">
                Пароль
              </label>
              <Field
                name="password"
                type="password"
                id="login-password"
                className={`${css.input} ${errors.password && touched.password ? css.inputInvalid : ""}`}
                placeholder="Введіть ваш пароль"
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
              {isSubmitting ? "Вхід..." : "Увійти"}
            </button>
          </Form>
        )}
      </Formik>

      <p className={css.switchText}>
        Ще не зареєстровані?{" "}
        <button type="button" className={css.switchBtn} onClick={onOpen}>
          Створити акаунт
        </button>
      </p>
    </>
  );
}
