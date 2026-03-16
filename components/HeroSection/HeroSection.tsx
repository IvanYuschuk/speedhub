import React from 'react';
import Image from 'next/image';
import Link from 'next/link'; // або 'react-router-dom'
import css from './HeroSection.module.css'; // ваш шлях до стилів

const HeroSection = () => {
    return (
        <section className={css.hero}>
            <div className={css.container}>
                <div className={css.heroContent}>
                    
                    {/* Ліва колонка: Текст та Кнопка */}
                    <div className={css.heroText}>
                        <h1 className={css.heroTitle}>Твоя швидка дорога до прав</h1>
                        <p className={css.heroSubtitle}>Сучасна онлайн-платформа для вивчення ПДР та ефективної підготовки до теоретичного іспиту</p>
                        <Link href="/tests" className={`${css.button} ${css.heroButton}`}>пройти тест</Link>
                    </div>

                    {/* Права колонка: Зображення / Ілюстрація */}
                    <div className={css.heroImageWrapper}>
                        <div className={css.heroImageContainer}>
                            <Image src="/images/HeroSection.jpeg" alt="Успішне навчання та успіх" className={css.heroImage} width={640} height={360}/>
                            {/* Додамо візуальний елемент успіху (наприклад, іконку) */}
                            <div className={css.heroBadgeContainer}>
                                <div className={css.heroBadge}>
                                    <span className={css.heroBadgeIcon}>✅</span>
                                    <p className={css.heroBadgeText}>Тест пройдено!</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default HeroSection;