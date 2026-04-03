"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminPage/AdminSidebar/AdminSidebar";
import AdminHeader from "@/components/AdminPage/AdminHeader/AdminHeader";
import UserTable from "@/components/AdminPage/UserTable/UserTable";
import { adminService } from "@/app/services/adminService";
import { User } from "@/types/user";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("users");
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Стан для даних користувачів
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  // 1. Перевірка авторизації
  useEffect(() => {
    const data = localStorage.getItem("fullUserData");
    if (data) {
      try {
        const user = JSON.parse(data);
        if (user.role === "admin") {
          setIsAuthorized(true);
        } else {
          router.push("/");
        }
      } catch (error) {
        router.push("/");
      }
    } else {
      router.push("/");
    }
  }, [router]);

  // 2. Функція завантаження користувачів
  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error("Помилка завантаження користувачів", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Завантажуємо дані, якщо вкладка "users" і ми авторизовані
  useEffect(() => {
    if (isAuthorized && activeTab === "users") {
      loadUsers();
    }
  }, [isAuthorized, activeTab, loadUsers]);

  if (!isAuthorized) return null;

  // 3. Розрахунок статистики для хедера
  const total = users.length;
  const premiumCount = users.filter(
    (u) => u.subscriptionType === "premium",
  ).length;

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "var(--section-bg)",
        color: "var(--section-text-title)",
      }}
    >
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main
        style={{
          flex: 1,
          padding: "40px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <AdminHeader
          title={
            activeTab === "users"
              ? "Керування користувачами"
              : activeTab === "lectures"
                ? "Редактор лекцій"
                : "Тести та ПДР"
          }
          // Передаємо реальні цифри в пропси хедера
          totalUsers={total}
          premiumUsers={premiumCount}
        />

        {activeTab === "users" && (
          <UserTable users={users} loading={loading} refreshData={loadUsers} />
        )}

        {activeTab === "lectures" && (
          <div
            style={{
              padding: "20px",
              background: "var(--section-card-bg)",
              borderRadius: "12px",
              border: "1px solid var(--section-card-border)",
            }}
          >
            <h3>Списки лекцій будуть тут...</h3>
          </div>
        )}

        {activeTab === "tests" && (
          <div
            style={{
              padding: "20px",
              background: "var(--section-card-bg)",
              borderRadius: "12px",
              border: "1px solid var(--section-card-border)",
            }}
          >
            <h3>Керування тестами ПДР...</h3>
          </div>
        )}
      </main>
    </div>
  );
}
