"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import css from "./Header.module.css";
import ModalSection from "../ModalSection/ModalSection";
import RegisterForm from "../RegisterForm/RegisterForm";
import LoginForm from "../LoginForm/LoginForm";
import { getUserName } from "@/app/utils/auth";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isopenModal, setIsOpenModal] = useState(false);
  const [isRegisterModal, setIsRegisterModal] = useState<boolean | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  // ОДИН useEffect для всієї логіки авторизації
  useEffect(() => {
    const updateHeader = () => {
      setUserName(getUserName());
    };

    updateHeader(); // Перевірка при завантаженні сторінки

    window.addEventListener("auth-change", updateHeader);
    return () => window.removeEventListener("auth-change", updateHeader);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);
  const openModal = () => setIsOpenModal(true);
  const closeModal = () => setIsOpenModal(false);
  const registerModal = () => setIsRegisterModal(true);
  const loginModal = () => setIsRegisterModal(false);

  const handleLogout = () => {
    localStorage.removeItem("userName");
    document.cookie = "accessToken=; Max-Age=0; path=/;";
    setUserName(null);
    closeMenu();
    window.location.href = "/";
  };

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) closeMenu();
  };

  useEffect(() => {
    const overflowValue = isOpen ? "hidden" : "";
    document.body.style.overflow = overflowValue;
    document.documentElement.style.overflow = overflowValue;
  }, [isOpen]);

  return (
    <>
      <header className={css.header}>
        <div className={css.container}>
          <Link href="/" className={css.logo} onClick={closeMenu}>
            <span className={css.icon}>🚀</span>
            <span className={css.title}>
              Speed<span className={css.titleSmall}>hub</span>
            </span>
          </Link>

          <nav className={css.desktopNav}>
            <ul className={css.desktopNavList}>
              <li>
                <Link className={css.navLink} href="/">
                  Головна
                </Link>
              </li>
              <li>
                <Link className={css.navLink} href="/lectures">
                  Лекції
                </Link>
              </li>
              <li>
                <Link className={css.navLink} href="/tests">
                  Тести
                </Link>
              </li>
              <li>
                <Link className={css.navLink} href="/mistakes">
                  Помилки
                </Link>
              </li>
            </ul>
          </nav>

          <div className={css.rightPanel}>
            <div className={css.desktopButtons}>
              {userName ? (
                <div className={css.userWrapper}>
                  <span className={css.welcomeText}>Привіт, {userName}!</span>
                  <button
                    type="button"
                    className={`${css.button} ${css.logoutBtn}`}
                    onClick={handleLogout}
                  >
                    Вийти
                  </button>
                </div>
              ) : (
                <ul className={css.desktopButtonsList}>
                  <li>
                    <button
                      type="button"
                      className={`${css.button} ${css.loginButton}`}
                      onClick={() => {
                        loginModal();
                        openModal();
                      }}
                    >
                      Увійти
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className={`${css.button} ${css.registerButton}`}
                      onClick={() => {
                        registerModal();
                        openModal();
                      }}
                    >
                      Зареєструватись
                    </button>
                  </li>
                </ul>
              )}
            </div>

            <button
              type="button"
              className={css.burgerBtn}
              onClick={toggleMenu}
              aria-label="Меню"
            >
              {isOpen ? (
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              ) : (
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              )}
            </button>
          </div>
        </div>

        {isOpen && (
          <>
            <div className={css.backdrop} onClick={handleBackdropClick}></div>
            <div className={css.drawer}>
              <div className={css.drawerContent}>
                <nav>
                  <ul className={css.mobileNavList}>
                    <li>
                      <Link
                        className={css.navLink}
                        href="/"
                        onClick={closeMenu}
                      >
                        Головна
                      </Link>
                    </li>
                    <li>
                      <Link
                        className={css.navLink}
                        href="/lectures"
                        onClick={closeMenu}
                      >
                        Лекції
                      </Link>
                    </li>
                    <li>
                      <Link
                        className={css.navLink}
                        href="/tests"
                        onClick={closeMenu}
                      >
                        Тести
                      </Link>
                    </li>
                    <li>
                      <Link
                        className={css.navLink}
                        href="/mistakes"
                        onClick={closeMenu}
                      >
                        Робота над помилками
                      </Link>
                    </li>
                  </ul>
                </nav>

                <div className={css.mobileOnlyButtons}>
                  {userName ? (
                    <button
                      onClick={handleLogout}
                      className={`${css.button} ${css.loginButton} ${css.fullWidthBtn}`}
                    >
                      Вийти ({userName})
                    </button>
                  ) : (
                    <ul className={css.mobileButtonsList}>
                      <li>
                        <button
                          type="button"
                          className={`${css.button} ${css.loginButton} ${css.fullWidthBtn}`}
                          onClick={() => {
                            closeMenu();
                            loginModal();
                            openModal();
                          }}
                        >
                          Увійти
                        </button>
                      </li>
                      <li>
                        <button
                          type="button"
                          className={`${css.button} ${css.registerButton} ${css.fullWidthBtn}`}
                          onClick={() => {
                            closeMenu();
                            registerModal();
                            openModal();
                          }}
                        >
                          Зареєструватись
                        </button>
                      </li>
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </header>

      {isopenModal && (
        <ModalSection onClose={closeModal}>
          {isRegisterModal ? (
            <RegisterForm
              onClose={closeModal}
              onOpen={() => {
                closeModal();
                loginModal();
                openModal();
              }}
            />
          ) : (
            <LoginForm
              onClose={closeModal}
              onOpen={() => {
                closeModal();
                registerModal();
                openModal();
              }}
            />
          )}
        </ModalSection>
      )}
    </>
  );
};

export default Header;
