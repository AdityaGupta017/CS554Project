// import React, { useContext } from 'react';
// import SocialSignIn from './SocialSignIn';
// import { Link, Navigate } from 'react-router-dom';
// import axios from 'axios';
// import { TextField, Button, Card, CardContent, Typography, Snackbar } from '@mui/material';
// import { AuthContext } from '../context/AuthContext';
// import { doPasswordReset, doSignInWithEmailAndPassword } from '../firebase/FirebaseFunctions';
// // import Button from '@mui/material/Button';

// function SignIn() {
//   const { currentUser } = useContext(AuthContext);
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');

//   const handleLogin = async (event) => {
//     event.preventDefault();
//     let { email, password } = event.target.elements;

//     let emailValid = email.value.trim().toLowerCase();
//     const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!regex.test(emailValid)) {
//       alert("Invalid email address");
//     }
//     if (!emailValid.endsWith("@gmail.com")) {
//       alert("Email domain must be @gmail.com");
//     }
//     if (!/^[^\s@]{3,}@gmail\.com$/.test(emailValid)) {
//       alert("Email address must have at least 3 characters before the @gmail.com domain");
//     }

//     let passowrdValid = password.value
//     if (!passowrdValid || passowrdValid.length < 8 || passowrdValid.includes(" ")) {
//       alert(`Password must be at least 8 characters long and cannot contain empty spaces.`);
//     }
//     const upperCase = /[A-Z]/;
//     const numberCase = /[0-9]/;
//     const specialCharCase = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
//     if (
//       !upperCase.test(passowrdValid) ||
//       !numberCase.test(passowrdValid) ||
//       !specialCharCase.test(passowrdValid)
//     ) {
//       alert(`Password must contain at least one uppercase character, one number, and one special character.`);
//     }

//     try {
//       await doSignInWithEmailAndPassword(email.value, password.value);
//       await axios.post('http://localhost:3000/usersData/login', {
//         email: email.value,
//       });

//       // console.log('login server response:', serverResponse);
//       // await client.set('userId', JSON.stringify(serverResponse.data)); // assuming you have userId defined somewhere
//     } catch (error) {
//       alert(error);
//     }
//   };

//   const passwordReset = (event) => {
//     event.preventDefault();
//     let email = document.getElementById('email').value;
//     if (email) {
//       doPasswordReset(email);
//       alert('Password reset email was sent');
//     } else {
//       alert('Please enter an email address below before you click the forgot password link');
//     }
//   };

//   if (currentUser) {
//     return <Navigate to='/dashboard' />;
//   }

//   return (
//     <Card variant="outlined" sx={{ maxWidth: 400, m: 'auto', mt: 10 }}>
//       <CardContent>
//         <Typography variant="h5" component="h1" gutterBottom>
//           Log-In to Music Mates
//         </Typography>
//         <form onSubmit={handleLogin}>
//           <TextField
//             label="Email Address"
//             variant="outlined"
//             fullWidth
//             margin="normal"
//             required
//             autoFocus
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//           <TextField
//             label="Password"
//             variant="outlined"
//             fullWidth
//             margin="normal"
//             required
//             type="password"
//             autoComplete="off"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />
//           <Button sx={{ mt: 2 }} variant="contained" color="primary" fullWidth type="submit">
//             Log in
//           </Button>
//         </form>
//         <Button sx={{ mt: 2 }} onClick={passwordReset} fullWidth>
//           Forgot Password
//         </Button>
//         <Link to='/signup' style={{ textDecoration: 'none' }}>
//           <Button sx={{ mt: 2, mb: 2 }} variant="contained" color="secondary" fullWidth>
//             Not a Member? Sign Up
//           </Button>
//         </Link>
//         <SocialSignIn />
//       </CardContent>
//     </Card>
//     {error && (
//       <Snackbar
//         open={!!error}
//         autoHideDuration={6000}
//         onClose={() => setError('')}
//         message={error}
//       />
//     )}
//   );

// }

// export default SignIn;

import React, { useContext, useState } from 'react'; // Fixed by importing useState
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Card, CardContent, Typography, Snackbar } from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import { doPasswordReset, doSignInWithEmailAndPassword } from '../firebase/FirebaseFunctions';
import SocialSignIn from './SocialSignIn';

function SignIn() {
  const { currentUser } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (event) => {
    event.preventDefault();

    // You're already using the email and password from state, no need to get it from event.target
    // let { email, password } = event.target.elements;

    let emailValid = email.trim().toLowerCase();
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(emailValid)) {
      setError("Invalid email address");
      return; // Exit early if invalid
    }
    if (!emailValid.endsWith("@gmail.com")) {
      setError("Email domain must be @gmail.com");
      return; // Exit early if invalid
    }
    if (!/^[^\s@]{3,}@gmail\.com$/.test(emailValid)) {
      setError("Email address must have at least 3 characters before the @gmail.com domain");
      return; // Exit early if invalid
    }

    let passwordValid = password;
    if (!passwordValid || passwordValid.length < 8 || passwordValid.includes(" ")) {
      setError(`Password must be at least 8 characters long and cannot contain empty spaces.`);
      return; // Exit early if invalid
    }
    const upperCase = /[A-Z]/;
    const numberCase = /[0-9]/;
    const specialCharCase = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    if (
      !upperCase.test(passwordValid) ||
      !numberCase.test(passwordValid) ||
      !specialCharCase.test(passwordValid)
    ) {
      setError(`Password must contain at least one uppercase character, one number, and one special character.`);
      return; // Exit early if invalid
    }

    try {
      await doSignInWithEmailAndPassword(emailValid, passwordValid);
      await axios.post('http://localhost:3000/usersData/login', {
        email: emailValid,
      });
    } catch (error) {
      setError(error.message); // Assuming error has a 'message' property
    }
  };

  const passwordReset = () => {
    // You can use the email state here instead of getting it from the DOM
    if (email) {
      doPasswordReset(email);
      setError('Password reset email was sent');
    } else {
      setError('Please enter an email address below before you click the forgot password link');
    }
  };

  if (currentUser) {
    return <Navigate to='/dashboard' />;
  }

  return (
    <>
      <Card variant="outlined" sx={{ maxWidth: 400, m: 'auto', mt: 10, backgroundColor: '#ffe4e1' }}>
        <CardContent>
          <Typography variant="h5" component="h1" gutterBottom sx={{ color: '#008080' }}>
            Log-In to Music Mates
          </Typography>
          <form onSubmit={handleLogin}>
            <TextField
              label="Email Address"
              variant="outlined"
              fullWidth
              margin="normal"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ label: { color: '#008080' }, input: { color: '#008080' } }}
            />
            <TextField
              label="Password"
              variant="outlined"
              fullWidth
              margin="normal"
              required
              type="password"
              autoComplete="off"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ label: { color: '#008080' }, input: { color: '#008080' } }}
            />
            <Button sx={{ mt: 2, bgcolor: '#40e0d0', '&:hover': { bgcolor: '#36b4a8' } }} fullWidth type="submit">
              Log in
            </Button>
          </form>
          <Button sx={{ mt: 2, bgcolor: '#ff7f50', '&:hover': { bgcolor: '#e06c45' } }} onClick={passwordReset} fullWidth>
            Forgot Password
          </Button>
          <Link to='/signup' style={{ textDecoration: 'none' }}>
            <Button sx={{ mt: 2, mb: 2, bgcolor: '#40e0d0', '&:hover': { bgcolor: '#36b4a8' } }} fullWidth>
              Not a Member? Sign Up
            </Button>
          </Link>
          <SocialSignIn />
        </CardContent>
      </Card>
      {error && (
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError('')}
          message={error}
        />
      )}
    </>
  );
  
}

export default SignIn;

