






import express from 'express'; // Express web server framework
import session from 'express-session';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import configRoutes from './spotify/routes/index.js';
import configRoutes2 from './routes/index.js';

import { fileURLToPath } from 'url';
import path from 'path';
import exphbs from 'express-handlebars';
import {createServer} from 'http';
import {Server} from 'socket.io';







const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const stat = express.static(path.join(__dirname, '/public'));
/**
 
Generates a random string containing numbers and letters
@param  {number} length The length of the string
@return {string} The generated string
*/



const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {cors: {origin: '*'}});
app.use("/public",stat)


const rewriteUnsupportedBrowserMethods = (req, res, next) => {
   if (req.body && req.body._method) {
      req.method = req.body._method
      delete req.body._method
   }
}


// app.use(express.static(dirname + '/public'))

app.use(cors())
   .use(cookieParser())
   .use(express.json())
   .use(express.urlencoded({ extended: true }))
   .use(session({
      name: 'AuthCookie',
      secret: 'Secret!',
      resave: false,
      saveUninitialized: false,
      
   }));




app.set('views', path.join(__dirname, 'spotify/views'));



   // app.engine('handlebars', exphbs.engine({
//    defaultLayout: 'main',
//    layoutsDir: path.join(__dirname, 'spotify/views/layouts')
//  }));
app.engine('handlebars', exphbs.engine({
   defaultLayout: 'main',
   layoutsDir: path.join(__dirname, 'spotify/views/layouts')
 }));
 
 app.set('view engine', 'handlebars');
// app.get('/', middleware.hasCookie);
// app.get('/users/dashboard', middleware.noCookie);



configRoutes(app);
configRoutes2(app);

io.on('connection', (socket) => {
   console.log('new client connected', socket.id);
 
   socket.on('user_join', (name) => {
     console.log('A user joined their name is ' + name);
   //   socket.broadcast.emit('user_join', name);
      io.emit('user_join', name)
   });
 
   socket.on('message', ({name, message}) => {
     console.log(name, message, socket.id);
     io.emit('message', {name, message});
   });

   socket.on('player_state_changed', (playerState) => {
      console.log('Spotify player state changed reading in server ');
      console.log(playerState);
      //io.broadcast.emit('update_player_state', playerState);
      socket.broadcast.emit('update_player_state', playerState);

    });
 
   socket.on('disconnect', () => {
     console.log('Disconnect Fired');
   });
 });

 let port = 3000

httpServer.listen(port, () => {
      console.log("We've now got a server!");
      console.log(`Your routes will be running on http://localhost:${port}`); 
   
   });

