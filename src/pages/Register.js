import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { registerStart, registerSuccess, registerFailure } from '../store/slices/authSlice';
import { register } from '../services/api';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      dispatch(registerStart());
      const response = await register({
        email: formData.email,
        password: formData.password,
      });

      dispatch(registerSuccess(response.data));
      toast.success('Successfully registered!');
      navigate('/dashboard');
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Registration failed';
      dispatch(registerFailure(errorMessage));
      toast.error(errorMessage);
    }
  };

  return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] px-4">
        <div className="w-full max-w-md">
          <div className="bg-[#15141b] shadow-xl rounded-2xl px-8 py-10 space-y-8">
            <div>
              <h2 className="text-center text-3xl font-bold tracking-tight text-white">
                Create your account
              </h2>
              <p className="mt-2 text-center text-sm text-gray-400">
                Or{' '}
                <Link
                    to="/login"
                    className="font-medium text-pink-400 hover:text-pink-300 transition-colors"
                >
                  sign in to your account
                </Link>
              </p>
            </div>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-5">
                <div>
                  <label htmlFor="email-address" className="block text-sm font-medium text-gray-300">
                    Email address
                  </label>
                  <div className="mt-1">
                    <input
                        id="email-address"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="w-full px-4 py-3 rounded-md bg-[#1f1d2b] text-white placeholder-gray-400 border border-transparent focus:outline-none focus:ring-0 focus:border-pink-400 transition-all"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                    Password
                  </label>
                  <div className="mt-1">
                    <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        required
                        className="w-full px-4 py-3 rounded-md bg-[#1f1d2b] text-white placeholder-gray-400 border border-transparent focus:outline-none focus:ring-0 focus:border-pink-400 transition-all"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                    Confirm Password
                  </label>
                  <div className="mt-1">
                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        autoComplete="new-password"
                        required
                        className="w-full px-4 py-3 rounded-md bg-[#1f1d2b] text-white placeholder-gray-400 border border-transparent focus:outline-none focus:ring-0 focus:border-pink-400 transition-all"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {error && (
                  <div className="text-sm text-center text-red-500 bg-red-100 rounded-lg py-2">
                    {error}
                  </div>
              )}

              <div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 text-base font-medium rounded-md bg-gradient-to-r from-pink-500 to-indigo-500 text-white shadow-md hover:brightness-110 transition-all"
                >
                  {isLoading ? 'Creating...' : 'Create account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
  );
};

export default Register;
