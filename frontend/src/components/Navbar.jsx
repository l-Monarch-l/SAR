import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav>
      <h2>Заметки чумы</h2>

      <ul>
        <li><Link to="/characters">Персонажи</Link></li>
        <li><Link to="/races">Расы</Link></li>
        <li><Link to="/stories">Истории</Link></li>
        <li><Link to="/articles">Статьи</Link></li>
      </ul>

      <div className="nav-auth">
        {isAuthenticated ? (
          <>
            <span className="nav-user">
              {user.email}
              {isAdmin && <span className="nav-badge">admin</span>}
            </span>
            <button onClick={handleLogout} className="neutral">Выйти</button>
          </>
        ) : (
          <Link to="/login">Войти</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;