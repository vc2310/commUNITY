import express, { Router } from 'express';
// Import index action from users controller
import { login, signup } from './controllers/users';
import { createIssue, getIssues, upVoteIssues, createIssueWithImage, getImage, getIssue } from './controllers/issues';

// Initialize the router
const router = Router();

// Handle /users route with index action from users controller
router.route('/login').post(login);

router.route('/signup').post(signup);

router.route('/createIssue').post(createIssueWithImage);

router.route('/getIssues').get(getIssues);

router.route('/getIssue/:id').get(getIssue);

router.route('/upVoteIssue').post(upVoteIssues);

router.route('/createIssueWithImage').post(createIssueWithImage);

router.route('/:id/image').get(getImage);

export default router;
