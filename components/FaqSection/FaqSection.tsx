import React from 'react';
import css from './FaqSection.module.css';

// Масив з даними, щоб не дублювати HTML-код 6 разів
const featuresData = [
    {
        id: 1,
        icon: "⚡",
        title: "Швидкість навчання",
        text: "Оптимізована програма дозволяє засвоювати матеріал вдвічі швидше без втрати якості та розуміння."
    },
    {
        id: 2,
        icon: "🛠️",
        title: "Практичний підхід",
        text: "Мінімум сухої теорії. Ви одразу застосовуєте нові знання на реальних завданнях та проектах."
    },
    {
        id: 3,
        icon: "🔄",
        title: "Робота над помилками",
        text: "Унікальна система аналізу помилок допоможе зрозуміти слабкі місця та перетворити їх на сильні."
    },
    {
        id: 4,
        icon: "📚",
        title: "Актуальні матеріали",
        text: "Наші лекції постійно оновлюються, щоб ви вивчали лише найсучасніші технології та підходи."
    },
    {
        id: 5,
        icon: "⏱️",
        title: "Гнучкий графік",
        text: "Навчайтеся у власному темпі. Матеріали та тести доступні 24/7 з будь-якого пристрою."
    },
    {
        id: 6,
        icon: "🤝",
        title: "Спільнота та підтримка",
        text: "Отримайте доступ до закритого ком'юніті, де можна задати питання та знайти однодумців."
    }
];

const FaqSection = () => {
    return (
        <section className={css.section}>
            <div className={css.container}>
                
                {/* Заголовок секції */}
                <h2 className={css.heading}>
                    Чому саме <span className={css.highlight}>Speedhub?</span>
                </h2>

                {/* Сітка з картками */}
                <div className={css.grid}>
                    {featuresData.map((feature) => (
                        <div key={feature.id} className={css.card}>
                            <div className={css.iconWrapper}>
                                {feature.icon}
                            </div>
                            <h3 className={css.cardTitle}>{feature.title}</h3>
                            <p className={css.cardText}>{feature.text}</p>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default FaqSection;