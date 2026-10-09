import { useState } from 'react';
import toast from 'react-hot-toast';
import { assets } from '../assets/assets';
import { apiRequest } from '../lib/api';

const Login = ({ onClose, onAuthSuccess }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    if (isSignup && formData.get('password') !== formData.get('confirmPassword')) {
      toast.error('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await apiRequest(`/auth/${isSignup ? 'register' : 'login'}`, {
        method: 'POST',
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          password: formData.get('password'),
        }),
      });
      sessionStorage.setItem('greencart_token', result.token);
      onAuthSuccess(result.user);
      onClose();
      toast.success(isSignup ? 'Your account is ready.' : 'Welcome back.');
    } catch (error) {
      toast.error(error instanceof TypeError ? 'Unable to reach the server. Check that the API is running.' : error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-backdrop" onMouseDown={onClose}>
      <section
        className="auth-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="auth-close" type="button" onClick={onClose} aria-label="Close sign in">
          <span aria-hidden="true">&times;</span>
        </button>

        <aside className="auth-visual">
          <img src={assets.main_banner_bg} alt="Fresh groceries ready for your basket" />
          <div className="auth-visual-copy">
            <span className="auth-kicker">GOOD FOOD, CLOSE TO HOME</span>
            <p>Bring a little more fresh into your day.</p>
            <span className="auth-promise">Picked with care. Delivered with care.</span>
          </div>
          <span className="auth-stamp" aria-hidden="true">FRESH<br />DAILY</span>
        </aside>

        <div className="auth-content">
          <div className="auth-brand">
            <img src={assets.logo} alt="GreenCart" />
            <span>YOUR NEIGHBORHOOD MARKET</span>
          </div>

          <div className="auth-heading">
            <span className="auth-kicker">{isSignup ? 'A FRESH START' : 'WELCOME BACK'}</span>
            <h1 id="auth-title">{isSignup ? 'Create your account' : 'Sign in to GreenCart'}</h1>
            <p>{isSignup ? 'Join us for an easier, fresher shop.' : 'Your next good meal is just around the corner.'}</p>
          </div>

          <div className="auth-tabs" role="tablist" aria-label="Choose account action">
            <button
              type="button"
              role="tab"
              aria-selected={!isSignup}
              className={!isSignup ? 'active' : ''}
              onClick={() => setIsSignup(false)}
            >
              Sign in
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={isSignup}
              className={isSignup ? 'active' : ''}
              onClick={() => setIsSignup(true)}
            >
              Create account
            </button>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {isSignup && (
              <label>
                Full name
                <input autoComplete="name" name="name" placeholder="e.g. Alex Morgan" required />
              </label>
            )}
            <label>
              Email address
              <input autoComplete="email" name="email" type="email" placeholder="you@example.com" required />
            </label>
            <label>
              Password
              <input
                autoComplete={isSignup ? 'new-password' : 'current-password'}
                name="password"
                type="password"
                minLength="8"
                placeholder="At least 8 characters"
                required
              />
            </label>
            {isSignup && (
              <label>
                Confirm password
                <input
                  autoComplete="new-password"
                  name="confirmPassword"
                  type="password"
                  minLength="8"
                  placeholder="Enter your password again"
                  required
                />
              </label>
            )}
            {!isSignup && (
              <button
                className="auth-forgot"
                type="button"
                onClick={() => toast('Password recovery is not connected yet.')}
              >
                Forgot password?
              </button>
            )}
            <button className="auth-submit" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Please wait...' : isSignup ? 'Create account' : 'Sign in'}
              <span aria-hidden="true">&rarr;</span>
            </button>
          </form>

          <p className="auth-legal">
            By continuing, you agree to GreenCart’s <a href="#terms">Terms</a> and <a href="#privacy">Privacy Policy</a>.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Login;
