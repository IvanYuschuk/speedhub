"use client";

import React from "react";
import css from "./AdminSidebar.module.css";

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function AdminSidebar({
  activeTab,
  setActiveTab,
}: AdminSidebarProps) {
  const menuItems = [
    { id: "users", label: "Користувачі", icon: "👤" },
    { id: "lectures", label: "Лекції", icon: "📚" },
    { id: "tests", label: "Тести", icon: "📝" },
  ];

  return (
    <aside className={css.sidebar}>
      <h2 className={css.logo}>
        Speed<span className={css.logoAccent}>hub</span> Admin
      </h2>
      <nav className={css.nav}>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`${css.navBtn} ${activeTab === item.id ? css.active : ""}`}
          >
            <span className={css.icon}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
