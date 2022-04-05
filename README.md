# Account App

### About

- Project is written in `TypeScript` and APIs (endpoints) are built with `express`
- Install dependencies with `Yarn`
- Inputs are validated using `Zod`

## Problem Description:

Imagine you are asked to develop a transfer service with APIs to transfer money between two accounts
You application is expected to have the following in it database structure.

- TABLE 1 - transactions

  - reference (unique)
  - sender (Account nunber)
  - amount
  - receiver (Account number)
  - transfer Description
  - createdAt (Date)

- TABLE 2 - details
  - account number (unique)
  - account name
  - balance
  - createdAt (Date)

The transaction table registers any transaction in an account (ie. today I paid N2000 for a movie with my card), the balances table represents the account balance of customers (ie. I have N50k in my bank account). If a sender is trying to make a transaction of an amount of money more than his current balance, an error should be returned indicating insufficient funds

The API you are to develop should be able to handle a transfer request of the form below and updates the transactions/balances table accordingly.

```
{
    from: account number,
    to: account number,
    amount: amount
}

```
- Inputs should be string except amount

## Testing

### Endpoints to test

| Method | Endpoint                | Enable a user to:                                            |
| :----- | :---------------------- | :----------------------------------------------------------- |
| POST   | /create-account         | Enable user to create an account stored in the balance table |
| GET    | /balance/:accountNumber | Getting balance for a particular account number              |
| GET    | /balance                | Getting all accounts and their balance                       |
| POST   | /transfer               | To make a transaction to another account                     |


- Test using `supertest`

### Hosted on heroku


#### Transfer sample data

{"from" : "6739230355", "to": "76467357100", "amount": 8000, "description": "Rent"}

#### Create user sample data

{"accName": "Luther King", "balance": 24000}
