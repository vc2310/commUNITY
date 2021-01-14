import express, { Router } from 'express';
// Import index action from users controller
import { getResult, postResult } from './controllers/users';

// Initialize the router
const router = Router();

// Handle /users route with index action from users controller
router.route('/users').get(getResult);

router.route('/users').post(postResult);

export default router;