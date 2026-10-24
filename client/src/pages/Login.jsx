import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { errMsg } from '../api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await login(email, password);
      navigate(location.state?.from || '/', { replace: true });
    } catch (err) {
      setError(errMsg(err, 'Could not log in'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-wrap">
      <form className="auth-card" onSubmit={submit}>
        <h1 className="auth-title">Log in</h1>
        {error && <div className="alert alert-danger py-2">{error}</div>}
        <label className="form-label" htmlFor="email">Email</label>
        <input id="email" type="email" className="form-control im-input mb-3" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
        <label className="form-label" htmlFor="password">Password</label>
        <input id="password" type="password" className="form-control im-input mb-4" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button className="btn btn-brass w-100" disabled={busy}>{busy ? 'Logging in…' : 'Log in'}</button>
        <p className="text-secondary small mt-3 mb-0">
          New here? <Link to="/register" state={location.state}>Create an account</Link>
        </p>
      </form>
    </div>
  );
}
