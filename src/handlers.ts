import { Message, CallbackQuery } from "@grammyjs/types";
import { config, editMessageReplyMarkup, editMessageText, sendMessage } from "./servies/telegram";
import { categoryKeyboard, getIdFromMessage, homeKeyboard, messageParser, responseBuilder } from "./utils";
import { Expense, ExpenseCategoryKey, GeneralButtonKey, Transaction } from "./types/app";
import { createExpense, updateExpense } from "./servies/database";
import { ExpenseCategories } from "./sources/constant";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";

async function updateCategory(db: PostgresJsDatabase, expenseId: number, data: ExpenseCategoryKey, message: Message) {
	const ret = await updateExpense(db, expenseId, {
		updatedAt: new Date(),
		category: data
	})

	if (!ret)
		return

	await editMessageText({
		message_id: message.message_id,
		chat_id: message.chat.id,
		text: responseBuilder(ret),
		reply_markup: homeKeyboard()
	})
}

async function deleteTransaction(db: PostgresJsDatabase, expenseId: number, message: Message) {
	const ret = await updateExpense(db, expenseId, {
		deletedAt: new Date()
	})

	if (!ret)
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

	const { text } = message
	if (!text || message.chat.id !== config.CHAT_ID)
		return

	let expenseId
	try {
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

	if (!text || chat_id !== config.CHAT_ID)
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

	const ret = await createExpense(db, [transaction])

	if (ret && ret.length > 0) {
		transaction.id = ret[0].id

		await sendMessage({
			chat_id: config.CHAT_ID,
			text: responseBuilder(transaction),
			reply_markup: categoryKeyboard(),
			reply_parameters: {
				message_id: id
			}
		})
	}
}

export async function handleApiReq(db: PostgresJsDatabase, request: Request) {
	const response: Transaction[] = await request.json()

	const expensePayload: Expense[] = response.map(it => ({
		date: new Date(it.date * 1000),
		amount: it.amount,
		description: it.to,
		category: it.category,
		account: it.account,
		type: it.type
	}))

	const ret = await createExpense(db, expensePayload)

	if (!ret || ret.length === 0)
		return

	const promises = ret.map(async it => {
		await sendMessage({
			chat_id: config.CHAT_ID,
			text: responseBuilder(it),
			reply_markup: categoryKeyboard()
		})
	})

	await Promise.all(promises)
}

