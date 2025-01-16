import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';

const ShareHandler = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndFetchDetails = async () => {
      const jwtToken = localStorage.getItem('jwtToken') || Cookies.get('jwtToken');
      const isLoggedIn = !!jwtToken;

      console.log('JWT Token:', jwtToken);
      console.log('Is Logged In:', isLoggedIn);

      if (!isLoggedIn) {
        console.log('User not logged in, redirecting to login page...');
        navigate(`/login?returnUrl=/share/${token}`);
      } else {
        try {
          console.log('Fetching share details with token:', token);
          const response = await axios.get(`http://localhost:8080/api/v1/token/share/${token}`, {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          });
          console.log('Share details:', response.data);
          navigate('/dashboard');
        } catch (error) {
          if (error.response && error.response.status === 401) {
            console.log('Unauthorized, redirecting to login page...');
            navigate(`/login?returnUrl=/share/${token}`);
          } else {
            console.error('Error fetching share details:', error);
          }
        }
      }
    };

    checkAuthAndFetchDetails();
  }, [token, navigate]);

  return (
    <div>
      <h1>Processing Share Link...</h1>
    </div>
  );
};

export default ShareHandler;
