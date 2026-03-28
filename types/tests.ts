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

export interface TestTheme {
    id: string;
    themeNumber: string;
    title: string;
    link: string;
}

export const testsData: TestTheme[] = [
    { id: "r1", themeNumber: "Тема 1", title: "Загальні положення", link: "/tests/r1" },
    { id: "r2", themeNumber: "Тема 2", title: "Обов'язки і права водіїв механічних транспортних засобів", link: "/tests/r2" },
    { id: "r3", themeNumber: "Тема 3", title: "Рух транспортних засобів із спеціальними сигналами", link: "/tests/r3" },
    { id: "r4", themeNumber: "Тема 4", title: "Обов'язки і права пішоходів", link: "/tests/r4" },
    { id: "r5", themeNumber: "Тема 5", title: "Обов'язки і права пасажирів", link: "/tests/r5" },
    { id: "r6", themeNumber: "Тема 6", title: "Вимоги до велосипедистів", link: "/tests/r6" },
    { id: "r7", themeNumber: "Тема 7", title: "Вимоги до осіб, які керують гужовим транспортом, і погоничів тварин", link: "/tests/r7" },
    { id: "r8_1", themeNumber: "Тема 8.1", title: "Регулювання дорожнього руху (регульовані перехрестя)", link: "/tests/r8_1" },
    { id: "r8_2", themeNumber: "Тема 8.2", title: "Регулювання дорожнього руху (нерегульовані перехрестя)", link: "/tests/r8_2" },
    { id: "r9", themeNumber: "Тема 9", title: "Попереджувальні сигнали", link: "/tests/r9" },
    { id: "r10", themeNumber: "Тема 10", title: "Початок руху та зміна його напрямку", link: "/tests/r10" },
    { id: "r11", themeNumber: "Тема 11", title: "Розташування транспортних засобів на дорозі", link: "/tests/r11" },
    { id: "r12", themeNumber: "Тема 12", title: "Швидкість руху", link: "/tests/r12" },
    { id: "r13", themeNumber: "Тема 13", title: "Дистанція, інтервал, зустрічний роз'їзд", link: "/tests/r13" },
    { id: "r14", themeNumber: "Тема 14", title: "Обгін", link: "/tests/r14" },
    { id: "r15", themeNumber: "Тема 15", title: "Зупинка і стоянка", link: "/tests/r15" },
    { id: "r16_1", themeNumber: "Тема 16", title: "Проїзд перехресть (регульовані перехрестя)", link: "/tests/r16_1" },
    { id: "r16_2", themeNumber: "Тема 16", title: "Проїзд перехресть (нерегульовані перехрестя)", link: "/tests/r16_2" },
    { id: "r17", themeNumber: "Тема 17", title: "Переваги маршрутних транспортних засобів", link: "/tests/r17" },
    { id: "r18", themeNumber: "Тема 18", title: "Проїзд пішохідних переходів і зупинок транспортних засобів", link: "/tests/r18" },
    { id: "r19", themeNumber: "Тема 19", title: "Користування зовнішніми світловими приладами", link: "/tests/r19" },
    { id: "r20", themeNumber: "Тема 20", title: "Рух через залізничні переїзди", link: "/tests/r20" },
    { id: "r21", themeNumber: "Тема 21", title: "Перевезення пасажирів", link: "/tests/r21" },
    { id: "r22", themeNumber: "Тема 22", title: "Перевезення вантажу", link: "/tests/r22" },
    { id: "r23", themeNumber: "Тема 23", title: "Буксирування та експлуатація транспортних составів", link: "/tests/r23" },
    { id: "r24", themeNumber: "Тема 24", title: "Навчальна їзда", link: "/tests/r24" },
    { id: "r25", themeNumber: "Тема 25", title: "Рух транспортних засобів у колонах", link: "/tests/r25" },
    { id: "r26", themeNumber: "Тема 26", title: "Рух у житловій та пішохідній зоні", link: "/tests/r26" },
    { id: "r27", themeNumber: "Тема 27", title: "Рух по автомагістралях і дорогах для автомобілів", link: "/tests/r27" },
    { id: "r28", themeNumber: "Тема 28", title: "Рух по гірських дорогах і на крутих спусках", link: "/tests/r28" },
    { id: "r29", themeNumber: "Тема 29", title: "Міжнародний рух", link: "/tests/r29" },
    { id: "r30", themeNumber: "Тема 30", title: "Номерні, розпізнавальні знаки, написи і позначення", link: "/tests/r30" },
    { id: "r31", themeNumber: "Тема 31", title: "Технічний стан транспортних засобів та їх обладнання", link: "/tests/r31" },
    { id: "r32", themeNumber: "Тема 32", title: "Окремі питання дорожнього руху, що потребують узгодження", link: "/tests/r32" },
    { id: "r33", themeNumber: "Тема 33", title: "Дорожні знаки", link: "/tests/r33" },
    { id: "r34", themeNumber: "Тема 34", title: "Дорожня розмітка", link: "/tests/r34" },
    { id: "r35", themeNumber: "Тема 35", title: "Основи безпечного водіння", link: "/tests/r35" },
    { id: "r36", themeNumber: "Тема 36", title: "Основи права в області дорожнього руху", link: "/tests/r36" },
    { id: "r37", themeNumber: "Тема 37", title: "Надання домедичної допомоги", link: "/tests/r37" },
    { id: "r38", themeNumber: "Тема 38", title: "Етика водіння, культура та відпочинок водія", link: "/tests/r38" },
    { id: "r39", themeNumber: "Тема 39", title: "Європротокол", link: "/tests/r39" },
    { id: "r44", themeNumber: "Тема 44", title: "Додаткові питання щодо категорій в1, в (загальні)", link: "/tests/r44" },
    { id: "r45", themeNumber: "Тема 45", title: "Додаткові питання щодо категорій в1, в (будова і терміни)", link: "/tests/r45" },
    { id: "r46", themeNumber: "Тема 46", title: "Додаткові питання щодо категорій в1, в (юридична відповідальність)", link: "/tests/r46" },
    { id: "r47", themeNumber: "Тема 47", title: "Додаткові питання щодо категорій в1, в (безпека)", link: "/tests/r47" },
    
    
    
];

export const themeIds = [
  "r1", "r2", "r3", "r4", "r5", "r6", "r7", "r8_1","r8.2", "r9", "r10",
  "r11", "r12", "r13", "r14", "r15", "r16_1","r16_2", "r17", "r18", "r19", "r20",
  "r21", "r22", "r23", "r24", "r25", "r26", "r27", "r28", "r29", "r30",
  "r31", "r32", "r33", "r34", "r35", "r36", "r37", "r38", "r39", "r44", "r45", "r46", "r47"
];