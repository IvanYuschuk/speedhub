import css from "./DesctopHeader.module.css";
import Link from "next/link";

const DesctopHeader = () => {
    return (
        <header className={css.header}>
            <div className={css.container}>
                <Link href="/" className={css.logo}>
                    <span className={css.icon}>🚀</span>
                    <span className={css.title}>Speed<span className={css.titleSmall}>hub</span></span>
                </Link>
                <nav>
                    <ul className={css.navList}>
                        <li><Link className={css.navLink} href="/">Головна</Link></li>
                        <li><Link className={css.navLink} href="/lectures">Лекції</Link></li>
                        <li><Link className={css.navLink} href="/about">Про нас</Link></li>
                        <li><Link className={css.navLink} href="/mistakes">Робота над помилками</Link></li>
                    </ul>
                </nav>
                <ul className={css.buttons}>
                    <li><button type="button" className={`${css.button} ${css.loginButton}`}>Увійти</button></li>
                    <li><button type="button" className={ `${css.button} ${css.registerButton}` }>Зареєструватись</button></li>
                </ul>

            </div>
        </header >
    )
}

export default DesctopHeader