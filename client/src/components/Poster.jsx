import { useState } from 'react';

// Shows the poster image; falls back to a coloured title card if there is no image
export default function Poster({ movie, className = '' }) {
  const [failed, setFailed] = useState(false);
  const hue = [...movie.title].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;

  if (movie.poster && !failed) {
    return <img className={`poster ${className}`} src={movie.poster} alt={`${movie.title} poster`} onError={() => setFailed(true)} />;
  }
  return (
    <div className={`poster poster-fallback ${className}`} style={{ '--h': hue }}>
      <span>{movie.title}</span>
    </div>
  );
}
