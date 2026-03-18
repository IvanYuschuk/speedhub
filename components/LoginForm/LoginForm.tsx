import css from "./LoginForm.module.css"

interface LoginFormProps {
    onClose: () => void;
    onOpen: () => void;
}

export default function LoginForm({ onClose, onOpen}: LoginFormProps) {
    return (
        <>
            <button type="button" className={css.closeBtn} onClick={onClose} aria-label="Закрити">
                    ✕
                </button>

                <h2 className={css.title}>Вхід</h2>
                <p className={css.subtitle}>З поверненням! Увійдіть до свого акаунта.</p>

                <form className={css.form}>
                    <div className={css.inputGroup}>
                        <label className={css.label} htmlFor="login-email">Електронна пошта</label>
                        <input 
                            type="email" 
                            id="login-email" 
                            className={css.input} 
                            placeholder="mail@example.com" 
                            required 
                        />
                    </div>

                    <div className={css.inputGroup}>
                        <label className={css.label} htmlFor="login-password">Пароль</label>
                        <input 
                            type="password" 
                            id="login-password" 
                            className={css.input} 
                            placeholder="Введіть ваш пароль" 
                            required 
                        />
                    </div>

                    <button type="submit" className={css.submitBtn}>Увійти</button>
                </form>

                <p className={css.switchText}>
                    Ще не зареєстровані?{' '}
                    <button type="button" className={css.switchBtn} onClick={onOpen}>
                        Створити акаунт
                    </button>
                </p>
        </>
    )
}