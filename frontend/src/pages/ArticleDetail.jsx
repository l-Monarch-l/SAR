import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ArticleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`/api/articles/${id}`)
      .then(response => {
        setArticle(response.data);
        setLoading(false);
      })
      .catch(error => console.error(error));
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Удалить статью?')) {
      try {
        await axios.delete(`/api/articles/${id}`);
        navigate('/articles');
      } catch (error) {
        console.error(error);
      }
    }
  };

  if (loading) return <div className="loading">Загрузка...</div>;
  if (!article) return <div className="error">Статья не найдена</div>;

  return (
    <div>
      <h1>{article.title}</h1>
      <div className="card">
        <p>{article.content}</p>
      </div>

      <div className="detail-section">
        <h3>Связанные персонажи</h3>
        {article.characters?.length === 0 ? (
          <p>Нет связанных персонажей.</p>
        ) : (
          <ul>
            {article.characters?.map(char => (
              <li key={char.id}>
                <Link to={`/characters/${char.id}`}>{char.name}</Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="detail-section">
        <h3>Связанные расы</h3>
        {article.races?.length === 0 ? (
          <p>Нет связанных рас.</p>
        ) : (
          <ul>
            {article.races?.map(race => (
              <li key={race.id}>
                <Link to={`/races/${race.id}`}>{race.name}</Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="detail-section">
        <h3>Связанные истории</h3>
        {article.stories?.length === 0 ? (
          <p>Нет связанных историй.</p>
        ) : (
          <ul>
            {article.stories?.map(story => (
              <li key={story.id}>
                <Link to={`/stories/${story.id}`}>{story.title}</Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <Link to={`/articles/${id}/edit`} className="button">Редактировать</Link>
        <button onClick={handleDelete} className="danger">Удалить</button>
              <button onClick={() => navigate(-1)} className="neutral">Назад</button>
      </div>
    </div>
  );
}

export default ArticleDetail;