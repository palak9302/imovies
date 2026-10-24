import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api, { errMsg } from '../api';
import Poster from '../components/Poster';
import { dayLabel, hours, money, seatsLeft, timeLabel } from '../utils';

export default function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get(`/movies/${id}`), api.get(`/showtimes/movie/${id}`)])
      .then(([m, s]) => {
        setMovie(m.data);
        setShowtimes(s.data);
      })
      .catch((e) => setError(errMsg(e, 'Movie not found')))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="page-msg">Loading…</div>;
  if (error) return <div className="container py-4"><div className="alert alert-danger">{error}</div></div>;

  // group showtimes by day
  const byDay = showtimes.reduce((acc, s) => {
    const key = dayLabel(s.startTime);
    (acc[key] = acc[key] || []).push(s);
    return acc;
  }, {});

  return (
    <div className="container py-4">
      <div className="details">
        <Poster movie={movie} className="details-poster" />
        <div>
          <h1 className="display-title">{movie.title}</h1>
          <p className="text-secondary">
            {movie.genre.join(', ')} • {movie.language} • {hours(movie.duration)}
            {movie.rating > 0 && <> • ★ {movie.rating.toFixed(1)}</>}
          </p>
          <p className="details-desc">{movie.description || 'No description yet.'}</p>
        </div>
      </div>

      <h2 className="section-title">Showtimes</h2>
      {showtimes.length === 0 && <div className="page-msg">No upcoming shows for this movie yet.</div>}

      {Object.entries(byDay).map(([day, list]) => (
        <div key={day} className="day-block">
          <h3 className="day-label">{day}</h3>
          <div className="slot-row">
            {list.map((s) => {
              const left = seatsLeft(s);
              return left > 0 ? (
                <Link key={s._id} to={`/book/${s._id}`} className="slot">
                  <strong>{timeLabel(s.startTime)}</strong>
                  <span>{s.screen}</span>
                  <span>{money(s.price)} • {left} left</span>
                </Link>
              ) : (
                <div key={s._id} className="slot slot-full">
                  <strong>{timeLabel(s.startTime)}</strong>
                  <span>{s.screen}</span>
                  <span>Sold out</span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
