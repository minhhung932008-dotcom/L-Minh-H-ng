import type { Video } from './types';

export const TELEGRAM_BOT_TOKEN = "8298657904:AAHSZxSosF8qoIFHhOGkRg2fgccLObgdSn8";
export const TELEGRAM_CHAT_ID = "5669336093";

// Bank Account Details for QR Code Generation
export const BANK_ID = "970422"; // MB Bank BIN
export const ACCOUNT_NO = "7862583813845";
export const ACCOUNT_NAME = "LE MINH HUNG";


export const videoData: Video[] = [
  { id: 'FhJM5_CUwIE', title: 'African Tiger Team', price: 20000, oldPrice: 100000, desc: 'Nhóm Tiger sôi động, phù hợp chúc mừng sinh nhật, phong cách mạnh mẽ.' },
  { id: 'dQTGqzHt8TQ', title: 'African Pirate Team', price: 20000, oldPrice: 100000, desc: 'Phong cách cướp biển vui nhộn, cực kỳ độc đáo và hài hước.' },
  { id: 'LqVHIsmrytM', title: 'African Gangsters Team', price: 20000, oldPrice: 100000, desc: 'Nhóm chúc mừng đa dạng, phù hợp cho mọi lứa tuổi.' },
  { id: 'fzd14e7TrgE', title: 'African Girl Team', price: 20000, oldPrice: 100000, desc: 'Màu sắc tươi mới, phù hợp phong cách vui nhộn, ngọt ngào.' },
  { id: 'RXU7RmC86gc', title: 'African Beach Team', price: 20000, oldPrice: 100000, desc: 'Nhóm trên bãi biển, concept năng động và tự do.' }
];

export function formatVND(n: number): string { 
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + '₫'; 
}

export function generateOrderId(prefix = 'ORD'): string {
    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
    return prefix + datePart + randomPart;
}
