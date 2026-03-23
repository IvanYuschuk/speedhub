// 1. Описуємо тип для одного варіанта відповіді
export interface Option {
  _id: string;
  id: number;
  text: string;
}

// 2. Створюємо спеціальний тип для масиву, який може містити рівно від 2 до 6 елементів
export type OptionsArray =
  | [Option, Option] // Рівно 2
  | [Option, Option, Option] // Рівно 3
  | [Option, Option, Option, Option] // Рівно 4
  | [Option, Option, Option, Option, Option] // Рівно 5
  | [Option, Option, Option, Option, Option, Option]; // Рівно 6

// 3. Описуємо головний об'єкт питання
export interface Test {
  _id: string;
  id: string;
  image: string[]; // Якщо в image будуть URL картинок. Якщо щось інше - зміни на відповідний тип
  question: string;
  options: OptionsArray; // Використовуємо наш обмежений масив
  correct_option_id: number;
  explanation: string;
}