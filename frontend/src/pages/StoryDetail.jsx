import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function StoryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:3001/api/stories/${id}`)
      .then(response => {
        setStory(response.data);
        setLoading(false);
      })
      .catch(error => console.error(error));
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Удалить историю?')) {
      try {
        await axios.delete(`http://localhost:3001/api/stories/${id}`);
        navigate('/stories');
      } catch (error) {
        console.error(error);
      }
    }
  };

  if (loading) return <div className="loading">Загрузка...</div>;
  if (!story) return <div className="error">История не найдена</div>;

  return (
    <div>
      <h1>{story.title}</h1>
      <div className="card">
        {story.event_date && <p><strong>Дата события:</strong> {story.event_date}</p>}
        <p><strong>Содержание:</strong> {story.content}</p>
      </div>

      <div className="detail-section">
        <h3>Связанные персонажи</h3>
        {story.characters?.length === 0 ? (
          <p>Нет связанных персонажей.</p>
        ) : (
          <ul>
            {story.characters?.map(char => (
              <li key={char.id}>
                <Link to={`/characters/${char.id}`}>{char.name}</Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="detail-section">
        <h3>Связанные расы</h3>
        {story.races?.length === 0 ? (
          <p>Нет связанных рас.</p>
        ) : (
          <ul>
            {story.races?.map(race => (
              <li key={race.id}>
                <Link to={`/races/${race.id}`}>{race.name}</Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="detail-section">
        <h3>Связанные статьи</h3>
        {story.articles?.length === 0 ? (
          <p>Нет связанных статей.</p>
        ) : (
          <ul>
            {story.articles?.map(article => (
              <li key={article.id}>
                <Link to={`/articles/${article.id}`}>{article.title}</Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <Link to={`/stories/${id}/edit`} className="button">Редактировать</Link>
        <button onClick={handleDelete} className="danger">Удалить</button>
        <button onClick={() => navigate(-1)} className="neutral">Назад</button>
      </div>
    </div>
  );
}

export default StoryDetail;