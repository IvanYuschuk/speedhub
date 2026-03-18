import css from "./RegisterForm.module.css";

interface RegisterFormProps {
    onClose: () => void;
}

export default function RegisterForm({onClose}: RegisterFormProps) {
    return (
        <>
            <button type="button" className={css.closeBtn} onClick={onClose} aria-label="Закрити">
                    ✕
                </button>

                <h2 className={css.title}>Реєстрація</h2>
                <p className={css.subtitle}>Створіть акаунт, щоб розпочати навчання.</p>

                <form className={css.form}>
                    <div className={css.inputGroup}>
                        <label className={css.label} htmlFor="reg-name">Як тебе звати?</label>
                        <input 
                            type="text" 
                            id="reg-name" 
                            className={css.input} 
                            placeholder="Як до вас звертатись?" 
                            required 
                        />
                    </div>

                    <div className={css.inputGroup}>
                        <label className={css.label} htmlFor="reg-email">Електронна пошта</label>
                        <input 
                            type="email" 
                            id="reg-email" 
                            className={css.input} 
                            placeholder="mail@example.com" 
                            required 
                        />
                    </div>

                    <div className={css.inputGroup}>
                        <label className={css.label} htmlFor="reg-password">Пароль</label>
                        <input 
                            type="password" 
                            id="reg-password" 
                            className={css.input} 
                            placeholder="Створіть надійний пароль" 
                            required 
                        />
                    </div>

                    <button type="submit" className={css.submitBtn}>Зареєструватись</button>
                </form>

                <p className={css.switchText}>
                    Вже є акаунт?{' '}
                    <button type="button" className={css.switchBtn} onClick={() => {}}>
                        Увійти
                    </button>
                </p>
        </>
    )
};