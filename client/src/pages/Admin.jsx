import { useEffect, useState } from 'react';
import api, { errMsg } from '../api';

const emptyMovie = { title: '', description: '', genre: '', language: 'English', duration: '', rating: '', poster: '' };

export default function Admin() {
  const [movies, setMovies] = useState([]);
  const [movieForm, setMovieForm] = useState(emptyMovie);
  const [showForm, setShowForm] = useState({ movie: '', screen: 'Screen 1', startTime: '', price: '' });
  const [msg, setMsg] = useState({ type: '', text: '' });

  const load = () => api.get('/movies').then(({ data }) => setMovies(data));
  useEffect(() => {
    load();
  }, []);

  const flash = (type, text) => setMsg({ type, text });

  const addMovie = async (e) => {
    e.preventDefault();
    try {
      await api.post('/movies', {
        ...movieForm,
        duration: Number(movieForm.duration),
        rating: movieForm.rating ? Number(movieForm.rating) : 0,
      });
      setMovieForm(emptyMovie);
      flash('success', 'Movie added.');
      load();
    } catch (err) {
      flash('danger', errMsg(err));
    }
  };

  const addShowtime = async (e) => {
    e.preventDefault();
    try {
      await api.post('/showtimes', {
        ...showForm,
        startTime: new Date(showForm.startTime).toISOString(),
        price: Number(showForm.price),
      });
      setShowForm({ ...showForm, startTime: '', price: '' });
      flash('success', 'Showtime added.');
    } catch (err) {
      flash('danger', errMsg(err));
    }
  };

  const removeMovie = async (m) => {
    if (!window.confirm(`Delete "${m.title}" and all of its showtimes?`)) return;
    try {
      await api.delete(`/movies/${m._id}`);
      flash('success', 'Movie deleted.');
      load();
    } catch (err) {
      flash('danger', errMsg(err));
    }
  };

  const setM = (k) => (e) => setMovieForm({ ...movieForm, [k]: e.target.value });
  const setS = (k) => (e) => setShowForm({ ...showForm, [k]: e.target.value });

  return (
    <div className="container py-4">
      <h1 className="display-title">Admin</h1>
      {msg.text && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}

      <div className="row g-4">
        <div className="col-lg-6">
          <form className="panel" onSubmit={addMovie}>
            <h2 className="panel-title">Add a movie</h2>
            <input className="form-control im-input mb-2" placeholder="Title" value={movieForm.title} onChange={setM('title')} required />
            <textarea className="form-control im-input mb-2" rows={3} placeholder="Description" value={movieForm.description} onChange={setM('description')} />
            <input className="form-control im-input mb-2" placeholder="Genres, separated by commas" value={movieForm.genre} onChange={setM('genre')} />
            <div className="row g-2 mb-2">
              <div className="col"><input className="form-control im-input" placeholder="Language" value={movieForm.language} onChange={setM('language')} /></div>
              <div className="col"><input type="number" min="1" className="form-control im-input" placeholder="Minutes" value={movieForm.duration} onChange={setM('duration')} required /></div>
              <div className="col"><input type="number" min="0" max="10" step="0.1" className="form-control im-input" placeholder="Rating" value={movieForm.rating} onChange={setM('rating')} /></div>
            </div>
            <input className="form-control im-input mb-3" placeholder="Poster image URL (optional)" value={movieForm.poster} onChange={setM('poster')} />
            <button className="btn btn-brass">Add movie</button>
          </form>
        </div>

        <div className="col-lg-6">
          <form className="panel" onSubmit={addShowtime}>
            <h2 className="panel-title">Add a showtime</h2>
            <select className="form-select im-input mb-2" value={showForm.movie} onChange={setS('movie')} required>
              <option value="">Select a movie</option>
              {movies.map((m) => <option key={m._id} value={m._id}>{m.title}</option>)}
            </select>
            <input className="form-control im-input mb-2" placeholder="Screen" value={showForm.screen} onChange={setS('screen')} required />
            <input type="datetime-local" className="form-control im-input mb-2" value={showForm.startTime} onChange={setS('startTime')} required />
            <input type="number" min="0" className="form-control im-input mb-3" placeholder="Price per seat (₹)" value={showForm.price} onChange={setS('price')} required />
            <button className="btn btn-brass">Add showtime</button>
            <p className="form-text mt-2 mb-0">Each screen has 8 rows × 10 seats (A1 to H10).</p>
          </form>
        </div>
      </div>

      <h2 className="section-title">All movies</h2>
      <div className="list-group im-list">
        {movies.map((m) => (
          <div key={m._id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>{m.title} <span className="text-secondary small">• {m.language}</span></span>
            <button className="btn btn-sm btn-outline-danger" onClick={() => removeMovie(m)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
