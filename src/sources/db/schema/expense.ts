import { pgEnum, pgSchema, serial, timestamp, text, integer } from "drizzle-orm/pg-core";

const transaction = pgSchema('transaction');

export const expenseCategory = transaction.enum('expense_category', [
	'FoodAndDrinks',
	'SocialLife',
	'Work',
	'Transport',
	'Home',
	'BillsAndFees',
	'Groceries',
	'Entertainment',
	'Clothes',
	'Investment',
	'EMoney',
	'Cashout'
]);

export const expenseAccount = transaction.enum('expense_account', [
	'JAGO',
	'CASH',
	'CIMB'
]);

export const expenseType = transaction.enum('expense_type', [
	'INCOME',
	'EXPENSE',
]);

export const expense = transaction.table('expense', {
	id: serial('id').primaryKey(),
	date: timestamp('date').notNull(),
	amount: integer('amount').notNull(),
	description: text('description'),
	category: expenseCategory('category'),
	account: expenseAccount('account'),
	type: expenseType('type'),
	updatedAt: timestamp('updated_at'),
	deletedAt: timestamp('deleted_at'),
});

