"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { testAdminService, Question } from "@/app/services/testAdminService";
import EditQuestionModal from "@/components/AdminPage/EditQuestionModal/EditQuestionModal";
import ConfirmModal from "@/components/Modals/ConfirmModal/ConfirmModal";
import styles from "./TestManager.module.css";

export default function TestManager() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    mongoId: string;
    questionId: string;
  }>({
    isOpen: false,
    mongoId: "",
    questionId: "",
  });

  const loadQuestions = useCallback(async () => {
    try {
      setLoading(true);
      const data = await testAdminService.getAllQuestions();
      setQuestions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  const handleSave = async (formData: FormData) => {
    try {
      await testAdminService.saveQuestion(formData, editingQuestion?._id);
      setIsModalOpen(false);
      loadQuestions();
    } catch (err) {
      alert("Помилка при збереженні!");
    }
  };

  const openDeleteConfirm = (mongoId: string, questionId: string) => {
    setConfirmConfig({
      isOpen: true,
      mongoId,
      questionId,
    });
  };

  const closeDeleteConfirm = () => {
    setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
  };

  const handleConfirmDelete = async () => {
    try {
      await testAdminService.deleteQuestion(confirmConfig.mongoId);
      loadQuestions();
      closeDeleteConfirm();
    } catch (err) {
      alert("Помилка при видаленні!");
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
            <tr key={q._id} className={styles.tableRow}>
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
                  onClick={() => openDeleteConfirm(q._id, q.id)}
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

      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        title="Видалення питання"
        message={`Ви впевнені, що хочете видалити питання ${confirmConfig.questionId}? Цю дію неможливо скасувати.`}
        onConfirm={handleConfirmDelete}
        onCancel={closeDeleteConfirm}
        type="danger"
        confirmText="Видалити"
      />
    </div>
  );
}
