"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminPage/AdminSidebar/AdminSidebar";
import AdminHeader from "@/components/AdminPage/AdminHeader/AdminHeader";
import UserTable from "@/components/AdminPage/UserTable/UserTable";
import TestManager from "@/components/AdminPage/TestManager/TestManager";
import { adminService } from "@/app/services/adminService";
import { User } from "@/types/user";
import styles from "./AdminPage.module.css";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("users");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingAuth, setCheckingAuth] = useState(true); // Новий стейт завантаження авторизації
  const router = useRouter();

  // 1. Перевірка авторизації з невеликим "запасом" часу
  useEffect(() => {
    const checkAuth = () => {
      const storedToken =
        localStorage.getItem("token") || localStorage.getItem("accessToken");
      const role = localStorage.getItem("role");

      if (role === "admin" && storedToken) {
        setToken(storedToken);
        setIsAuthorized(true);
        setCheckingAuth(false);
      } else {
        // Якщо даних немає, даємо шансу (буває затримка запису на Vercel)
        const timeout = setTimeout(() => {
          const retryToken =
            localStorage.getItem("token") ||
            localStorage.getItem("accessToken");
          const retryRole = localStorage.getItem("role");

          if (retryRole === "admin" && retryToken) {
            setToken(retryToken);
            setIsAuthorized(true);
            setCheckingAuth(false);
          } else {
            router.push("/");
          }
        }, 500);
        return () => clearTimeout(timeout);
      }
    };

    checkAuth();
  }, [router]);

  // 2. Функція завантаження користувачів
  const loadUsers = useCallback(async (currentIdToken: string) => {
    try {
      setLoading(true);
      const data = await adminService.getAllUsers(currentIdToken);
      setUsers(data || []);
    } catch (err) {
      console.error("Помилка завантаження користувачів:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 3. Слідкуємо за готовністю токена
  useEffect(() => {
    if (isAuthorized && token && activeTab === "users") {
      loadUsers(token);
    }
  }, [isAuthorized, token, activeTab, loadUsers]);

  // Поки перевіряємо - показуємо пустий екран або спінер
  if (checkingAuth) {
    return <div className={styles.loadingContainer}>Перевірка доступу...</div>;
  }

  // Якщо перевірка пройшла, але ми не авторизовані (про всяк випадок)
  if (!isAuthorized || !token) return null;

  const total = users.length;
  const premiumCount = users.filter(
    (u) => u.subscriptionType === "premium",
  ).length;

  return (
    <div className={styles.adminContainer}>
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className={styles.mainContent}>
        <AdminHeader
          title={
            activeTab === "users"
              ? "Керування користувачами"
              : activeTab === "tests"
                ? "База питань ПДР"
                : "Редактор лекцій"
          }
          totalUsers={total}
          premiumUsers={premiumCount}
        />

        {activeTab === "users" && (
          <UserTable
            users={users}
            loading={loading}
            refreshData={() => loadUsers(token)}
            token={token}
          />
        )}

        {activeTab === "tests" && <TestManager token={token} />}

        {activeTab === "lectures" && (
          <div className={styles.placeholderCard}>
            <h3>Списки лекцій будуть тут...</h3>
          </div>
        )}
      </main>
    </div>
  );
}
