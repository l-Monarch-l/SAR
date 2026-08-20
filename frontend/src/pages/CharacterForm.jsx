import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function CharacterForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image_url: '',
    race_id: '',
    story_ids: [],
    article_ids: []
  });
  const [races, setRaces] = useState([]);
  const [stories, setStories] = useState([]);
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    // Загружаем списки для выпадающих списков
    axios.get('/api/races').then(res => setRaces(res.data));
    axios.get('/api/stories').then(res => setStories(res.data));
    axios.get('/api/articles').then(res => setArticles(res.data));

    if (isEditing) {
      axios.get(`/api/characters/${id}`)
        .then(res => {
          const { name, description, image_url, race, stories, articles } = res.data;
          setFormData({
            name,
            description,
            image_url: image_url || '',
            race_id: race ? race.id : '',
            story_ids: stories.map(s => s.id),
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
        await axios.put(`/api/characters/${id}`, formData);
      } else {
        await axios.post('/api/characters', formData);
      }
      navigate('/characters');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>{isEditing ? 'Редактировать' : 'Создать'} персонажа</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Имя:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div>
          <label>Описание:</label>
          <textarea name="description" value={formData.description} onChange={handleChange} />
        </div>
        <div>
          <label>URL изображения:</label>
          <input type="url" name="image_url" value={formData.image_url} onChange={handleChange} />
        </div>
        <div>
          <label>Раса:</label>
          <select name="race_id" value={formData.race_id} onChange={handleChange}>
            <option value="">-- Не выбрано --</option>
            {races.map(race => (
              <option key={race.id} value={race.id}>{race.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Связанные истории:</label>
          <select multiple value={formData.story_ids} onChange={(e) => handleMultiSelect(e, 'story_ids')}>
            {stories.map(story => (
              <option key={story.id} value={story.id}>{story.title}</option>
            ))}
          </select>
          <small>Удерживайте Ctrl (Cmd) для выбора нескольких</small>
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

export default CharacterForm;