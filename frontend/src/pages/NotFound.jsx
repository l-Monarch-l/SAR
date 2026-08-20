import { Link } from 'react-router-dom';


function NotFound() {
  return (
    <div>
      <h1>404 - Страница не найдена</h1>
      <p>Извините, такой страницы не существует.</p>
      <Link to="/" className="button">Вернуться на главную</Link>
    </div>
  );
}

export default NotFound;