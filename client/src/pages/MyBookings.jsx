import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api, { errMsg } from '../api';
import { dateTimeLabel, money } from '../utils';

export default function MyBookings() {
  const location = useLocation();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(Boolean(location.state?.booked));

  const load = () =>
    api
      .get('/bookings/mine')
      .then(({ data }) => setBookings(data))
      .catch((e) => setError(errMsg(e)))
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const cancel = async (id) => {
    if (!window.confirm('Cancel this booking? The seats will be released.')) return;
    setError('');
    setSuccess(false);
    try {
      await api.put(`/bookings/${id}/cancel`);
      load();
    } catch (e) {
      setError(errMsg(e, 'Could not cancel the booking'));
    }
  };

  if (loading) return <div className="page-msg">Loading your bookings…</div>;

  return (
    <div className="container py-4">
      <h1 className="display-title">My bookings</h1>
      {success && <div className="alert alert-success">Booking confirmed. Your tickets are below.</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {bookings.length === 0 && (
        <div className="page-msg">
          You have no bookings yet. <Link to="/">Browse movies</Link>
        </div>
      )}

      <div className="ticket-list">
        {bookings.map((b) => {
          const upcoming = b.showtime && new Date(b.showtime.startTime) > new Date();
          return (
            <article key={b._id} className={`ticket ${b.status === 'cancelled' ? 'cancelled' : ''}`}>
              <div className="ticket-main">
                <h2 className="ticket-title">{b.movie?.title || 'Movie removed'}</h2>
                {b.showtime && (
                  <p className="mb-1">{dateTimeLabel(b.showtime.startTime)} • {b.showtime.screen}</p>
                )}
                <p className="mb-0 text-secondary">Seats: {[...b.seats].sort().join(', ')}</p>
              </div>
              <div className="ticket-stub">
                <span className="ticket-amount">{money(b.totalAmount)}</span>
                <span className={`status status-${b.status}`}>{b.status === 'booked' ? 'Confirmed' : 'Cancelled'}</span>
                {b.status === 'booked' && upcoming && (
                  <button className="btn btn-sm btn-outline-dark" onClick={() => cancel(b._id)}>Cancel booking</button>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
