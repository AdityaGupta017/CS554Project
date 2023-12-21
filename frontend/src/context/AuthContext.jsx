import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    let myListener = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      console.log('onAuthStateChanged', user);
      setLoadingUser(false);
    });

    return () => {
      if (myListener) myListener();
    };
  }, []);

  if (loadingUser) {
    return (
      <div className='card' style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh', 
        textAlign: 'center', 
        backgroundColor: '#ffe4e1' 
      }}>
        <h1 style={{ color: '#008080' }}>Loading...</h1> 
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
