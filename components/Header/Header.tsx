'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link'; 
import css from './Header.module.css';
import ModalSection from '../ModalSection/ModalSection';
import RegisterForm from '../RegisterForm/RegisterForm';
import LoginForm from '../LoginForm/LoginForm';
import { usePathname } from 'next/navigation';

const Header = () => {

    const pathname = usePathname();
    const desktopNavLinks = [
        { name: "Головна", href: "/" },
        { name: "Лекції", href: "/lectures" },
        { name: "Тести", href: "/tests" },
        { name: "Робота над помилками", href: "/mistakes" }
    ];


    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);
    const closeMenu = () => setIsOpen(false);

    const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
            closeMenu();
        }
    }

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
             document.documentElement.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
             document.documentElement.style.overflow = '';
        };
    }, [isOpen]);

    const [isopenModal, setIsOpenModal] = useState(false);

    const openModal = () => setIsOpenModal(true);
    const closeModal = () => setIsOpenModal(false)

    const [isRegisterModal, setIsRegisterModal] = useState<boolean | null>(null);

    const registerModal = () => setIsRegisterModal(true);
    const loginModal = () => setIsRegisterModal(false);

    return (
        <>
        <header className={css.header}>
            <div className={css.container}>

                <Link href="/" className={css.logo} onClick={closeMenu}>
                    <span className={css.icon}>🚀</span>
                    <span className={css.title}>Speed<span className={css.titleSmall}>hub</span></span>
                </Link>

                <nav className={css.desktopNav}>
                    <ul className={css.desktopNavList}>
                       {desktopNavLinks.map((link) => {
                           const isActive = link.href === pathname;
                           return (
                               <li key={link.name}>
                                   <Link className={`${css.navLink} ${isActive ? css.active : ""}`} href={link.href}>{ link.name }</Link>
                               </li>
                           );
                       })}
                    </ul>
                </nav>

                {/* =========================================
                    3. ПРАВА ПАНЕЛЬ (Кнопки + Бургер)
                    ========================================= */}
                <div className={css.rightPanel}>
                    {/* Кнопки в хедері (Видимі на Планшеті та ПК) */}
                    <div className={css.desktopButtons}>
                        <ul className={css.desktopButtonsList}>
                            <li>
                                    <button type="button" className={`${css.button} ${css.loginButton}`} onClick={() => {
                                        closeMenu();
                                        loginModal();
                                        openModal();
                                    }
                                    }>Увійти</button>
                            </li>
                            <li>
                                    <button type="button" className={`${css.button} ${css.registerButton}`} onClick={() => {
                                        closeMenu();
                                        registerModal();
                                        openModal();
                                }}>Зареєструватись</button>
                            </li>
                        </ul>
                    </div>

                    <button type="button" className={css.burgerBtn} onClick={toggleMenu} aria-label="Меню">
                        {isOpen ? (
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        ) : (
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                                    <li><Link className={css.navLink} href="/" onClick={closeMenu}>Головна</Link></li>
                                    <li><Link className={css.navLink} href="/lectures" onClick={closeMenu}>Лекції</Link></li>
                                    <li><Link className={css.navLink} href="/tests" onClick={closeMenu}>Тести</Link></li>
                                    <li><Link className={css.navLink} href="/mistakes" onClick={closeMenu}>Робота над помилками</Link></li>
                                </ul>
                            </nav>

                            {/* Кнопки авторизації (Показуються ТІЛЬКИ на мобілці, на всю ширину) */}
                            <div className={css.mobileOnlyButtons}>
                                <ul className={css.mobileButtonsList}>
                                    <li>
                                            <button type="button" className={`${css.button} ${css.loginButton} ${css.fullWidthBtn}`} onClick={() => {
                                                closeMenu();
                                                loginModal();
                                                openModal();
                                        }}>
                                            Увійти
                                        </button>
                                    </li>
                                    <li>
                                            <button type="button" className={`${css.button} ${css.registerButton} ${css.fullWidthBtn}`} onClick={() => {
                                                closeMenu();
                                                registerModal();
                                                openModal();
                                        }}>
                                            Зареєструватись
                                        </button>
                                    </li>
                                </ul>
                            </div>
                            
                        </div>
                    </div>
                </>
            )}
            </header>
            {isopenModal && <ModalSection onClose={closeModal}>
                {isRegisterModal ? <RegisterForm onClose={closeModal} onOpen={() => {
                    closeModal();
                    loginModal();
                    openModal();
                }}/> : <LoginForm onClose={closeModal} onOpen={() => {
                    closeModal();
                    registerModal();
                    openModal();
                }}/>}
            </ModalSection>}
        </>
    );
};

export default Header;