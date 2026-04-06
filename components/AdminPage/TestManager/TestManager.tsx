"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { testAdminService, Question } from "@/app/services/testAdminService";
import EditQuestionModal from "@/components/AdminPage/EditQuestionModal/EditQuestionModal";
import styles from "./TestManager.module.css";

interface TestManagerProps {
  token: string | null;
}

export default function TestManager({ token }: TestManagerProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState<string>("all");

  // Стан модалки
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  const loadQuestions = useCallback(async () => {
    try {
      setLoading(true);
      const data = await testAdminService.getAllQuestions(token);
      setQuestions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) loadQuestions();
  }, [loadQuestions, token]);

  const handleSave = async (formData: FormData) => {
    try {
      await testAdminService.saveQuestion(formData, token, editingQuestion?.id);
      setIsModalOpen(false);
      loadQuestions();
    } catch (err) {
      alert("Помилка при збереженні!");
    }
  };

  const handleEdit = (question: Question) => {
    setEditingQuestion(question);
    setIsModalOpen(true);
  };

  const getTopicFromId = (id: string): string => {
    const match = id.match(/^(.*?)q/);
    return match ? match[1].toUpperCase() : "Інше";
  };

  const topics = useMemo(() => {
    const unique = new Set(questions.map((q) => getTopicFromId(q.id || "")));
    return ["all", ...Array.from(unique)];
  }, [questions]);

  const filteredQuestions = useMemo(() => {
    if (selectedTopic === "all") return questions;
    return questions.filter(
      (q) => getTopicFromId(q.id || "") === selectedTopic,
    );
  }, [questions, selectedTopic]);

  if (loading) return <div className={styles.loading}>Завантаження...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <h3>Тести ({filteredQuestions.length})</h3>
          <select
            className={styles.topicSelect}
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
          >
            <option value="all">Всі розділи</option>
            {topics
              .filter((t) => t !== "all")
              .map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
          </select>
        </div>
        <button
          className={styles.addButton}
          onClick={() => {
            setEditingQuestion(null);
            setIsModalOpen(true);
          }}
        >
          + Створити питання
        </button>
      </header>

      <table className={styles.tableContainer}>
        <thead>
          <tr className={styles.tableHeader}>
            <th>ID</th>
            <th>Питання</th>
            <th>Дії</th>
          </tr>
        </thead>
        <tbody>
          {filteredQuestions.map((q) => (
            <tr key={q.id} className={styles.tableRow}>
              <td className={styles.tableCell}>
                <strong className={styles.idBadge}>{q.id}</strong>
              </td>
              <td className={styles.tableCell}>
                {q.question.substring(0, 70)}...
              </td>
              <td className={styles.tableCell}>
                <button
                  className={styles.editButton}
                  onClick={() => handleEdit(q)}
                >
                  Редагувати
                </button>
                <button
                  className={styles.deleteButton}
                  onClick={() => {
                    /* логіка видалення */
                  }}
                >
                  Видалити
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <EditQuestionModal
          question={editingQuestion}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
