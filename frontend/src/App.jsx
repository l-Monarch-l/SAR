import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import CharactersList from './pages/CharactersList';
import CharacterDetail from './pages/CharacterDetail';
import CharacterForm from './pages/CharacterForm';
import RacesList from './pages/RacesList';
import RaceDetail from './pages/RaceDetail';
import RaceForm from './pages/RaceForm';
import StoriesList from './pages/StoriesList';
import StoryDetail from './pages/StoryDetail';
import StoryForm from './pages/StoryForm';
import ArticlesList from './pages/ArticlesList';
import ArticleDetail from './pages/ArticleDetail';
import ArticleForm from './pages/ArticleForm';
import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="container">
        <Routes>
          {/* Редирект с корня на персонажей (опционально) */}
          <Route path="/" element={<CharactersList />} />
          
          {/* Персонажи */}
          <Route path="/characters" element={<CharactersList />} />
          <Route path="/characters/:id" element={<CharacterDetail />} />
          <Route path="/characters/new" element={<CharacterForm />} />
          <Route path="/characters/:id/edit" element={<CharacterForm />} />

          {/* Расы */}
          <Route path="/races" element={<RacesList />} />
          <Route path="/races/:id" element={<RaceDetail />} />
          <Route path="/races/new" element={<RaceForm />} />
          <Route path="/races/:id/edit" element={<RaceForm />} />

          {/* Истории */}
          <Route path="/stories" element={<StoriesList />} />
          <Route path="/stories/:id" element={<StoryDetail />} />
          <Route path="/stories/new" element={<StoryForm />} />
          <Route path="/stories/:id/edit" element={<StoryForm />} />

          {/* Статьи */}
          <Route path="/articles" element={<ArticlesList />} />
          <Route path="/articles/:id" element={<ArticleDetail />} />
          <Route path="/articles/new" element={<ArticleForm />} />
          <Route path="/articles/:id/edit" element={<ArticleForm />} />
          
          {/* Ошибка 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;