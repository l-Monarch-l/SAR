import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

function ArticlesList() {
  const [articles, setArticles] = useState([]);
  const { isAdmin } = useAuth();

  useEffect(() => {
    api.get('/articles')
      .then(response => setArticles(response.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div>
      <h1>Статьи</h1>
      {isAdmin && (
        <Link to="/articles/new" className="button">+ Новая статья</Link>
      )}
      <ul>
        {articles.map(article => (
          <li key={article.id}>
            <Link to={`/articles/${article.id}`}>
              <strong>{article.title}</strong>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ArticlesList;