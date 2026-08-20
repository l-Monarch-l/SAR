import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function StoryForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    event_date: '',
    character_ids: [],
    race_ids: [],
    article_ids: []
  });

  const [characters, setCharacters] = useState([]);
  const [races, setRaces] = useState([]);
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    axios.get('/api/lists/characters').then(res => setCharacters(res.data));
    axios.get('/api/lists/races').then(res => setRaces(res.data));
    axios.get('/api/lists/articles').then(res => setArticles(res.data));

    if (isEditing) {
      axios.get(`/api/stories/${id}`)
        .then(res => {
          const { title, content, event_date, characters, races, articles } = res.data;
          setFormData({
            title,
            content: content || '',
            event_date: event_date || '',
            character_ids: characters.map(c => c.id),
            race_ids: races.map(r => r.id),
            article_ids: articles.map(a => a.id)
          });
        })
        .catch(err => console.error(err));
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMultiSelect = (e, field) => {
    const options = e.target.options;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) selected.push(Number(options[i].value));
    }
    setFormData(prev => ({ ...prev, [field]: selected }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`/api/stories/${id}`, formData);
      } else {
        await axios.post('/api/stories', formData);
      }
      navigate('/stories');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>{isEditing ? 'Редактировать' : 'Создать'} историю</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Название:</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required />
        </div>
        <div>
          <label>Дата события (ГГГГ-ММ-ДД):</label>
          <input type="date" name="event_date" value={formData.event_date} onChange={handleChange} />
        </div>
        <div>
          <label>Содержание:</label>
          <textarea name="content" value={formData.content} onChange={handleChange} rows="8" />
        </div>

        <div>
          <label>Связанные персонажи:</label>
          <select multiple value={formData.character_ids} onChange={(e) => handleMultiSelect(e, 'character_ids')}>
            {characters.map(char => (
              <option key={char.id} value={char.id}>{char.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Связанные расы:</label>
          <select multiple value={formData.race_ids} onChange={(e) => handleMultiSelect(e, 'race_ids')}>
            {races.map(race => (
              <option key={race.id} value={race.id}>{race.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Связанные статьи:</label>
          <select multiple value={formData.article_ids} onChange={(e) => handleMultiSelect(e, 'article_ids')}>
            {articles.map(article => (
              <option key={article.id} value={article.id}>{article.title}</option>
            ))}
          </select>
        </div>

        <button type="submit">Сохранить</button>
        <button type="button" onClick={() => navigate(-1)} className="neutral">Отмена</button>
      </form>
    </div>
  );
}

export default StoryForm;