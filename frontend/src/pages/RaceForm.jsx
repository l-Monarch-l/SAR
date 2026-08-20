import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function RaceForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    features: '',
    story_ids: [],
    article_ids: []
  });

  const [stories, setStories] = useState([]);
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    // Загружаем списки для мультиселектов
    axios.get('http://localhost:3001/api/lists/stories').then(res => setStories(res.data));
    axios.get('http://localhost:3001/api/lists/articles').then(res => setArticles(res.data));

    if (isEditing) {
      axios.get(`http://localhost:3001/api/races/${id}`)
        .then(res => {
          const { name, description, features, stories, articles } = res.data;
          setFormData({
            name,
            description: description || '',
            features: features || '',
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
        await axios.put(`http://localhost:3001/api/races/${id}`, formData);
      } else {
        await axios.post('http://localhost:3001/api/races', formData);
      }
      navigate('/races');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>{isEditing ? 'Редактировать' : 'Создать'} расу</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Название:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div>
          <label>Описание:</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows="4" />
        </div>
        <div>
          <label>Особенности:</label>
          <textarea name="features" value={formData.features} onChange={handleChange} rows="4" />
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

export default RaceForm;