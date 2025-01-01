import { ExpenseCategoryKey, GeneralButtonKey, InlineButton } from "../types/app";

export const GeneralButton: Record<GeneralButtonKey, InlineButton> = {
	Cancel: { name: "Cancel", icon: "❌" },
	Category: { name: "Category", icon: "📂" },
	Date: { name: "Date", icon: "📅" },
	Delete: { name: "Delete", icon: "🗑️" },
};

export const ExpenseCategories: Record<ExpenseCategoryKey, InlineButton> = {
	FoodAndDrinks: { name: "Food & Drinks", icon: "🍔" },
	SocialLife: { name: "Social Life", icon: "🎉" },
	Work: { name: "Work", icon: "💼" },
	Transport: { name: "Transport", icon: "🚗" },
	Home: { name: "Home", icon: "🏠" },
	BillsAndFees: { name: "Bills & Fees", icon: "💸" },
	Groceries: { name: "Groceries", icon: "🛒" },
	Entertainment: { name: "Entertainment", icon: "🎬" },
	Clothes: { name: "Clothes", icon: "👗" },
	Investment: { name: "Investment", icon: "📈" },
	EMoney: { name: "E-Money", icon: "💳" },
	Cashout: { name: "Cashout", icon: "🏧" }
};
