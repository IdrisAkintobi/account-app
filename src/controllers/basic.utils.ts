import { Request, Response } from 'express';
import { z } from 'zod';
import { dbPath } from '../app';

//Schema for account details
const Details = z.object({
  accName: z.string(),
  accNum: z.string(),
  balance: z.number(),
  createdAt: z.string(),
});

//Schema for transaction details
const Transaction = z.object({
  reference: z.string().uuid(),
  sender: z.string(),
  amount: z.number().positive(),
  receiver: z.string().regex(/^\d{10}$/),
  description: z.string(),
  createdAt: z.string(),
});

//Schema for acc information
const AccDetails = z.object({
  details: Details,
  transactions: z.array(Transaction),
});

//Create type from the schema
type Customer = z.infer<typeof AccDetails>;

export { Customer, dbPath, Request, Response, AccDetails, Transaction };
