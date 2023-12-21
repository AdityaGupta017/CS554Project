// import { Router } from 'express';
// export const router = Router();
// import querystring from 'querystring';
// import axios from 'axios'; // Axios library
// import dotenv from 'dotenv';
// import xss from 'xss';

// dotenv.config();
// const CLIENT_ID = process.env.CLIENT_ID // Your client id
// const CLIENT_SECRET = process.env.CLIENT_SECRET; // Your secret
// const redirect_uri = 'http://localhost:3000/users/callback'; // Your redirect uri

// const generateRandomString = (length) => {
//   let text = '';
//   const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

//   for (let i = 0; i < length; i++) {
//     text += possible.charAt(Math.floor(Math.random() * possible.length));
//   }
//   return text;
// };

// const stateKey = 'spotify_auth_state';
// router
//   .route('/login')
//   // .get(async (req, res) => {
//   //   console.log("login page")
//   //   res.status(200).render('pages/login', { title: "Login" })
//   // })
//   .get(async (req, res) => {
//     console.log("login post")

//     let error = false;

//     // Check missing fields
    

//     // Check valid username and password input
    
    
        
//     const state = generateRandomString(16);
//     res.cookie(stateKey, state);

//     // your application requests authorization
//     const scope = 'user-read-private user-read-email user-top-read user-read-recently-played';
//     console.log(res.json)
//     return res.json(
//       'https://accounts.spotify.com/authorize?' + querystring.stringify({
//         response_type: 'code',
//         client_id: CLIENT_ID,
//         scope,
//         redirect_uri,
//         state,
//       })
//     );
//   })


// router.get('/callback', async (req, res) => {
//   console.log("callback")
//   // your application requests refresh and access tokens
//   // after checking the state parameter
//   const code = req.query.code || null;
//   const state = req.query.state || null;
//   // console.log(state);
//   // const storedState = req.cookies ? req.cookies[stateKey] : null;
//   // console.log(storedState)

//   if (state === null) {
//     res.redirect('/#' + querystring.stringify({ error: 'state_mismatch' }));
//   } else {
//     res.clearCookie(stateKey);
//     const authOptions = {
//       url: 'https://accounts.spotify.com/api/token',
//       data: {
//         code,
//         redirect_uri,
//         grant_type: 'authorization_code',
//       },
//       headers: {
//         Authorization: 'Basic ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'),
//       },
//     };

//     try {
//       const { data: body } = await axios.post(authOptions.url, querystring.stringify(authOptions.data), {
//         headers: authOptions.headers,
//       });

//       if (body && body.access_token) {
//         const { access_token, refresh_token } = body;

//         if (!req.session.user) {
//           req.session.user = {};
//         }

//         // Storing access_token and refresh token in session
//         req.session.user.access_token = access_token;
//         req.session.user.refresh_token = refresh_token;

//         console.log(access_token);

//         return res.redirect(`http://localhost:5173/dashboard?access_token=${access_token}`);
   
//       } else {
//         res.redirect('/#' + querystring.stringify({ error: 'invalid_token' }));
//       }
//     } catch (error) {
//       console.error(error);
//       res.redirect('/#' + querystring.stringify({ error: 'invalid_token' }));
//     }
//   }
// });


// router.get('/refresh_token', async (req, res) => {
//   try {
//     const refresh_token = req.query.refresh_token;
//     const authOptions = {
//       url: 'https://accounts.spotify.com/api/token',
//       headers: { 'Authorization': 'Basic ' + (new Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')) },
//       data: {
//         grant_type: 'refresh_token',
//         refresh_token: refresh_token
//       }
//     };
    
//     const response = await axios.post(authOptions.url, authOptions.data, { headers: authOptions.headers });
//     if (response.status === 200) {
//       const access_token = response.data.access_token;
//       res.send({
//         'access_token': access_token
//       });
//     }
//   } catch (error) {
//     console.error(error);
//     res.sendStatus(500);
//   }
// });



// router.get('/dashboard', (req, res) => {
//   console.log("dashboard page")
//   if (req.session.user && req.session.user.access_token) {
//     console.log(req.session.user)
//     // If there is a user session and an access token, assume connection is successful
//     return res.status(200).json('Successfully connected to Spotify');
//   } else {
//     // If there is no user session or access token, redirect to login or home
//     res.redirect("/");
//   }
// });




// export default router;













import { Router } from 'express';
export const router = Router();
import querystring from 'querystring';
import axios from 'axios'; // Axios library
import dotenv from 'dotenv';
import xss from 'xss';
import * as userData from '../../data/users.js'

dotenv.config();
const CLIENT_ID = process.env.CLIENT_ID // Your client id
const CLIENT_SECRET = process.env.CLIENT_SECRET; // Your secret
const redirect_uri = 'http://localhost:3000/users/callback'; // Your redirect uri

const generateRandomString = (length) => {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const stateKey = 'spotify_auth_state';
router
  .route('/login')
  // .get(async (req, res) => {
  //   console.log("login page")
  //   res.status(200).render('pages/login', { title: "Login" })
  // })
  .get(async (req, res) => {



    try 
    {
      console.log("login post")

      let error = false;
  
      // Check missing fields
      
  
      // Check valid username and password input
      
      
          
      const state = generateRandomString(16);
      res.cookie(stateKey, state);
  
      // your application requests authorization
      const scope = "streaming user-read-email user-read-private user-read-playback-state user-modify-playback-state";

      return res.json(
        'https://accounts.spotify.com/authorize?' + querystring.stringify({
          response_type: 'code',
          client_id: CLIENT_ID,
          scope,
          redirect_uri,
          state,
        })
      );


    }

    catch(e)

    
    {
      console.log(e)
      return res.json({e})
    }

  })


router.get('/callback', async (req, res) => {
  console.log("callback")
  // your application requests refresh and access tokens
  // after checking the state parameter
  const code = req.query.code || null;
  const state = req.query.state || null;
  // console.log(state);
  // const storedState = req.cookies ? req.cookies[stateKey] : null;
  // console.log(storedState)

  if (state === null) {
    res.redirect('/#' + querystring.stringify({ error: 'state_mismatch' }));
  } else {
    res.clearCookie(stateKey);
    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      data: {
        code,
        redirect_uri,
        grant_type: 'authorization_code',
      },
      headers: {
        Authorization: 'Basic ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'),
      },
    };

    try {
      const { data: body } = await axios.post(authOptions.url, querystring.stringify(authOptions.data), {
        headers: authOptions.headers,
      });

      if (body && body.access_token) {
        const { access_token, refresh_token } = body;

        if (!req.session.user) {
          req.session.user = {};
        }
        console.log(req.session.user);
        // Storing access_token and refresh token in session
        req.session.user={...req.session.user, access_token, refresh_token};

        console.log(req.session.user);

        return res.redirect(`http://localhost:5173/dashboard?access_token=${access_token}`);
        // res.redirect('/users/dashboard');
   
      } else {
        res.redirect('/#' + querystring.stringify({ error: 'invalid_token' }));
      }
    } catch (error) {
      console.error(error);
      res.redirect('/#' + querystring.stringify({ error: 'invalid_token' }));
    }
  }
});


router.get('/refresh_token', async (req, res) => {
  try {
    const refresh_token = req.query.refresh_token;
    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      headers: { 'Authorization': 'Basic ' + (new Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')) },
      data: {
        grant_type: 'refresh_token',
        refresh_token: refresh_token
      }
    };
    
    const response = await axios.post(authOptions.url, authOptions.data, { headers: authOptions.headers });
    if (response.status === 200) {
      const access_token = response.data.access_token;
      res.send({
        'access_token': access_token
      });
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});



router.get('/dashboard', (req, res) => {
  console.log("dashboard page")
  if (req.session.user && req.session.user.access_token) {
    console.log(req.session.user)
    // If there is a user session and an access token, assume connection is successful
    return res.redirect(`http://localhost:5173/dashboard?access_token=${req.session.user.access_token}`);

    //return res.status(200).json('Successfully connected to Spotify');
  } else {
    // If there is no user session or access token, redirect to login or home
    res.redirect("/");
  }
});

export default router;
