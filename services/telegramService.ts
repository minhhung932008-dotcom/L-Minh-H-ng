
import { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } from '../constants';

export async function sendTelegramPhoto(file: File, caption: string): Promise<any> {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`;
    const formData = new FormData();
    formData.append('chat_id', TELEGRAM_CHAT_ID);
    formData.append('caption', caption);
    formData.append('photo', file);
    formData.append('parse_mode', 'Markdown');
    
    const response = await fetch(url, { method:'POST', body: formData });
    return response.json();
}

export async function sendTelegramMessage(text: string): Promise<any> {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const payload = { 
        chat_id: TELEGRAM_CHAT_ID, 
        text: text, 
        parse_mode: 'Markdown' 
    };
    
    const response = await fetch(url, { 
        method:'POST', 
        headers:{ 'Content-Type':'application/json' }, 
        body: JSON.stringify(payload) 
    });
    return response.json();
}
