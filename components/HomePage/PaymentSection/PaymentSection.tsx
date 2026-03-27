import React from 'react';
import Link from 'next/link';
import css from './PaymentSection.module.css';

const PaymentSection = () => {
    return (
        <section className={css.section}>
            <div className={css.container}>
                <div className={css.ctaCard}>
                    
                    {/* Іконка або бейдж для привернення уваги */}
                    <div className={css.iconWrapper}>
                        ⭐
                    </div>

                    <h2 className={css.heading}>
                        Підніми підготовку на новий рівень з <span className={css.highlight}>платною підпискою</span>
                    </h2>
                    
                    <p className={css.text}>
                        <strong>Переваги платної підписки:</strong> завдяки преміум-доступу ти можеш працювати над помилками — бачити свої помилки в тестах і отримувати персональні рекомендації для виправлення слабких місць. Крім того, аналітика прогресу дозволяє відстежувати твої сильні та слабкі теми через графіки та статистику, щоб ти чітко бачив свій реальний прогрес і міг ефективно підготуватися до іспиту.
                    </p>

                    
                    <Link href="/" className={css.button}>
                        Оформити підписку
                    </Link>

                </div>
            </div>
        </section>
    );
};

export default PaymentSection;