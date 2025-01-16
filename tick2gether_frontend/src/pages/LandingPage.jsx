import React from 'react';
import { Link } from 'react-router-dom';
import { TextLogoIcon } from '../icons'; 
import todoIllustration from '../assets/illustrations/todo_illustration.svg';  // Der Pfad zu deiner Illustration

const LandingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="flex flex-col items-center justify-center gap-2 w-80 p-8 rounded-2xl border border-gray-200 bg-white">
        <TextLogoIcon className="h-6 w-auto mb-4" />
        <img src={todoIllustration} alt="ToDo Illustration" className="w-full h-auto mb-7" />
        <div className="flex flex-col items-center gap-4 w-full">
          <Link 
            to="/register" 
            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blueCustom hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blueCustom">
            Get Started
          </Link>

          
          <Link 
            to="/login" 
            className="w-full px-4 py-2 text-center text-gray-700 bg-gray-200 rounded-md font-medium hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50 active:bg-gray-300"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;