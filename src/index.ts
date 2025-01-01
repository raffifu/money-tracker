import { Update } from "@grammyjs/types";
import { handleMessage, handleCallback } from "./handlers";
import { getDb } from "./servies/database";
import { config } from "./servies/telegram";

export default {
	async fetch(request, env, ctx): Promise<Response> {
		config.TELEGRAM_API_URL = env.TELEGRAM_API_URL
		const db = getDb(env.DATABASE_URL)

		if (request.method === 'POST') {
			const response: Update = await request.json();

			if (response.message) {
				await handleMessage(db, response.message)
			} else if (response.callback_query) {
				await handleCallback(db, response.callback_query)
			}
		}

		return new Response("OK")
	},
} satisfies ExportedHandler<Env>;
