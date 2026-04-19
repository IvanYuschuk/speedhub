"use client";

import React from "react";
import Link from "next/link";
import css from "./NotFound.module.css";

export default function NotFound() {
  return (
    <main className={css.container}>
      <div className={css.content}>
        <div className={css.errorCode}>
          <span>4</span>
          <div className={css.roadSign}>
            <div className={css.signInner}>
              <div className={css.bar}></div>
            </div>
          </div>
          <span>4</span>
        </div>

        <h1 className={css.title}>Маршрут не знайдено</h1>
        <p className={css.text}>
          Схоже, ви звернули не туди. Сторінка, яку ви шукаєте, тимчасово
          закрита на ремонт або ніколи не існувала.
        </p>

        <div className={css.actions}>
          <Link href="/" className={css.homeBtn}>
            Повернутися на головну
          </Link>
          <button onClick={() => window.history.back()} className={css.backBtn}>
            Назад
          </button>
        </div>
      </div>

      <div className={css.bgDecor}>
        <div className={css.line}></div>
        <div className={css.line}></div>
        <div className={css.line}></div>
      </div>
    </main>
  );
}
