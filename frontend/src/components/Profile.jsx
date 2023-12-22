import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { doChangePassword, doSignOut } from '../firebase/FirebaseFunctions';
import { updateProfile } from 'firebase/auth';
// import { useHistory } from 'react-router-dom'; // Import the useHistory hook
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import { AppBar, Toolbar, Button, TextField, Typography, Box } from '@mui/material';
import axios from 'axios';

function Profile() {
  const { currentUser } = useContext(AuthContext);
//   const history = useHistory(); // Access the history object

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newName, setNewName] = useState(currentUser?.displayName || '');
  const [isEditingName, setIsEditingName] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const showErrorSnackbar = (message) => {
    setError(message);
    setOpenSnackbar(true);
  };

  useEffect(() => {
    setNewName(currentUser?.displayName || '');
  }, [currentUser]);

  const handleChangePassword = async () => {
    try {
      if (!currentUser || currentPassword === null) {
        return;
      }

      let passwordValid = currentPassword
      if (!passwordValid || passwordValid.length < 8 || passwordValid.includes(" ")) {
        showErrorSnackbar(`Password must be at least 8 characters long and cannot contain empty spaces.`);
        return;
      }
      const upperCase = /[A-Z]/;
      const numberCase = /[0-9]/;
      const specialCharCase = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
      if (
        !upperCase.test(passwordValid) ||
        !numberCase.test(passwordValid) ||
        !specialCharCase.test(passwordValid)
      ) {
        showErrorSnackbar(` Password must contain at least one uppercase character, one number, and one special character.`);
        return;
      }
  
      passwordValid = newPassword
      if (!passwordValid || passwordValid.length < 8 || passwordValid.includes(" ")) {
        showErrorSnackbar(`New Password must be at least 8 characters long and cannot contain empty spaces.`);
        return;
      }
  
      if (
        !upperCase.test(passwordValid) ||
        !numberCase.test(passwordValid) ||
        !specialCharCase.test(passwordValid)
      ) {
        showErrorSnackbar(`New Password must contain at least one uppercase character, one number, and one special character.`);
        return;
      }
  

      await doChangePassword(currentUser.email, currentPassword, newPassword);
      const result = await axios.post('https://backend.musicmates.club/usersData/PasswordUpdate', {
        email: currentUser.email,
        password: newPassword
      });
      console.log("Password Updated:", result);
      setNewPassword('');
      setCurrentPassword('');
      setError(null);
      alert('Password changed successfully!');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleEditName = () => {
    setIsEditingName(true);
  };

  const handleSaveName = async () => {
    try {
      let nameValid = newName.trim()
      if (nameValid.length === 0){
        showErrorSnackbar(`Name cannot be an empty string or string with just spaces`);
        return;
      }

      if(!nameValid.match(/^[a-z ,.'-]+$/gi)){
        showErrorSnackbar(`Name shouldn't contain numbers`)
        return;
      }
      if(!(nameValid.length>1 & nameValid.length<26)){
        showErrorSnackbar(`Name should contain atleast 2 characters and less than 26 characters`)
        return;
      }

      await updateProfile(currentUser, { displayName: newName });
      const result = await axios.post('https://backend.musicmates.club/usersData/NameUpdate', {
        name: newName,
        email: currentUser.email
      });
      console.log("Name Updated:", result);
      setIsEditingName(false);
      setError(null);
      alert('Name updated successfully!');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleTogglePasswordChange = () => {
    setIsChangingPassword(!isChangingPassword);
    setCurrentPassword('');
    setNewPassword('');
  };

  const isEmailPasswordSignIn = () => {
    return currentUser && currentUser.providerData.some((info) => info.providerId === 'password');
  };

//   const handleSignOut = async () => {
//     try {
//       await doSignOut();
//       // Redirect to the sign-in page after sign-out
//       history.push('/signin');
//     } catch (error) {
//       setError(error.message);
//     }
//   };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h2>Profile</h2>
      <p>Email: {currentUser?.email}</p>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
        <label style={{ marginRight: '10px', minWidth: '50px' }}>Name:</label>
        {isEditingName ? (
          <>
            <input
              type="text"
              id="newName"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              style={{ maxWidth: '150px' }}
            />
            <IconButton
              size="small"
              onClick={handleSaveName}
              aria-label="Save"
              style={{ marginLeft: '5px', padding: '5px', maxWidth: '20px', maxHeight: '20px', borderRadius: '0' }}
            >
              <CheckIcon fontSize="small" />
            </IconButton>
          </>
        ) : (
          <>
            <span>{newName}</span>
            <IconButton
              size="small"
              onClick={handleEditName}
              aria-label="Edit"
              style={{ marginLeft: '5px', padding: '5px', maxWidth: '20px', maxHeight: '20px', borderRadius: '0' }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {isChangingPassword && isEmailPasswordSignIn() && (
          <>
            <div style={{ display: 'flex', marginBottom: '10px' }}>
              <label style={{ marginRight: '10px' }}>Current Password:</label>
              <input
                type="password"
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex' }}>
              <label style={{ marginRight: '10px' }}>New Password:</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
          </>
        )}
        {isEmailPasswordSignIn() && (
        <Button
          onClick={isChangingPassword ? handleChangePassword : handleTogglePasswordChange}
          style={{
            backgroundColor: '#ff7f50',
            color: 'white',
            padding: '10px 20px',
            margin: '10px auto',
            display: 'block',
            width: '200px',
            height: '50px',
          }}
          variant="contained"
        >
          {isChangingPassword ? 'Change Password' : 'Change Password'}
        </Button>
        )}

        {!isEmailPasswordSignIn() && (
          <Typography variant="body2" color="textSecondary" style={{ fontSize: '16px' }}>
            Cannot change password for social sign-in
          </Typography>
        )}
        {/* <Button
          onClick={handleSignOut}
          style={{
            backgroundColor: 'red',
            color: 'white',
            padding: '10px 20px',
            margin: '10px auto',
            display: 'block',
            width: '200px',
            height: '50px',
          }}
          variant="contained"
        >
          Sign Out
        </Button> */}

        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </div>
  );
}

export default Profile;
