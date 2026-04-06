"use client";

import React from "react";
import css from "./ConfirmModal.module.css";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  type?: "danger" | "success" | "info";
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Підтвердити",
  type = "info",
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className={css.overlay} onClick={onCancel}>
      <div className={css.modal} onClick={(e) => e.stopPropagation()}>
        <h3 className={css.title}>{title}</h3>
        <p className={css.message}>{message}</p>

        <div className={css.actions}>
          <button className={css.cancelBtn} onClick={onCancel}>
            Скасувати
          </button>
          <button
            className={`${css.confirmBtn} ${css[type]}`}
            onClick={() => {
              onConfirm();
              onCancel();
            }}
          >
            {confirmText || "Підтвердити"}
          </button>
        </div>
      </div>
    </div>
  );
}
