import express from 'express';
import { getCredentials } from '../Controller/AdminController.js';

const router = express.Router();

router.get('/credentials', getCredentials);

export default router;
