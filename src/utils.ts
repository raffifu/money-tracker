import { InlineKeyboardButton, InlineKeyboardMarkup } from "@grammyjs/types";
import { AppButton, Expense, ExpenseCategoryKey, GeneralButtonKey } from "./types/app";
import { ExpenseCategories, GeneralButton } from "./sources/constant";

export function messageParser(input: string) {
	const lines = input.split('\n');

	if (lines.length !== 2)
		throw new Error("Input should contain exactly two lines.")


	const amountStr = lines[0].trim();
	const description = lines[1].trim();

	let amount: number;
	if (amountStr.endsWith('K')) {
		amount = parseInt(amountStr.replace('K', '')) * 1000;
	} else {
		amount = parseInt(amountStr);
	}

	if (isNaN(amount))
		throw new Error("Price is not a valid number.");

	return {
		amount,
		description
	};
}

function formatCurrency(amount: number, currency: string = 'IDR'): string {
	// Define options for currency formatting
	const currencyOptions: Intl.NumberFormatOptions = {
		style: 'currency',
		currency: currency,
		minimumFractionDigits: 0 // No decimal points for whole numbers
	};

	// Format the number as currency
	return new Intl.NumberFormat('id-ID', currencyOptions).format(amount);
}

function formatDate(date: Date): string {
	// Define options for toLocaleDateString to get the desired date format
	const dateOptions: Intl.DateTimeFormatOptions = {
		weekday: 'short', // Include the day of the week
		day: '2-digit',
		month: 'short',
		year: 'numeric'
	};

	// Define options for toLocaleTimeString to get the desired time format
	const timeOptions: Intl.DateTimeFormatOptions = {
		hour: '2-digit',
		minute: '2-digit',
		hour12: false
	};

	// Get the formatted date and time strings
	const formattedDate = date.toLocaleDateString('en-GB', dateOptions);
	const formattedTime = date.toLocaleTimeString('en-GB', timeOptions);

	return `${formattedDate} ${formattedTime}`;
}

export function categoryKeyboard(): InlineKeyboardMarkup {
	const keyboard: InlineKeyboardMarkup = {
		inline_keyboard: []
	}

	let key: ExpenseCategoryKey
	let keyboardLine: InlineKeyboardButton[] = []
	for (key in ExpenseCategories) {
		const category = ExpenseCategories[key];

		const button: InlineKeyboardButton = {
			text: `${category.icon} ${category.name}`,
			callback_data: key
		}

		keyboardLine.push(button)

		if (keyboardLine.length === 2) {
			keyboard.inline_keyboard.push(keyboardLine)
			keyboardLine = []
		}
	}

	if (keyboardLine.length > 0)
		keyboard.inline_keyboard.push(keyboardLine)

	const cancelButton: AppButton = "Cancel"
	keyboard.inline_keyboard.push([getButton(cancelButton)])

	return keyboard
}


export function getButton(key: AppButton): InlineKeyboardButton {
	let data
	if (key in ExpenseCategories)
		data = ExpenseCategories[key as ExpenseCategoryKey]
	else
		data = GeneralButton[key as GeneralButtonKey]

	return {
		text: `${data.icon} ${data.name}`,
		callback_data: key
	}
}

export function homeKeyboard(): InlineKeyboardMarkup {
	const keyboard: InlineKeyboardMarkup = {
		inline_keyboard: []
	}

	let key: GeneralButtonKey
	let keyboardLine: InlineKeyboardButton[] = []
	for (key in GeneralButton) {
		if (key === "Cancel")
			continue

		const category = GeneralButton[key];

		const button: InlineKeyboardButton = {
			text: `${category.icon} ${category.name}`,
			callback_data: key
		}

		keyboardLine.push(button)

		if (keyboardLine.length === 2) {
			keyboard.inline_keyboard.push(keyboardLine)
			keyboardLine = []
		}
	}

	if (keyboardLine.length > 0)
		keyboard.inline_keyboard.push(keyboardLine)

	return keyboard

}

export function getIdFromMessage(text: string): number {
	const parts = text.split('\n');
	const lastElement = parts[parts.length - 1];

	return parseInt(lastElement.split('(')[1].slice(0, -1))
}

export function responseBuilder(transaction: Expense): string {
	return `*EXPENSE DETAIL*\n💰 : ${formatCurrency(transaction.amount)}\n🎭 : ${transaction.description}\n🗂 : ${transaction.category || '-'}\n🌐 : ${transaction.account}\n📅 : ${formatDate(transaction.date)}\n\nReply to edit (${transaction.id})`
}
