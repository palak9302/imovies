import { useEffect, useMemo, useState } from 'react';
import api, { errMsg } from '../api';
import MovieCard from '../components/MovieCard';

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/movies')
      .then(({ data }) => setMovies(data))
      .catch((e) => setError(errMsg(e, 'Could not load movies. Is the server running?')))
      .finally(() => setLoading(false));
  }, []);

  const genres = useMemo(() => [...new Set(movies.flatMap((m) => m.genre))].sort(), [movies]);

  const visible = movies.filter(
    (m) =>
      m.title.toLowerCase().includes(search.trim().toLowerCase()) && (!genre || m.genre.includes(genre))
  );

  return (
    <div className="container py-4">
      <header className="home-head">
        <h1 className="display-title">Now showing</h1>
        <p className="text-secondary mb-0">Pick a film, choose a showtime, grab your seats.</p>
      </header>

      <div className="filters">
        <input
          type="search"
          className="form-control im-input"
          placeholder="Search movies"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search movies"
        />
        <div className="chip-row">
          <button className={`chip ${genre === '' ? 'active' : ''}`} onClick={() => setGenre('')}>All</button>
          {genres.map((g) => (
            <button key={g} className={`chip ${genre === g ? 'active' : ''}`} onClick={() => setGenre(g)}>
              {g}
            </button>
          ))}
        </div>
      </div>

      {loading && <div className="page-msg">Loading movies…</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      {!loading && !error && visible.length === 0 && (
        <div className="page-msg">No movies match your search. Try a different title or genre.</div>
      )}

      <div className="movie-grid">
        {visible.map((m) => (
          <MovieCard key={m._id} movie={m} />
        ))}
      </div>
    </div>
  );
}
