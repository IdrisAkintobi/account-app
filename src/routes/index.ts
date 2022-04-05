import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.locals.title = 'Idris Akintobi - Account app';
  res.render('index');
});

export default router;
