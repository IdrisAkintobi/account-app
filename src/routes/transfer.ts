import express from 'express';
import makeTransfer from '../controllers/acc.transfer';
const router = express.Router();

router.post('/', (req, res) => {
  makeTransfer(req, res);
});

export default router;
