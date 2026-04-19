"use client";

import React, { useState, useEffect } from "react";
import { Question, QuestionOption } from "@/app/services/testAdminService";
import styles from "./EditQuestionModal.module.css";

interface EditQuestionModalProps {
  question: Question | null;
  onClose: () => void;
  onSave: (formData: FormData) => Promise<void>;
}

interface ExtendedQuestion extends Question {
  image?: string[];
  correct_option_id: number;
}

export default function EditQuestionModal({
  question,
  onClose,
  onSave,
}: EditQuestionModalProps) {
  const [text, setText] = useState("");
  const [category, setCategory] = useState("");
  const [options, setOptions] = useState<string[]>(["", "", ""]);
  const [correctOption, setCorrectOption] = useState<number>(1);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  useEffect(() => {
    if (question) {
      const q = question as ExtendedQuestion;
      setText(q.question || "");

      if (q.id) {
        setCategory(q.id);
      } else if (q.category) {
        setCategory(q.category);
      }

      setCorrectOption(q.correct_option_id || 1);
      const dbImageField = q.image || [];
      setExistingImages(
        Array.isArray(dbImageField) ? dbImageField : [dbImageField],
      );

      if (Array.isArray(q.options)) {
        const parsed = (q.options as (string | QuestionOption)[]).map((opt) => {
          return typeof opt === "object" && opt !== null && "text" in opt
            ? opt.text
            : String(opt);
        });
        setOptions(parsed);
      }
    }
  }, [question]);

  const handleOptionChange = (idx: number, value: string) => {
    const next = [...options];
    next[idx] = value;
    setOptions(next);
  };

  const removeOption = (idx: number) => {
    if (options.length <= 2) return;
    const newOptions = options.filter((_, i) => i !== idx);
    setOptions(newOptions);
    if (correctOption === idx + 1) setCorrectOption(1);
    else if (correctOption > idx + 1) setCorrectOption((prev) => prev - 1);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setNewImages((prev) => [...prev, ...filesArray]);
      const urls = filesArray.map((file) => URL.createObjectURL(file));
      setNewPreviews((prev) => [...prev, ...urls]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("question", text);
    formData.append("customId", category);
    formData.append("correct_option_id", correctOption.toString());
    formData.append("options", JSON.stringify(options));
    formData.append("existingImages", JSON.stringify(existingImages));
    newImages.forEach((img) => formData.append("images", img));

    try {
      await onSave(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={styles.overlay}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose}>
          &times;
        </button>
        <h2 className={styles.modalTitle}>
          {question?.id ? `Редагування ${question.id}` : "Нове питання"}
        </h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.fieldGroup}>
            <label>Текст питання</label>
            <textarea
              className={styles.textarea}
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
            />
          </div>
          <div className={styles.fieldGroup}>
            <label>ID Питання (напр. r1q5)</label>
            <input
              className={styles.input}
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="r1q5"
              required
            />
          </div>
          <div className={styles.fieldGroup}>
            <label>Варіанти (Правильна №{correctOption})</label>
            <div className={styles.optionsList}>
              {options.map((opt, idx) => (
                <div key={idx} className={styles.optionRow}>
                  <input
                    type="radio"
                    className={styles.radio}
                    name="correct"
                    checked={correctOption === idx + 1}
                    onChange={() => setCorrectOption(idx + 1)}
                  />
                  <input
                    className={styles.input}
                    value={opt}
                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className={styles.removeBtn}
                    onClick={() => removeOption(idx)}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              className={styles.addOptBtn}
              onClick={() => setOptions([...options, ""])}
            >
              + Додати варіант
            </button>
          </div>
          <div className={styles.fieldGroup}>
            <label>Зображення</label>
            <div className={styles.fileInputContainer}>
              <div className={styles.customFileButton}>
                📁 Вибрати нові файли
              </div>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className={styles.fileInput}
              />
            </div>
            <div className={styles.previewGrid}>
              {existingImages.map((url, i) => (
                <div key={`ex-${i}`} className={styles.imgWrapper}>
                  <img
                    src={url}
                    className={styles.previewImg}
                    alt="ПДР"
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                  />
                  <button
                    type="button"
                    className={styles.delImg}
                    onClick={() =>
                      setExistingImages(
                        existingImages.filter((img) => img !== url),
                      )
                    }
                  >
                    &times;
                  </button>
                </div>
              ))}
              {newPreviews.map((url, i) => (
                <div key={`new-${i}`} className={styles.imgWrapper}>
                  <img
                    src={url}
                    className={`${styles.previewImg} ${styles.newImg}`}
                    alt=""
                  />
                  <button
                    type="button"
                    className={styles.delImg}
                    onClick={() => {
                      setNewImages(newImages.filter((_, idx) => idx !== i));
                      setNewPreviews(newPreviews.filter((_, idx) => idx !== i));
                    }}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={onClose}
            >
              Скасувати
            </button>
            <button
              type="submit"
              className={styles.saveBtn}
              disabled={isSubmitting}
            >
              Зберегти
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
