import { Update } from "@grammyjs/types";
import { handleMessage, handleCallback, handleApiReq } from "./handlers";
import { getDb } from "./servies/database";
import { config } from "./servies/telegram";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";

async function handleTelegramReq(db: PostgresJsDatabase, request: Request) {
	const response: Update = await request.json();

	if (response.message) {
		await handleMessage(db, response.message)
	} else if (response.callback_query) {
		await handleCallback(db, response.callback_query)
	}

}

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const url = new URL(request.url)

		const { TELEGRAM_API_URL, DATABASE_URL, CHAT_ID, SECURITY_TOKEN } = env

		if (!TELEGRAM_API_URL || !DATABASE_URL || !CHAT_ID || !SECURITY_TOKEN)
			throw new Error("TELEGRAM_API_URL, DATABASE_URL, CHAT_ID, SECURITY_TOKEN must be defined.")

		config.TELEGRAM_API_URL = TELEGRAM_API_URL
		config.CHAT_ID = parseInt(CHAT_ID)

		const db = getDb(DATABASE_URL)

		if (request.method === 'POST') {
			switch (url.pathname) {
				case '/':
					const securityToken = request.headers.get('x-telegram-bot-api-secret-token')
					if (securityToken === SECURITY_TOKEN)
						await handleTelegramReq(db, request)
					break;
				case '/api/transaction':
					await handleApiReq(db, request)
					break;
			}
		}

		return new Response("OK")
	},
} satisfies ExportedHandler<Env>;
