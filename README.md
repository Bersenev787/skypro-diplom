# Сайт - аналог Avito

### Дипломная работа

## Примечания по локальному запуску проекта для разработки

Для клонирования репозитория выполните команду:

```bash
git clone https://github.com/Bersenev787/skypro-diplom
```

Перед запуском проекта необходимо установить зависимости:

```bash
npm ci
```

Запуск проекта:

```bash
npm run start
```

Проект будет запущен по адресу: http://localhost:3000

## Backend и защита данных

Backend находится по адресу http://127.0.0.1:8090/ для запуска потребуется Docker

Запуск Docker из терминала

- Через терминал перейдите в папку: cd back-skyVito
- Запустите в терминале команду: docker-compose -f docker-compose-backend.yaml up -d
- Чтобы остановить работу бэкенда выполните: docker-compose down

## Стек

<div id="socials" aligh="center">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" title="js" width="40" height="40"/>&nbsp;
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" title="html" width="40" height="40"/>&nbsp;
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" title="css" width="40" height="40"/>&nbsp;
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" title="react" width="40" height="40"/>&nbsp;
</div>

## Стэк библиотек проекта

React
React Scripts
React Router Dom
React Redux
Styled Components

## Назначение папок и файлов проекта

**/components** - компоненты общие для всего проекта
**/img** - картинки, доступные для всех пользователей  
**/pages** - страницы приложения  
**/store** - файлы, относящиеся к управлению состоянием приложения
**/style** - глобальные стили приложения
**/api** - функционал посвященный операциям с API (бэкэндом)  
**/App** - главный компонент приложения, который объединяет все другие компоненты
**/protector-routes** - частный маршрут, для авторизованного пользователя

## Структура приложения

1. Главная страница:

- список объявлений, имеющихся в базе данных
- кнопка "Вход в личный кабинет", при клике на которую пользователь попадает на страницу авторизации
- окно поиска по объявлениям

2. Страница объявления:

- описание товара, цена, информация о продавце
- кнопка "Показать телефон", при клике на которую пользователь может увидеть телефон продавца
- кнопка "Вернуться на главную" ведет на главную страницу

Если пользователь авторизован и он зашел в свое объявление:

- кнопка "Редактировать" - пользователь может редактировать объявление
- кнопка "Удалить" - пользователь может удалить объявление

3. Страница авторизации:

- на данной странице пользователь имеет возможность зарегистрироваться или войти в свой аккаунт

4. Страница "Личный кабинет": (доступна только для авторизованного пользователя)

- кнопка "Вернуться на главную" ведет на главную страницу
- кнопки для смены пароля
- кнопка сохранить изменение о пользователе
- список объявлений пользователя, ведет на страницу объявления

5. Страница "Профиль продавца":

- кнопка "Вернуться на главную" ведет на главную страницу
- информация о пользователе
- список объявлений пользователя, ведет на страницу объявления

### Функционал приложения

- [x] Если пользователь авторизован:

  - [x] может редактировать свои данные
  - [x] может просматривать объявления
  - [x] может просматривать профиль продавца
  - [x] может редактировать объявление
  - [x] может создавать новое объявление
  - [x] оставлять комментарии

- [x] Если пользователь не авторизован:
  - [x] может просматривать объявления
  - [x] просматривать комментарии
  - [x] может просматривать профиль продавца

### Планируемые доработки

- [x] добавление фотографий при создании объявления
