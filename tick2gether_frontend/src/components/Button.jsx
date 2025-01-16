import React from 'react';
import { Link } from 'react-router-dom';

const Button = ({ to, children }) => (
  <Link to={to} className="px-4 py-2 bg-blueCustom text-white rounded hover:bg-blue-700">
    {children}
  </Link>
);

export default Button;