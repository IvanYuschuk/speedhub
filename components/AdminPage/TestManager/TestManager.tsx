"use client";

import React, { useEffect, useState, useCallback } from "react";
import { testAdminService, Question } from "@/app/services/testAdminService";
import styles from "./TestManager.module.css";

interface TestManagerProps {
  token: string | null;
}

export default function TestManager({ token }: TestManagerProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  const loadQuestions = useCallback(async () => {
    try {
      setLoading(true);
      const data = await testAdminService.getAllQuestions(token);
      setQuestions(data);
    } catch (err) {
      console.error("Помилка завантаження питань:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      loadQuestions();
    }
  }, [loadQuestions, token]);

  const handleDelete = async (id: string) => {
    if (confirm("Ви видаляєте питання ПДР. Продовжити?")) {
      try {
        await testAdminService.deleteQuestion(id, token);
        setQuestions((prev) => prev.filter((q) => q._id !== id));
      } catch (err) {
        alert("Не вдалося видалити питання");
      }
    }
  };

  if (loading)
    return <div className={styles.loading}>Завантаження питань...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h3>База питань ПДР ({questions.length})</h3>
        <button
          className={styles.addButton}
          onClick={() => alert("Відкриваємо форму створення...")}
        >
          + Створити питання
        </button>
      </header>

      <table className={styles.tableContainer}>
        <thead>
          <tr className={styles.tableHeader}>
            <th>Питання</th>
            <th>Категорія</th>
            <th>Дії</th>
          </tr>
        </thead>
        <tbody>
          {questions.length > 0 ? (
            questions.map((q) => (
              <tr key={q._id} className={styles.tableRow}>
                <td className={styles.tableCell}>
                  {q.question.length > 70
                    ? `${q.question.substring(0, 70)}...`
                    : q.question}
                </td>
                <td className={styles.tableCell}>
                  <span className={styles.categoryBadge}>{q.category}</span>
                </td>
                <td className={styles.tableCell}>
                  <button
                    onClick={() => handleDelete(q._id!)}
                    className={styles.deleteButton}
                  >
                    Видалити
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={3}
                className={styles.tableCell}
                style={{ textAlign: "center" }}
              >
                Питань не знайдено
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
