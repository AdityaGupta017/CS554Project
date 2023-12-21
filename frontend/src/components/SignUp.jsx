import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { doCreateUserWithEmailAndPassword } from '../firebase/FirebaseFunctions';
import { Button, TextField, Snackbar, Box } from '@mui/material';

import { AuthContext } from '../context/AuthContext';
import SocialSignIn from './SocialSignIn';
import axios from 'axios';

function SignUp() {
  const { currentUser } = useContext(AuthContext);
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [ pwMatch, setPwMatch] = useState('');
  const navigate = useNavigate();
  console.log("currentUser",currentUser)

  const showErrorSnackbar = (message) => {
    setError(message);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const { displayName, email, passwordOne, passwordTwo } = e.target.elements;

    let nameValid = displayName.value.trim()
    if (nameValid.length === 0)
    showErrorSnackbar(`Name cannot be an empty string or string with just spaces`);

        if(!nameValid.match(/^[a-z ,.'-]+$/gi)){
          showErrorSnackbar(`Name shouldn't contain numbers`)
          return;
        }
        if(!(nameValid.length>1 & nameValid.length<25)){
          showErrorSnackbar(`Name should contain atleast 2 characters and less than 26 characters`)
          return;
        }

    let emailValid = email.value.trim().toLowerCase();
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(emailValid)) {
      showErrorSnackbar("Invalid email address");
      return;
    }
    if (!emailValid.endsWith("@gmail.com")) {
      showErrorSnackbar("Email domain must be @gmail.com");
      return;
    }
    if (!/^[^\s@]{3,}@gmail\.com$/.test(emailValid)) {
      showErrorSnackbar("Email address must have at least 3 characters before the @gmail.com domain");
      return;
    }

    let passowrdValid = passwordOne.value
    if (!passowrdValid || passowrdValid.length < 8 || passowrdValid.includes(" ")) {
      showErrorSnackbar(`Password must be at least 8 characters long and cannot contain empty spaces.`);
      return;
    }
    const upperCase = /[A-Z]/;
    const numberCase = /[0-9]/;
    const specialCharCase = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    if (
      !upperCase.test(passowrdValid) ||
      !numberCase.test(passowrdValid) ||
      !specialCharCase.test(passowrdValid)
    ) {
      showErrorSnackbar(` Password must contain at least one uppercase character, one number, and one special character.`);
      return;
    }

    passowrdValid = passwordTwo.value
    if (!passowrdValid || passowrdValid.length < 8 || passowrdValid.includes(" ")) {
      showErrorSnackbar(`Confirm Password must be at least 8 characters long and cannot contain empty spaces.`);
      return;
    }

    if (
      !upperCase.test(passowrdValid) ||
      !numberCase.test(passowrdValid) ||
      !specialCharCase.test(passowrdValid)
    ) {
      showErrorSnackbar(`Confirm Password must contain at least one uppercase character, one number, and one special character.`);
      return;
    }

    if (passwordOne.value !== passwordTwo.value) {
      // setPwMatch('Passwords do not match');
      showErrorSnackbar('Passwords do not match')
      return false;
    }

    try {
      const userCreated = await doCreateUserWithEmailAndPassword(
        email.value,
        passwordOne.value,
        displayName.value
      );

      console.log('User created:', userCreated);

      const serverResponse = await axios.post('http://localhost:3000/usersData/signUpUser', {
        name: displayName.value,
        email: email.value,
        password: passwordOne.value
      });

      const insertedUserId = serverResponse.data.insertedId;
      console.log('Inserted User ID:', insertedUserId);
      if(insertedUserId){
        showErrorSnackbar("You are now registered. Please Login to MusicMates")
        navigate('/signin');
      }

    } catch (error) {
      showErrorSnackbar(error.message || 'An error occurred. Please try again.');
      return;
    
    }
  };

  // console.log("is created user", userCreated)
  // if (userCreated) {
  //   return <Navigate to='/signin' />;
  // }

  if (currentUser) {
    navigate('/dashboard');
  }

  return (
    <div className='card' style={{ backgroundColor: '#ffe4e1', padding: '20px' }}>
      <h1 style={{ color: '#008080', textAlign: 'center' }}>Enjoy Listening to Music By Signing up</h1>
      {pwMatch && <h4 className='error' style={{ color: '#ff7f50', textAlign: 'center' }}>{pwMatch}</h4>}
      <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', mb: 2 }}>
  <span style={{ color: '#008080', marginRight: '8px' }}>Name</span>
  <TextField
    // label="Name"
    required
    name='displayName'
    placeholder='Enter Name'
    autoFocus
    fullWidth
    sx={{ input: { color: '#008080' }, label: { color: '#008080' } }}
  />
</Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ color: '#008080', marginRight: '8px' }}>Email</span>
          <TextField
            // label="Email"
            required
            name='email'
            type='email'
            placeholder='Enter email id'
            sx={{ input: { color: '#008080' }, label: { color: '#008080' } }}
          />
          
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ color: '#008080', marginRight: '8px' }}>Password</span>
          <TextField
            // label="Password"
            id='passwordOne'
            name='passwordOne'
            type='password'
            placeholder='Enter Password'
            autoComplete='off'
            required
            sx={{ input: { color: '#008080' }, label: { color: '#008080' } }}
          />
          
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ color: '#008080', marginRight: '8px' }}>Confirm Password</span>
          <TextField
            // label="Confirm Password"
            id='passwordTwo'
            name='passwordTwo'
            type='password'
            placeholder='Re-enter Password'
            autoComplete='off'
            required
            sx={{ input: { color: '#008080' }, label: { color: '#008080' } }}
          />
          
        </Box>
        <Button
          sx={{
            mt: 2,
            bgcolor: '#40e0d0',
            '&:hover': { bgcolor: '#36b4a8' },
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            cursor: 'pointer',
            display: 'block',
            mx: 'auto', 
            width: 'fit-content', 
          }}
          type='submit'
        >
          Sign-Up
        </Button>
        <Link to='/signin' style={{ textDecoration: 'none', width: 'fit-content', margin: 'auto' }}>
          <Button
            sx={{
              mt: 2,
              bgcolor: '#ff7f50',
              '&:hover': { bgcolor: '#e06c45' },
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              cursor: 'pointer',
            }}
            type='button'
          >
            Already Registered? Sign In
          </Button>
        </Link>
      </form>
      <br />
      <SocialSignIn />
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={error}
        action={
          <Button color="inherit" size="small" onClick={handleCloseSnackbar}>
            Close
          </Button>
        }
      />
    </div>
  );
  
}

export default SignUp;