import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function RacesList() {
  const [races, setRaces] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/api/races')
      .then(response => setRaces(response.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div>
      <h1>Расы</h1>
      <Link to="/races/new" className="button">+ Новая раса</Link>
      <ul>
        {races.map(race => (
          <li key={race.id}>
            <Link to={`/races/${race.id}`}>
              <strong>{race.name}</strong>
            </Link>
            {race.description && <p>{race.description.substring(0, 100)}...</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RacesList;