import express from 'express';
import create from '../controllers/acc.create';
const router = express.Router();

router.post('/', (req, res) => {
  create(req, res);
});

export default router;
