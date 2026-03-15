'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link'; // або 'react-router-dom'
import css from './Header.module.css';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);
    const closeMenu = () => setIsOpen(false);

    // Блокуємо скрол сторінки, коли мобільне/планшетне меню відкрите
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    return (
        <header className={css.header}>
            <div className={css.container}>
                {/* =========================================
                    1. ЛОГОТИП (Завжди видимий)
                    ========================================= */}
                <Link href="/" className={css.logo} onClick={closeMenu}>
                    <span className={css.icon}>🚀</span>
                    <span className={css.title}>Speed<span className={css.titleSmall}>hub</span></span>
                </Link>

                {/* =========================================
                    2. ДЕСКТОПНА НАВІГАЦІЯ (Видима тільки на ПК)
                    ========================================= */}
                <nav className={css.desktopNav}>
                    <ul className={css.desktopNavList}>
                        <li><Link className={css.navLink} href="/">Головна</Link></li>
                        <li><Link className={css.navLink} href="/lectures">Лекції</Link></li>
                        <li><Link className={css.navLink} href="/about">Про нас</Link></li>
                        <li><Link className={css.navLink} href="/mistakes">Робота над помилками</Link></li>
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
                                <button type="button" className={`${css.button} ${css.loginButton}`}>Увійти</button>
                            </li>
                            <li>
                                <button type="button" className={`${css.button} ${css.registerButton}`}>Зареєструватись</button>
                            </li>
                        </ul>
                    </div>

                    {/* Бургер-кнопка (Видима на Мобілці та Планшеті) */}
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

            {/* =========================================
                4. ВИЇЗНЕ МЕНЮ (Для Мобілок та Планшетів)
                ========================================= */}
            {isOpen && (
                <>
                    {/* Темний фон позаду меню */}
                    <div className={css.backdrop} onClick={closeMenu}></div>
                    
                    {/* Сама панель меню */}
                    <div className={css.drawer}>
                        <div className={css.drawerContent}>
                            
                            {/* Навігація в мобільному/планшетному меню */}
                            <nav>
                                <ul className={css.mobileNavList}>
                                    <li><Link className={css.navLink} href="/" onClick={closeMenu}>Головна</Link></li>
                                    <li><Link className={css.navLink} href="/lectures" onClick={closeMenu}>Лекції</Link></li>
                                    <li><Link className={css.navLink} href="/about" onClick={closeMenu}>Про нас</Link></li>
                                    <li><Link className={css.navLink} href="/mistakes" onClick={closeMenu}>Робота над помилками</Link></li>
                                </ul>
                            </nav>

                            {/* Кнопки авторизації (Показуються ТІЛЬКИ на мобілці, на всю ширину) */}
                            <div className={css.mobileOnlyButtons}>
                                <ul className={css.mobileButtonsList}>
                                    <li>
                                        <button type="button" className={`${css.button} ${css.loginButton} ${css.fullWidthBtn}`} onClick={closeMenu}>
                                            Увійти
                                        </button>
                                    </li>
                                    <li>
                                        <button type="button" className={`${css.button} ${css.registerButton} ${css.fullWidthBtn}`} onClick={closeMenu}>
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
    );
};

export default Header;