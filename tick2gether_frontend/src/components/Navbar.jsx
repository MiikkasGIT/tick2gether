import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SignOutIcon, TextLogoIcon } from '../icons';
import { logoutUser } from '../api';

function Navbar() {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await logoutUser();
      navigate('/login'); 
    } catch (error) {
      console.error('Fehler bei der Abmeldung:', error);
      
    }
  };
  
  return (
    <div className="w-full bg-white p-4 border rounded-large">
      <div className="flex justify-between items-center max-w-5xl mx-auto">
        <TextLogoIcon className="h-8" alt="Tick2gether Logo" />
        <button
          type="button"
          onClick={handleSignOut}
          className="relative rounded-full bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
          style={{
            width: '30px',
            height: '30px',
            flexShrink: 0,
            borderRadius: '10px',
            background: 'var(--Shade, rgba(0, 0, 0, 0.05))'
          }}
        >
          <span className="sr-only">Sign out</span>
          <SignOutIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

export default Navbar;