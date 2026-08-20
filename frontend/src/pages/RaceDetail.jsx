import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function RaceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [race, setRace] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:3001/api/races/${id}`)
      .then(response => {
        setRace(response.data);
        setLoading(false);
      })
      .catch(error => console.error(error));
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Удалить расу?')) {
      try {
        await axios.delete(`http://localhost:3001/api/races/${id}`);
        navigate('/races');
      } catch (error) {
        console.error(error);
      }
    }
  };

  if (loading) return <div className="loading">Загрузка...</div>;
  if (!race) return <div className="error">Раса не найдена</div>;

  return (
    <div>
      <h1>{race.name}</h1>
      <div className="card">
        <p><strong>Описание:</strong> {race.description}</p>
        <p><strong>Особенности:</strong> {race.features}</p>
      </div>

      <div className="detail-section">
        <h3>Связанные персонажи</h3>
        {race.characters?.length === 0 ? (
          <p>Нет связанных персонажей.</p>
        ) : (
          <ul>
            {race.characters?.map(char => (
              <li key={char.id}>
                <Link to={`/characters/${char.id}`}>{char.name}</Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="detail-section">
        <h3>Связанные истории</h3>
        {race.stories?.length === 0 ? (
          <p>Нет связанных историй.</p>
        ) : (
          <ul>
            {race.stories?.map(story => (
              <li key={story.id}>
                <Link to={`/stories/${story.id}`}>{story.title}</Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="detail-section">
        <h3>Связанные статьи</h3>
        {race.articles?.length === 0 ? (
          <p>Нет связанных статей.</p>
        ) : (
          <ul>
            {race.articles?.map(article => (
              <li key={article.id}>
                <Link to={`/articles/${article.id}`}>{article.title}</Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <Link to={`/races/${id}/edit`} className="button">Редактировать</Link>
        <button onClick={handleDelete} className="danger">Удалить</button>
        <button onClick={() => navigate(-1)} className="neutral">Назад</button>
      </div>
    </div>
  );
}

export default RaceDetail;