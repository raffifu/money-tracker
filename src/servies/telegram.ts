import { editMessageReplyMarkupParams, EditMessageTextParams, SendMessageParams } from "../types/telegram";

// TODO: Create a proper way to use TELEGRAM_API_URL, maybe the class is sufficient
export const config = {
	TELEGRAM_API_URL: ''
}

export async function sendMessage(body: SendMessageParams) {
	body.parse_mode = "Markdown"

	const response = await fetch(`${config.TELEGRAM_API_URL}/sendMessage`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body)
	});

	return await response.json()
}

export async function editMessageText(body: EditMessageTextParams) {
	body.parse_mode = "Markdown"

	const response = await fetch(`${config.TELEGRAM_API_URL}/editMessageText`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body)
	});

	return await response.json()
}

export async function editMessageReplyMarkup(body: editMessageReplyMarkupParams) {
	const response = await fetch(`${config.TELEGRAM_API_URL}/editMessageReplyMarkup`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body)
	});

	return await response.json()

}
