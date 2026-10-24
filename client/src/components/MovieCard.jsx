import { Link } from 'react-router-dom';
import Poster from './Poster';
import { hours } from '../utils';

export default function MovieCard({ movie }) {
  return (
    <Link to={`/movies/${movie._id}`} className="movie-card text-decoration-none">
      <Poster movie={movie} />
      <div className="movie-card-body">
        <h3 className="movie-card-title">{movie.title}</h3>
        <p className="movie-card-meta">
          {movie.genre.slice(0, 2).join(', ')}
          {movie.genre.length ? ' • ' : ''}
          {hours(movie.duration)}
        </p>
        {movie.rating > 0 && <span className="rating">★ {movie.rating.toFixed(1)}</span>}
      </div>
    </Link>
  );
}
