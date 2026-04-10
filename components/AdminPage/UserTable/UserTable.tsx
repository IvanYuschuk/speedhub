"use client";

import React, { useState } from "react";
import { adminService, UpdateUserData } from "@/app/services/adminService";
import { User } from "@/types/user";
import ConfirmModal from "../../Modals/ConfirmModal/ConfirmModal";
import UserStatsModal from "../UserStatsModal/UserStatsModal";
import css from "./UserTable.module.css";

interface UserTableProps {
  users: User[];
  loading: boolean;
  refreshData: () => Promise<void>;
  token: string | null; // Додано токен у пропси
}

export default function UserTable({
  users,
  loading,
  refreshData,
  token,
}: UserTableProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    type: "info" | "success" | "danger";
    confirmText?: string;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
    type: "info",
    confirmText: "Підтвердити",
  });

  const closeModal = () =>
    setModalConfig((prev) => ({ ...prev, isOpen: false }));

  const openModal = (
    title: string,
    message: string,
    onConfirm: () => void,
    type: "info" | "success" | "danger" = "info",
    confirmText: string = "Підтвердити",
  ) => {
    setModalConfig({
      isOpen: true,
      title,
      message,
      onConfirm,
      type,
      confirmText,
    });
  };

  const handleRoleChange = (userId: string, newRole: "user" | "admin") => {
    openModal(
      "Зміна прав",
      `Змінити роль на ${newRole.toUpperCase()}?`,
      async () => {
        try {
          await adminService.updateUser(userId, { role: newRole }, token);
          await refreshData();
        } catch (err) {
          console.error(err);
        }
      },
    );
  };

  const handleSubscriptionChange = (
    userId: string,
    newType: "free" | "premium",
  ) => {
    openModal(
      "Зміна підписки",
      `Змінити статус на ${newType.toUpperCase()}?`,
      async () => {
        try {
          const updateData: UpdateUserData = { subscriptionType: newType };
          if (newType === "free") {
            updateData.subscriptionExpires = null;
          } else {
            const date = new Date();
            date.setMonth(date.getMonth() + 3);
            updateData.subscriptionExpires = date.toISOString();
          }
          await adminService.updateUser(userId, updateData, token);
          await refreshData();
        } catch (err) {
          console.error(err);
        }
      },
    );
  };

  const handleDateChange = (userId: string, newDate: string) => {
    if (!newDate) return;
    openModal(
      "Зміна терміну",
      `Встановити нову дату: ${new Date(newDate).toLocaleDateString("uk-UA")}?`,
      async () => {
        try {
          await adminService.updateUser(
            userId,
            { subscriptionExpires: newDate },
            token,
          );
          await refreshData();
        } catch (err) {
          console.error(err);
        }
      },
    );
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    openModal(
      "Видалення",
      `Видалити користувача ${userName}?`,
      async () => {
        try {
          await adminService.deleteUser(userId, token);
          await refreshData();
        } catch (err) {
          console.error(err);
        }
      },
      "danger",
      "Видалити",
    );
  };

  if (loading) return <div className={css.loadingState}>Завантаження...</div>;

  return (
    <>
      <div className={css.tableWrapper}>
        <table className={css.table}>
          <thead>
            <tr>
              <th className={css.th}>Користувач</th>
              <th className={css.th}>Деталі</th>
              <th className={css.th}>Роль</th>
              <th className={css.th}>Підписка</th>
              <th className={css.th}>Дії</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className={css.tr}>
                <td className={css.td}>
                  <div className={css.userName}>
                    {user.name} {user.surname}
                  </div>
                  <div className={css.userEmail}>{user.email}</div>
                </td>
                <td className={css.td}>
                  <button
                    className={css.statsBtn}
                    onClick={() => setSelectedUser(user)}
                  >
                    📊 Перегляд
                  </button>
                </td>
                <td className={css.td}>
                  <select
                    className={
                      user.role === "admin"
                        ? css.roleSelectAdmin
                        : css.roleSelect
                    }
                    value={user.role}
                    onChange={(e) =>
                      handleRoleChange(
                        user._id,
                        e.target.value as "user" | "admin",
                      )
                    }
                  >
                    <option value="user">USER</option>
                    <option value="admin">ADMIN</option>
                  </select>
                </td>
                <td className={css.td}>
                  <div className={css.subscriptionGroup}>
                    <select
                      className={
                        user.subscriptionType === "premium"
                          ? css.subSelectPremium
                          : css.subSelect
                      }
                      value={user.subscriptionType}
                      disabled={user.role === "admin"}
                      onChange={(e) =>
                        handleSubscriptionChange(
                          user._id,
                          e.target.value as "free" | "premium",
                        )
                      }
                    >
                      <option value="free">FREE</option>
                      <option value="premium">PREMIUM</option>
                    </select>

                    {user.subscriptionType === "premium" && (
                      <input
                        type="date"
                        className={css.dateInput}
                        disabled={user.role === "admin"}
                        value={
                          user.subscriptionExpires
                            ? user.subscriptionExpires.split("T")[0]
                            : ""
                        }
                        onChange={(e) =>
                          handleDateChange(user._id, e.target.value)
                        }
                      />
                    )}
                  </div>
                </td>
                <td className={css.td}>
                  <button
                    className={css.deleteBtn}
                    onClick={() =>
                      handleDeleteUser(user._id, `${user.name} ${user.surname}`)
                    }
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        onConfirm={modalConfig.onConfirm}
        onCancel={closeModal}
        type={modalConfig.type}
        confirmText={modalConfig.confirmText}
      />

      <UserStatsModal
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
      />
    </>
  );
}
