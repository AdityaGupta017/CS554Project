// import userRoutes from './users.js';

// const constructorMethod = (app) => {
//     app.get('/', (req, res) => {
//         // Landing page
//         res.status(200).render('pages/landing', {title: 'Landing Page'});
//     });
//     app.use('/users', userRoutes);

//    //  app.use('*', (req, res) => {
//    //      res.status(404).render('pages/error', {title: 'Error', error: 'Route not found'});
//    //  });
// };

// export default constructorMethod;



import userRoutes from './users.js';
import apiRoutes from './api.js';
import roomRoutes from './rooms.js'
import { application } from 'express';

const constructorMethod = (app) => {
 
    app.use('/users', userRoutes);
    app.use('/api', apiRoutes);
    app.use('/rooms',roomRoutes)

   //  app.use('*', (req, res) => {
   //      res.status(404).render('pages/error', {title: 'Error', error: 'Route not found'});
   //  });
};

export default constructorMethod;