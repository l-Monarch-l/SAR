import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== password2) {
      setError('Пароли не совпадают');
      return;
    }
    if (password.length < 6) {
      setError('Пароль должен быть минимум 6 символов');
      return;
    }

    setLoading(true);

    try {
      await api.post('/auth/register', { email, password });
      navigate('/login');
    } catch (err) {
      const message =
        err.response?.data?.error || 'Не удалось зарегистрироваться.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form">
      <h1>Регистрация</h1>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Пароль</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password2">Повторите пароль</label>
          <input
            id="password2"
            type="password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            required
            autoComplete="new-password"
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <button type="submit" disabled={loading}>
          {loading ? 'Регистрирую...' : 'Зарегистрироваться'}
        </button>
      </form>

      <p>
        Уже есть аккаунт? <Link to="/login">Войти</Link>
      </p>
    </div>
  );
}

export default Register;