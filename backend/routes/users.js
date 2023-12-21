import { Router } from 'express';
export const router = Router();

import { users } from "../config/mongoCollection.js";
import * as userData from '../data/users.js'
import bcryptjs from 'bcryptjs';
import xss from 'xss';
import redis from 'redis';

const client = redis.createClient();
// client.connect().then(() => {});

router.post("/login", async (req, res) => {
    try {
      console.log("req", req.body);
      const email_input = req.body.email;
      console.log("login user route");
      const user = await userData.getUserByEmailForLogin(email_input);
      const userId = user._id
      console.log("session data login",req.session)
      if (user) {
        console.log("User Found:", user);
        await client.set('userId', JSON.stringify(userId));
        let stored_user = await client.get('userId');
        console.log("stored",stored_user)
        return res.status(200).json({ userId });
      } else {
        console.log("User not found");
        return res.status(404).json({ error: "Please Register to login" });
      }
    } catch (e) {
      res.status(500).json({ error: e });
    }
  });

  
router.post("/signUpUser", async (req,res) => {
        try{
            console.log("sign up route")
            let details = req.body;
            let name = details.name;
            let email = details.email;
            let password = details.password;
            const addedUser = await userData.signUpUser(name, email, password)
            console.log(addedUser)
            return res.status(200).json(addedUser);
        }
        catch (e) {
            res.status(500).json({ error: e });
          }
    }
    )

router.post("/signup", async (req, res) => {
    let input = req.body;
    let name = input.name;
    let email = input.email;

    
    try {
      
        const existingUser = await userData.getUserByEmailForLogin(email);
        console.log("Existing user:",existingUser);
        if (!existingUser) {
            
            try {
                console.log(email);
                  const newUser = await userData.createUser(xss(name), xss(email));
                  req.session.user = {
                      id: newUser._id.toString(),
                  }
                  // req.session.user = {...req.session.user, _id: newUser._id.toString()};
                  console.log(req.session.user);
                  return res.status(200).json({_id: newUser._id, name: newUser.name, email: newUser.email});gi 
              } catch (e) {
                  return res.status(e[0]).json({error:e[1]});
              }
            
            // return res.status(409).json({ message: "User already exists. Redirecting to dashboard." });
        }
    } catch (error) {
        
        return res.status(500).json({ error: "Internal server error while checking user existence." });
    }
    
});
router.get('/logout', async (req, res) => {
    if (req.session) {
        req.session.destroy((err) => {
            if (err) {
                
                res.status(500).send('Error while logging out');
            } else {
                res.send('Logged out');
            }
        });
    } else {
        res.send('No session to log out');
    }
});


export default router;
