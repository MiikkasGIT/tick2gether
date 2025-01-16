import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { TextLogoIcon } from '../icons';
import { loginUser } from '../api';
import Cookies from 'js-cookie';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleRememberMeChange = (event) => {
    setRememberMe(event.target.checked);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { accessToken } = await loginUser({ email, password });
      console.log('Login response token:', accessToken);

      if (accessToken) {
        Cookies.set('jwtToken', accessToken, { expires: rememberMe ? 7 : 1 }); // Save token in cookies
        const returnUrl = new URLSearchParams(location.search).get('returnUrl') || '/dashboard';
        navigate(returnUrl);
      } else {
        setErrorMessage('Login failed: No token found in response');
      }
    } catch (error) {
      setErrorMessage('Error logging in. Please try again.');
      console.error('Error logging in:', error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-4 pb-6">
          <TextLogoIcon className="h-8 w-auto" />
        </div>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 rounded-2xl border border-gray-200 sm:px-10">
            <h2 className="text-left text-2xl pb-6 font-medium text-gray-900">
              Sign in to your account
            </h2>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 focus:border-blueCustom focus:outline-none focus:ring-blueCustom sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 focus:border-blueCustom focus:outline-none focus:ring-blueCustom sm:text-sm"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={handleRememberMeChange}
                    className="h-4 w-4 text-blueCustom focus:ring-blueCustom border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Remember me
                  </label>
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blueCustom hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blueCustom"
                >
                  Sign in
                </button>
              </div>
              {errorMessage && (
                <div className="mt-2 text-center text-sm text-red-600">
                  {errorMessage}
                </div>
              )}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Not a member?{' '}
                  <Link to="/register" className="font-medium text-blueCustom hover:text-blue-600">
                    Create Account
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
