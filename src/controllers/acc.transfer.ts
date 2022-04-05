import { readFile, writeFile } from 'fs/promises';
import {
  Customer,
  dbPath,
  Request,
  Response,
  Transaction,
} from './basic.utils';
import { v4 as uuidv4 } from 'uuid';

async function transfer(req: Request, res: Response) {
  //Get body data
  const body = req.body;
  const { from: sender, to: receiver, amount, description } = body;
  //Get database
  const customersData = await readFile(dbPath, 'utf-8');
  const data = JSON.parse(customersData);
  //Get Sender
  const senderData = data.find((acc: Customer) => acc.details.accNum == sender);
  if (!senderData) return res.status(404).json({ msg: 'Account not found' });
  const senderDetails = senderData.details;
  if (senderDetails.balance < amount) {
    return res.status(400).json({ msg: 'Insufficient balance' });
  }

  // Generate the transaction details
  const transactionsDetails = {
    reference: uuidv4(),
    sender,
    amount,
    receiver,
    description: description || '',
    createdAt: new Date().toISOString(),
  };

  //Validate data before processing
  try {
    Transaction.parse(transactionsDetails);
    senderDetails.balance -= amount;
    senderData.transactions.push(transactionsDetails);

    //Check if receiver is our customer
    const isReceiver = data.find(
      (acc: Customer) => acc.details.accNum == receiver,
    );
    //Our customer?... Add the amount to their balance
    if (isReceiver) {
      isReceiver.details.balance += amount;
      isReceiver.transactions.push(transactionsDetails);
    }
    //Write to database
    writeFile(dbPath, JSON.stringify(data));
    return res.json(transactionsDetails);
  } catch (err: any) {
    const errObject = err.format();
    const { _errors, ...errMessage } = errObject;
    res.status(400).json(errMessage);
  }
}

export default transfer;
