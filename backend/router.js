import express, { Router } from 'express';
// Import index action from users controller
import { login, signup } from './controllers/users';
import { createIssue, getIssues, upVoteIssues } from './controllers/issues';

// Initialize the router
const router = Router();

// Handle /users route with index action from users controller
router.route('/login').post(login);

router.route('/signup').post(signup);

router.route('/createIssue').post(createIssue);

router.route('/getIssues').get(getIssues);

router.route('/upVoteIssue').post(upVoteIssues);


export default router;
