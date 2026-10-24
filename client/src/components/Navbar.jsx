import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  const onLogout = () => {
    logout();
    close();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-md im-nav">
      <div className="container">
        <Link className="navbar-brand im-brand" to="/" onClick={close}>
          IMovies
        </Link>
        <button className="navbar-toggler" type="button" aria-label="Toggle menu" onClick={() => setOpen(!open)}>
          <span className="navbar-toggler-icon" />
        </button>
        <div className={`collapse navbar-collapse ${open ? 'show' : ''}`}>
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/" end onClick={close}>Movies</NavLink>
            </li>
            {user && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/my-bookings" onClick={close}>My bookings</NavLink>
              </li>
            )}
            {user?.role === 'admin' && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/admin" onClick={close}>Admin</NavLink>
              </li>
            )}
          </ul>
          <div className="d-flex align-items-center gap-2">
            {user ? (
              <>
                <span className="text-secondary small">Hi, {user.name.split(' ')[0]}</span>
                <button className="btn btn-sm btn-outline-brass" onClick={onLogout}>Log out</button>
              </>
            ) : (
              <>
                <Link className="btn btn-sm btn-outline-brass" to="/login" onClick={close}>Log in</Link>
                <Link className="btn btn-sm btn-brass" to="/register" onClick={close}>Sign up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
