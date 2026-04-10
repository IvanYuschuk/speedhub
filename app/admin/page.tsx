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

  const router = useRouter();

  useEffect(() => {
    const data = localStorage.getItem("fullUserData");
    
    const storedRole = localStorage.getItem("role");

    if (data || storedRole) {
      try {
        const user = data ? JSON.parse(data) : null;
        const role = user?.role || storedRole;

        if (role === "admin") {
          setIsAuthorized(true);
          setToken(localStorage.getItem("token") || "authorized");
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

  useEffect(() => {
    if (isAuthorized && activeTab === "users") {
      loadUsers();
    }
  }, [isAuthorized, activeTab, loadUsers]);

  if (!isAuthorized) return null;

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
              : activeTab === "lectures"
                ? "Редактор лекцій"
                : "База питань ПДР"
          }
          totalUsers={total}
          premiumUsers={premiumCount}
        />

        {activeTab === "users" && (
          <UserTable users={users} loading={loading} refreshData={loadUsers} />
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
