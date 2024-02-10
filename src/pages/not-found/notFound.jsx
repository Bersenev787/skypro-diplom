import { Link } from "react-router-dom";
export function NotFound() {
  return (
    <div>
      <div>
        <h1>404</h1>
        <p>Страница не найдена</p>
        <p>Возможно, она была удалена или перенесена на другой адрес</p>
        <Link to="/">Вернуться на главную</Link>
      </div>
    </div>
  );
}
