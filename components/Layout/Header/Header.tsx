"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import css from "./Header.module.css";
import ModalSection from "../../Modals/ModalSection/ModalSection";
import RegisterForm from "../../Modals/RegisterForm/RegisterForm";
import LoginForm from "../../Modals/LoginForm/LoginForm";
import UserAccount from "../../Modals/UserAccount/UserAccount";
import { usePathname } from "next/navigation";
import { getUserName } from "@/app/utils/auth";

const Header = () => {
  const pathname = usePathname();
  const [userName, setUserName] = useState<string | null>(null);
  const [isUserAccountOpen, setIsUserAccountOpen] = useState(false);

  const desktopNavLinks = [
    { name: "Головна", href: "/" },
    { name: "Лекції", href: "/lectures" },
    { name: "Тести", href: "/tests" },
    { name: "Робота над помилками", href: "/mistakes" },
  ];

  // Слідкуємо за станом авторизації
  useEffect(() => {
    const updateHeader = () => {
      setUserName(getUserName());
    };
    updateHeader();
    window.addEventListener("auth-change", updateHeader);
    return () => window.removeEventListener("auth-change", updateHeader);
  }, []);

  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const [isopenModal, setIsOpenModal] = useState(false);
  const openModal = () => setIsOpenModal(true);
  const closeModal = () => setIsOpenModal(false);

  const [isRegisterModal, setIsRegisterModal] = useState<boolean | null>(null);
  const registerModal = () => setIsRegisterModal(true);
  const loginModal = () => setIsRegisterModal(false);

  // Закриття модалки акаунта при кліку в будь-якому іншому місці
  useEffect(() => {
    if (!isUserAccountOpen) return;
    const handleClickOutside = () => setIsUserAccountOpen(false);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, [isUserAccountOpen]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      closeMenu();
    }
  };

  useEffect(() => {
    const overflow = isOpen ? "hidden" : "";
    document.body.style.overflow = overflow;
    document.documentElement.style.overflow = overflow;
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
              {desktopNavLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    className={`${css.navLink} ${link.href === pathname ? css.active : ""}`}
                    href={link.href}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className={css.rightPanel}>
            <div className={css.desktopButtons}>
              {userName ? (
                /* Кнопка акаунта з обгорткою для позиціювання */
                <div className={css.userMenuContainer}>
                  <button
                    type="button"
                    className={css.userBtn}
                    onClick={(e) => {
                      e.stopPropagation(); // Зупиняємо спливання кліку
                      e.nativeEvent.stopImmediatePropagation();
                      setIsUserAccountOpen(!isUserAccountOpen);
                    }}
                  >
                    {userName}
                    <svg
                      className={`${css.arrow} ${isUserAccountOpen ? css.arrowRotated : ""}`}
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>

                  {isUserAccountOpen && (
                    /* Зупиняємо клік всередині модалки, щоб вона не закривалася сама */
                    <div onClick={(e) => e.stopPropagation()}>
                      <UserAccount
                        onClose={() => setIsUserAccountOpen(false)}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <ul className={css.desktopButtonsList}>
                  <li>
                    <button
                      type="button"
                      className={`${css.button} ${css.loginButton}`}
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
                      className={`${css.button} ${css.registerButton}`}
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

            <button
              type="button"
              className={css.burgerBtn}
              onClick={toggleMenu}
            >
              {isOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Мобільне меню */}
        {isOpen && (
          <div className={css.drawer}>
            <div className={css.drawerContent}>
              <nav>
                <ul className={css.mobileNavList}>
                  {desktopNavLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        className={css.navLink}
                        href={link.href}
                        onClick={closeMenu}
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className={css.mobileOnlyButtons}>
                {userName ? (
                  <button
                    className={`${css.button} ${css.loginButton} ${css.fullWidthBtn}`}
                    onClick={() => {
                      setIsUserAccountOpen(true);
                      closeMenu();
                    }}
                  >
                    Мій кабінет ({userName})
                  </button>
                ) : (
                  <ul className={css.mobileButtonsList}>
                    <li>
                      <button
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
