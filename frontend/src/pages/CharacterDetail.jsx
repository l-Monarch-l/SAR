import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';

function CharacterDetail() {
  const { id } = useParams();
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/characters/${id}`)
      .then(response => {
        setCharacter(response.data);
        setLoading(false);
      })
      .catch(error => console.error(error));
  }, [id]);

  if (loading) return <div>Загрузка...</div>;
  if (!character) return <div>Персонаж не найден</div>;

  return (
    <div>
      <h1>{character.name}</h1>
      {character.race && (
        <p><strong>Раса:</strong> <Link to={`/races/${character.race.id}`}>{character.race.name}</Link></p>
      )}
      <p><strong>Описание:</strong> {character.description}</p>
      {character.image_url && <img src={character.image_url} alt={character.name} style={{ maxWidth: '300px' }} />}
      
      {/* Секция "Связанные истории" с классом detail-section */}
      <div className="detail-section">
        <h3>Связанные истории</h3>
        {character.stories.length === 0 ? (
          <p>Нет связанных историй.</p>
        ) : (
          <ul>
            {character.stories.map(story => (
              <li key={story.id}><Link to={`/stories/${story.id}`}>{story.title}</Link></li>
            ))}
          </ul>
        )}
      </div>

      {/* Секция "Связанные статьи" с классом detail-section */}
      <div className="detail-section">
        <h3>Связанные статьи</h3>
        {character.articles.length === 0 ? (
          <p>Нет связанных статей.</p>
        ) : (
          <ul>
            {character.articles.map(article => (
              <li key={article.id}><Link to={`/articles/${article.id}`}>{article.title}</Link></li>
            ))}
          </ul>
        )}
      </div>

      <div style={{ marginTop: '2rem' }}>
        <Link to={`/characters/${id}/edit`} className="button">Редактировать</Link>
        <button onClick={handleDelete} className="danger">Удалить</button>
        <button onClick={() => navigate(-1)} className="neutral">Назад</button>
      </div>
    </div>
  );

  async function handleDelete() {
    if (window.confirm('Удалить персонажа?')) {
      try {
        await axios.delete(`/api/characters/${id}`);
        window.location.href = '/characters';
      } catch (error) {
        console.error(error);
      }
    }
  }
}

export default CharacterDetail;