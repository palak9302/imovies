import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { errMsg } from '../api';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    setBusy(true);
    setError('');
    try {
      await register(form.name, form.email, form.password);
      navigate(location.state?.from || '/', { replace: true });
    } catch (err) {
      setError(errMsg(err, 'Could not create the account'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-wrap">
      <form className="auth-card" onSubmit={submit}>
        <h1 className="auth-title">Create account</h1>
        {error && <div className="alert alert-danger py-2">{error}</div>}
        <label className="form-label" htmlFor="name">Name</label>
        <input id="name" className="form-control im-input mb-3" value={form.name} onChange={set('name')} required autoFocus />
        <label className="form-label" htmlFor="email">Email</label>
        <input id="email" type="email" className="form-control im-input mb-3" value={form.email} onChange={set('email')} required />
        <label className="form-label" htmlFor="password">Password</label>
        <input id="password" type="password" className="form-control im-input mb-1" value={form.password} onChange={set('password')} required minLength={6} />
        <div className="form-text mb-4">At least 6 characters.</div>
        <button className="btn btn-brass w-100" disabled={busy}>{busy ? 'Creating…' : 'Sign up'}</button>
        <p className="text-secondary small mt-3 mb-0">
          Already have an account? <Link to="/login" state={location.state}>Log in</Link>
        </p>
      </form>
    </div>
  );
}
