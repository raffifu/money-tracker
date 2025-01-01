import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { Expense } from "../types/app";
import { expense } from "../sources/db/schema/expense";


export const getDb = (dbUrl: string) => {
	const queryClient = postgres(dbUrl);
	return drizzle({ client: queryClient });
}

// Create a new expense
export const createExpense = async (db: PostgresJsDatabase, newExpense: Expense[]) => {
	const result = await db.insert(expense).values(newExpense).returning();
	return result
};

// Read all expenses
export const getAllExpenses = async (db: PostgresJsDatabase) => {
	const result = await db.select().from(expense);
	return result;
};

// Read a single expense by ID
export const getExpenseById = async (db: PostgresJsDatabase, id: number) => {
	const result = await db.select().from(expense).where(eq(expense.id, id));
	return result.length !== 0 ? result[0] : null;
};

// Update an expense by ID
export const updateExpense = async (db: PostgresJsDatabase, id: number, updatedExpense: Partial<Expense>) => {
	const result = await db.update(expense).set(updatedExpense).where(eq(expense.id, id)).returning();
	return result.length !== 0 ? result[0] : null;
};

// Delete an expense by ID
export const deleteExpense = async (db: PostgresJsDatabase, id: number) => {
	const result = await db.delete(expense).where(eq(expense.id, id)).returning();
	return result.length !== 0 ? result[0] : null;
};

