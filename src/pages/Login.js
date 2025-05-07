import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginStart, loginSuccess, loginFailure } from '../store/slices/authSlice';
import { login } from '../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(loginStart());
      const response = await login({ email, password });
      dispatch(loginSuccess(response.data));
      toast.success('Successfully logged in!');
      navigate('/dashboard');
    } catch (err) {
      dispatch(loginFailure(err.response?.data?.message || 'Login failed'));
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] px-4">
        <div className="w-full max-w-md rounded-2xl shadow-2xl bg-[#1f1b2e] p-8 text-white">
          <h2 className="text-2xl font-semibold text-center mb-2">Sign in to your account</h2>
          <p className="text-sm text-center mb-6 text-purple-300">
            Or{' '}
            <Link to="/register" className="text-pink-400 hover:underline">
              create a new account
            </Link>
          </p>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block mb-1 text-sm text-purple-200" htmlFor="email">
                Email address
              </label>
              <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-md bg-[#1f1d2b] text-white placeholder-gray-400 border border-transparent focus:outline-none focus:ring-0 focus:border-pink-400 transition-all"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm text-purple-200" htmlFor="password">
                Password
              </label>
              <input
                  type="password"
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-md bg-[#1f1d2b] text-white placeholder-gray-400 border border-transparent focus:outline-none focus:ring-0 focus:border-pink-400 transition-all"
              />
            </div>

            {error && (
                <div className="bg-red-500/10 text-red-400 text-sm py-2 px-4 rounded-lg text-center">
                  {error}
                </div>
            )}

            <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-indigo-500 hover:brightness-110 transition text-white font-semibold shadow-lg"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
  );
};

export default Login;
