import { readFile } from 'fs/promises';
import { Customer, dbPath, Request, Response } from './basic.utils';

async function getAllBal(req: Request, res: Response) {
  //Get database
  const customersData = await readFile(dbPath, 'utf-8');
  const data = JSON.parse(customersData);
  //Get all customer details excluding createdAt
  const output = data.map((acc: any) => {
    const { createdAt, ...details } = acc.details;
    return details;
  });
  !output.length ? res.json({ msg: 'No customers' }) : res.json(output);
}

async function getBal(req: Request, res: Response) {
  //Get account number from the request
  const accNum = req.params.number;
  if (!+accNum) return res.status(400).json({ msg: 'Invalid acc number' });
  //Get customer from database
  const customersData = await readFile(dbPath, 'utf-8');
  const data = JSON.parse(customersData);
  const customer = data.find((acc: Customer) => acc.details.accNum == accNum);
  if (!customer) res.status(404).json({ msg: 'Account not found' });
  else {
    const { createdAt, ...details } = customer.details;
    res.json(details);
  }
}

export { getAllBal, getBal };
