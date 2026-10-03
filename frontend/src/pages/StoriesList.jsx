import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

function StoriesList() {
  const [stories, setStories] = useState([]);
  const { isAdmin } = useAuth();

  useEffect(() => {
    api.get('/stories')
      .then(response => setStories(response.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div>
      <h1>Истории</h1>
      {isAdmin && (
          <Link to="/stories/new" className="button">+ Новая история</Link>
        )}
        <ul>
          {stories.map(story => (
            <li key={story.id}>
              <Link to={`/stories/${story.id}`}>
                <strong>{story.title}</strong>
              </Link>
              {story.event_date && <span> ({story.event_date})</span>}
            </li>
          ))}
      </ul>
    </div>
  );
}

export default StoriesList;