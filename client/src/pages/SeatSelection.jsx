import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import api, { errMsg } from '../api';
import { useAuth } from '../context/AuthContext';
import { dateTimeLabel, money } from '../utils';

const MAX_SEATS = 8;
const POLL_MS = 5000; // seat map refreshes every 5 seconds
const rowLabel = (i) => String.fromCharCode(65 + i);

export default function SeatSelection() {
  const { showtimeId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [showtime, setShowtime] = useState(null);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const selectedRef = useRef([]);

  useEffect(() => {
    selectedRef.current = selected;
  }, [selected]);

  const load = useCallback(async () => {
    try {
      const { data } = await api.get(`/showtimes/${showtimeId}`);
      setShowtime(data);
      // if someone else took a seat we had selected, drop it and tell the user
      const clash = selectedRef.current.filter((s) => data.bookedSeats.includes(s));
      if (clash.length) {
        setSelected((prev) => prev.filter((s) => !clash.includes(s)));
        setNotice(`Seat ${clash.join(', ')} was just booked by someone else.`);
      }
    } catch (e) {
      setError(errMsg(e, 'Could not load this show'));
    } finally {
      setLoading(false);
    }
  }, [showtimeId]);

  useEffect(() => {
    load();
    const timer = setInterval(load, POLL_MS);
    return () => clearInterval(timer);
  }, [load]);

  if (loading) return <div className="page-msg">Loading seat map…</div>;
  if (!showtime) return <div className="container py-4"><div className="alert alert-danger">{error || 'Show not found'}</div></div>;

  const started = new Date(showtime.startTime) < new Date();
  const total = selected.length * showtime.price;

  const toggle = (seat) => {
    setNotice('');
    setError('');
    setSelected((prev) => {
      if (prev.includes(seat)) return prev.filter((s) => s !== seat);
      if (prev.length >= MAX_SEATS) {
        setError(`You can select up to ${MAX_SEATS} seats.`);
        return prev;
      }
      return [...prev, seat];
    });
  };

  const book = async () => {
    if (!user) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await api.post('/bookings', { showtimeId, seats: selected });
      navigate('/my-bookings', { state: { booked: true } });
    } catch (e) {
      setError(errMsg(e, 'Booking failed. Try again.'));
      setSelected([]);
      load();
    } finally {
      setSubmitting(false);
    }
  };

  const rows = Array.from({ length: showtime.rows }, (_, r) => r);
  const cols = Array.from({ length: showtime.cols }, (_, c) => c + 1);

  return (
    <div className="container py-4">
      <Link to={`/movies/${showtime.movie._id}`} className="back-link">Back to {showtime.movie.title}</Link>
      <h1 className="display-title">{showtime.movie.title}</h1>
      <p className="text-secondary">
        {dateTimeLabel(showtime.startTime)} • {showtime.screen} • {money(showtime.price)} per seat
      </p>

      {started && <div className="alert alert-warning">This show has already started. Booking is closed.</div>}
      {notice && <div className="alert alert-warning">{notice}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="seat-layout">
        <div className="screen-wrap">
          <div className="screen">Screen this way</div>
        </div>

        <div className="seat-grid" role="group" aria-label="Seat map">
          {rows.map((r) => (
            <div className="seat-row" key={r}>
              <span className="row-label">{rowLabel(r)}</span>
              {cols.map((c) => {
                const id = `${rowLabel(r)}${c}`;
                const booked = showtime.bookedSeats.includes(id);
                const isSel = selected.includes(id);
                return (
                  <button
                    key={id}
                    type="button"
                    className={`seat ${booked ? 'booked' : ''} ${isSel ? 'selected' : ''}`}
                    disabled={booked || started}
                    onClick={() => toggle(id)}
                    aria-label={`Seat ${id}${booked ? ', booked' : isSel ? ', selected' : ', available'}`}
                    aria-pressed={isSel}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        <div className="legend">
          <span><i className="seat-key" /> Available</span>
          <span><i className="seat-key selected" /> Selected</span>
          <span><i className="seat-key booked" /> Booked</span>
        </div>
      </div>

      <div className="checkout-bar">
        <div>
          {selected.length === 0 ? (
            <span className="text-secondary">Select seats to continue</span>
          ) : (
            <>
              <strong>{selected.length} {selected.length === 1 ? 'seat' : 'seats'}</strong>
              <span className="text-secondary"> • {[...selected].sort().join(', ')}</span>
            </>
          )}
        </div>
        <div className="d-flex align-items-center gap-3">
          <span className="total">{money(total)}</span>
          <button className="btn btn-brass" disabled={selected.length === 0 || submitting || started} onClick={book}>
            {submitting ? 'Booking…' : user ? 'Confirm booking' : 'Log in to book'}
          </button>
        </div>
      </div>
    </div>
  );
}
