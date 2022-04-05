import app from '../src/app';
import request from 'supertest';
import { unlink, readFile } from 'fs/promises';
import { join } from 'path';
const db = join(__dirname, 'customers.json');
afterAll(() => {
  unlink(db);
});
let accNum: string;
let balance: number;
describe('POST test - Testing for POST Method', () => {
  it('Test for account creation', async () => {
    const response = await request(app)
      .post('/create')
      .send({ accName: 'Luther King', balance: 24000 });
    const expected = response.body.details.balance;
    expect(response.statusCode).toBe(200);
    expect(expected).toBe(24000);
  });
  it('Test for creation with wrong data', async () => {
    const response = await request(app)
      .post('/create')
      .send({ accName: ['Luther King'], balance: 24000 });
    const expected = response.body.accName._errors;
    expect(response.statusCode).toBe(400);
    expect(expected).toBeTruthy();
  });

  it('Test for transfer higher than balance', async () => {
    const database = await readFile(db, 'utf-8');
    const data = JSON.parse(database);
    accNum = data[data.length - 1].details.accNum;
    balance = data[data.length - 1].details.balance;
    const response = await request(app)
      .post('/transfer')
      .send({ from: accNum, to: '6598763321', amount: balance + 500 });
    const expected = response.body.msg;
    expect(response.statusCode).toBe(400);
    expect(expected).toBe('Insufficient balance');
  });
  it('Test to ensure balance was deducted from database', async () => {
    const response = await request(app)
      .post('/transfer')
      .send({ from: accNum, to: '6598763321', amount: 500 });
    const database = await readFile(db, 'utf-8');
    const data = JSON.parse(database);
    const newBalance = data[data.length - 1].details.balance;
    expect(response.statusCode).toBe(200);
    expect(newBalance).toBe(balance - 500);
  });
});

describe('TEST GET - Testing for GET methods', () => {
  it('Test go get balance with account number', async () => {
    const response = await request(app).get(`/balance/${accNum}`);
    const expected = response.body.accName;
    expect(response.statusCode).toBe(200);
    expect(expected).toBe('Luther King');
  });
  it('Test go get all balance', async () => {
    const response = await request(app).get('/balance');
    const database = await readFile(db, 'utf-8');
    const data = JSON.parse(database);
    const expected = response.body.length;
    expect(response.statusCode).toBe(200);
    expect(expected).toBe(data.length);
  });
});
