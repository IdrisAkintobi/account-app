import { readFile, writeFile } from 'fs/promises';
import { dbPath, Request, Response, AccDetails } from './basic.utils';

async function createCustomers(req: Request, res: Response) {
  const body = req.body;
  const customersData = await readFile(dbPath, 'utf-8');
  const data = JSON.parse(customersData);
  //Randomly generate 10digit account number
  const accNum = Math.random().toString().substring(2, 12);
  const { accName, balance } = body;
  const details = {
    accNum,
    accName,
    balance,
    createdAt: new Date().toISOString(),
  };
  const customer = { details, transactions: [] };

  //Validation of data before writing to database
  try {
    AccDetails.parse(customer);
    data.push(customer);
    writeFile(dbPath, JSON.stringify(data));
    res.json(customer);
  } catch (err: any) {
    const errObject = err.format().details;
    const { _errors, ...errMessage } = errObject;
    res.status(400).json(errMessage);
  }
}

export default createCustomers;
