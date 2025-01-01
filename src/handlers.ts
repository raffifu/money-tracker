import { Message, CallbackQuery } from "@grammyjs/types";
import { editMessageReplyMarkup, editMessageText, sendMessage } from "./servies/telegram";
import { categoryKeyboard, getIdFromMessage, homeKeyboard, messageParser, responseBuilder } from "./utils";
import { Expense, ExpenseCategoryKey, GeneralButtonKey } from "./types/app";
import { createExpense, updateExpense } from "./servies/database";
import { ExpenseCategories } from "./sources/constant";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";

async function updateCategory(db: PostgresJsDatabase, expenseId: number, data: ExpenseCategoryKey, message: Message) {
	const response = await updateExpense(db, expenseId, {
		updatedAt: new Date(),
		category: data
	})

	if (!response)
		return

	await editMessageText({
		message_id: message.message_id,
		chat_id: message.chat.id,
		text: responseBuilder(response),
		reply_markup: homeKeyboard()
	})
}

async function deleteTransaction(db: PostgresJsDatabase, expenseId: number, message: Message) {
	const response = await updateExpense(db, expenseId, {
		deletedAt: new Date()
	})

	if (!response)
		return

	await editMessageText({
		message_id: message.message_id,
		chat_id: message.chat.id,
		text: "DELETED"
	})
}

async function showMenu(key: GeneralButtonKey, message: Message) {
	let replyMarkup
	if (key === 'Category')
		replyMarkup = categoryKeyboard()
	else if (key === 'Cancel')
		replyMarkup = homeKeyboard()


	await editMessageReplyMarkup({
		message_id: message.message_id,
		chat_id: message.chat.id,
		reply_markup: replyMarkup
	})
}


export async function handleCallback(db: PostgresJsDatabase, callbackQuery: CallbackQuery) {
	const data = callbackQuery.data
	const message = callbackQuery.message

	if (!data || !message)
		return

	let expenseId
	try {
		const { text } = message
		if (!text)
			return

		expenseId = getIdFromMessage(text)
	}
	catch (error) {
		console.error(error)
		return
	}

	if (data in ExpenseCategories)
		await updateCategory(db, expenseId, data as ExpenseCategoryKey, message)
	else if (data === 'Delete')
		await deleteTransaction(db, expenseId, message)
	else if (data === 'Category' || data === 'Cancel')
		await showMenu(data, message)
}

export async function handleMessage(db: PostgresJsDatabase, message: Message) {
	const id = message.message_id
	const chat_id = message.chat.id
	const text = message.text

	if (!text)
		return

	let parsed
	try {
		parsed = messageParser(text)
	} catch (error) {
		if (error instanceof Error) {
			console.error(error.message);
		} else {
			console.error("Unknown error occurred");
		}
		return
	}

	const transaction: Expense = {
		amount: parsed.amount,
		description: parsed.description,
		date: new Date(message.date * 1000),
		account: 'CASH',
		type: 'EXPENSE'
	};

	const response = await createExpense(db, transaction)

	if (!response)
		return

	transaction.id = response.id

	await sendMessage({
		chat_id,
		text: responseBuilder(transaction),
		reply_markup: categoryKeyboard(),
		reply_parameters: {
			message_id: id
		}
	})
}
