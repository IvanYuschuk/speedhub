"use client";

import React from "react";
import css from "./AdminHeader.module.css";

interface AdminHeaderProps {
  title: string;
  totalUsers: number;
  premiumUsers: number;
}

export default function AdminHeader({
  title,
  totalUsers,
  premiumUsers,
}: AdminHeaderProps) {
  return (
    <header className={css.header}>
      <h1 className={css.title}>{title}</h1>
      <div className={css.statsGroup}>
        <div className={css.statCard}>
          <span className={css.statLabel}>Всього:</span>
          <strong className={css.statValue}>{totalUsers}</strong>
        </div>
        <div className={css.statCard}>
          <span className={css.statLabel}>Преміум:</span>
          <strong className={`${css.statValue} ${css.premiumText}`}>
            {premiumUsers}
          </strong>
        </div>
      </div>
    </header>
  );
}
