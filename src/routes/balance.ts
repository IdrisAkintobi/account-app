import express from 'express';
import { getAllBal, getBal } from '../controllers/acc.balance';
const router = express.Router();

router
  .get('/', (req, res) => {
    getAllBal(req, res);
  })
  .get('/:number', (req, res) => {
    getBal(req, res);
  });

export default router;
