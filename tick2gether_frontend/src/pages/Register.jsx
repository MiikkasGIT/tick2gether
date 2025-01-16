import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TextLogoIcon } from '../icons';
import { registerUser } from '../api'; 

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const newUser = { email, password };
      const response = await registerUser(newUser);
      if (response) {
        navigate('/login');
      } else {
        setErrorMessage('Registration failed');
      }
    } catch (error) {
      setErrorMessage('Error registering user. Please try again.');
      console.error('Error registering user:', error);
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
              Create your account
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
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blueCustom hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blueCustom"
                >
                  Create account
                </button>
              </div>
              {errorMessage && (
                <div className="mt-2 text-center text-sm text-red-600">
                  {errorMessage}
                </div>
              )}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link to="/login" className="font-medium text-blueCustom hover:text-blue-600">
                    Sign in
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

export default Register;