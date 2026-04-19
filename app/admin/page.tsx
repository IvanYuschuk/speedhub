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
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token") || localStorage.getItem("accessToken");

    if (role === "admin" && token && token !== "undefined") {
      setIsAuthorized(true);
    } else {
      router.push("/");
    }
  }, [router]);

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllUsers();
      setUsers(data || []);
    } catch (err) {
      console.error("Fetch error:", err);
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
            refreshData={loadUsers}
          />
        )}
        {activeTab === "tests" && <TestManager />}
      </main>
    </div>
  );
}