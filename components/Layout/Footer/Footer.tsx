import React from 'react';
import Link from 'next/link'; // або 'react-router-dom'
import css from './Footer.module.css';

const Footer = () => {
    // Автоматично беремо поточний рік, щоб не міняти його вручну кожного разу
    const currentYear = new Date().getFullYear();

    return (
        <footer className={css.footer}>
            <div className={css.container}>
                
                {/* Логотип (Посилання) */}
                <Link href="/" className={css.logo}>
                    <span className={css.icon}>🚀</span>
                    <span className={css.title}>Speed<span className={css.titleSmall}>hub</span></span>
                </Link>

                {/* Блок з текстами (Без посилань, як ти і просив) */}
                <ul className={css.textList}>
                    <li>Careers</li>
                    <li>Privacy Policy</li>
                    <li>Terms & Conditions</li>
                </ul>

                {/* Копірайт */}
                <div className={css.copyright}>
                    © {currentYear}
                </div>

            </div>
        </footer>
    );
};

export default Footer;