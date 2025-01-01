export interface SendMessageParams {
	chat_id: number | string;
	text: string;
	parse_mode?: string;
	disable_web_page_preview?: boolean;
	disable_notification?: boolean;
	reply_parameters?: ReplyParameters;
	reply_markup?: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply;
};

export interface EditMessageTextParams {
	bussiness_connection_id?: string;
	chat_id?: number | string;
	message_id?: number;
	inline_message_id?: string;
	text: string;
	parse_mode?: 'Markdown' | 'HTML' | 'MarkdownV2';
	entities?: MessageEntity[];
	disable_web_page_preview?: boolean;
	reply_markup?: InlineKeyboardMarkup;
}

export interface editMessageReplyMarkupParams {
	bussiness_connection_id?: string;
	chat_id?: number | string;
	message_id?: number;
	inline_message_id?: string;
	reply_markup?: InlineKeyboardMarkup;
}

