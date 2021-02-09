import express, { Router } from 'express';
// Import index action from users controller
import { login, signup } from './controllers/users';
import { createIssue, getIssues, upVoteIssues, downVoteIssue, createIssueWithImage, getImage, getIssue, commentIssue, statusIssue } from './controllers/issues';

// Initialize the router
const router = Router();

// Handle /users route with index action from users controller
router.route('/login').post(login);

router.route('/signup').post(signup);

router.route('/createIssue').post(createIssueWithImage);

router.route('/getIssues/:query').get(getIssues);

router.route('/getIssue/:id').get(getIssue);

router.route('/upVoteIssue').post(upVoteIssues);

router.route('/downVoteIssue').post(downVoteIssue);

router.route('/commentIssue').post(commentIssue);

router.route('/statusIssue').post(statusIssue);

router.route('/createIssueWithImage').post(createIssueWithImage);

router.route('/:id/image').get(getImage);

export default router;
