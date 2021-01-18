import express, { Router } from 'express';
// Import index action from users controller
import { login, signup } from './controllers/users';

// Initialize the router
const router = Router();

// Handle /users route with index action from users controller
router.route('/login').post(login);

router.route('/signup').post(signup);

export default router;
