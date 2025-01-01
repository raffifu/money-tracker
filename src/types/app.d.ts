import { ExpenseCategories, GeneralButton } from "../sources/constant";

export type ExpenseCategoryKey =
	| "FoodAndDrinks"
	| "SocialLife"
	| "Work"
	| "Transport"
	| "Home"
	| "BillsAndFees"
	| "Groceries"
	| "Entertainment"
	| "Clothes"
	| "Investment"
	| "EMoney"
	| "Cashout";

export type GeneralButtonKey =
	| "Cancel"
	| "Category"
	| "Date"
	| "Delete"

export type AppButton = ExpenseCategoryKey | GeneralButtonKey

export type InlineButton = {
	name: string;
	icon: string;
}

export interface Expense {
	id?: number;
	date: Date;
	amount: number;
	description?: string | null;
	category?: ExpenseCategoryKey | null;
	account?: 'JAGO' | 'CIMB' | 'CASH' | null;
	type?: "EXPENSE" | "INCOME" | null;
	updatedAt?: Date | null;
	deletedAt?: Date | null;
}
