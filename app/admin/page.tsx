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
    // Беремо токен відразу
    const storedToken = localStorage.getItem("token") || localStorage.getItem("accessToken");
    const role = localStorage.getItem("role");

    if (role === "admin" && storedToken && storedToken !== "undefined") {
      setToken(storedToken);
      setIsAuthorized(true);
    } else {
      router.push("/");
    }
  }, [router]);

  const loadUsers = useCallback(async (currentIdToken: string) => {
    if (!currentIdToken || currentIdToken === "undefined") return;
    try {
      setLoading(true);
      const data = await adminService.getAllUsers(currentIdToken);
      setUsers(data || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthorized && token && activeTab === "users") {
      loadUsers(token);
    }
  }, [isAuthorized, token, activeTab, loadUsers]);

  if (!isAuthorized || !token) return null;

  return (
    <div className={styles.adminContainer}>
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className={styles.mainContent}>
        <AdminHeader
          title={activeTab === "users" ? "Користувачі" : "Тести"}
          totalUsers={users.length}
          premiumUsers={users.filter(u => u.subscriptionType === "premium").length}
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
      </main>
    </div>
  );
}