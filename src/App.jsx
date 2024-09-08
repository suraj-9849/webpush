import React, { useState } from 'react';
import { messaging } from './firebase'; 
import { getToken } from 'firebase/messaging';

function App() {
  const [isTokenFetched, setIsTokenFetched] = useState(false);

  async function requestPermission() {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: 'BGZChcwaJ2OV1_I0ZIxXh6SnwSdd4850s3O8qw3KDWujsL1OD0JHhVtBWoYGNipYCt-_flit6bY6lqzZfepTdnY',
      });
      console.log('FCM Token:', token);

      await sendTokenToBackend(token);
      setIsTokenFetched(true);
    } else {
      alert('Notification permission denied');
    }
  }

  async function sendTokenToBackend(token) {
    try {
      const response = await fetch('http://localhost:5000/store-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });
      const data = await response.json();
      console.log('Token sent to backend:', data);
    } catch (error) {
      console.error('Error sending token to backend:', error);
    }
  }

  return (
    <div>
      <h1>FCM Notifications App</h1>
      {!isTokenFetched ? (
        <button onClick={requestPermission}>
          Enable Notifications
        </button>
      ) : (
        <p>Notifications enabled!</p>
      )}
    </div>
  );
}

export default App;
