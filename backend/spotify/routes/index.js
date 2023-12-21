



import userRoutes from './users.js';
import apiRoutes from './api.js';
import roomRoutes from './rooms.js'
import { application } from 'express';

const constructorMethod = (app) => {
 
    app.use('/users', userRoutes);
    app.use('/api', apiRoutes);
    app.use('/rooms',roomRoutes)

 
};

export default constructorMethod;