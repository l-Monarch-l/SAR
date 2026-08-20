import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav>
      <h2>Заметки чумы</h2>
      <ul>
        <li><Link to="/characters">Персонажи</Link></li>
        <li><Link to="/races">Расы</Link></li>
        <li><Link to="/stories">Истории</Link></li>
        <li><Link to="/articles">Статьи</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;