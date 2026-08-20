import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function CharactersList() {
  const [characters, setCharacters] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/api/characters')
      .then(response => setCharacters(response.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div>
      <h1>Персонажи</h1>
      <Link to="/characters/new">+ Добавить персонажа</Link>
      <ul>
        {characters.map(char => (
          <li key={char.id}>
            <Link to={`/characters/${char.id}`}>
              <strong>{char.name}</strong>
            </Link>
            {char.race_id && <span> (Раса ID: {char.race_id})</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CharactersList;