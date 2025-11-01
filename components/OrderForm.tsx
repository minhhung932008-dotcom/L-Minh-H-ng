import React, { useState, useEffect } from 'react';
import type { Video } from '../types';
import { generateOrderId, formatVND, BANK_ID, ACCOUNT_NO, ACCOUNT_NAME } from '../constants';
import { sendTelegramPhoto, sendTelegramMessage } from '../services/telegramService';

interface OrderFormProps {
    video: Video;
    onPaymentSuccess: () => void;
}

const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string; isRequired?: boolean }> = ({ label, isRequired, ...props }) => (
    <div>
        <label htmlFor={props.id} className="block mt-3.5 font-bold text-brand-text text-base">
            {label} {isRequired && <span className="text-brand-accent">*</span>}
        </label>
        <input {...props} className="w-full p-3 rounded-lg border border-[#EEDBC5] mt-2 text-base bg-[#fff8f0] text-inherit transition-colors duration-200 focus:border-brand-accent-2 focus:outline-none focus:bg-white" />
    </div>
);

const CopyButton: React.FC<{ textToCopy: string, children: React.ReactNode }> = ({ textToCopy, children }) => {
    const [copied, setCopied] = useState(false);
    const copyToClipboard = () => {
        navigator.clipboard.writeText(textToCopy).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };
    return <button onClick={copyToClipboard} className="px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300">{copied ? 'Đã chép' : children}</button>;
};


export const OrderForm: React.FC<OrderFormProps> = ({ video, onPaymentSuccess }) => {
    const [formData, setFormData] = useState({
        customer_name: '',
        birthday_name: '',
        email: '',
        zalo: '',
        message: '',
        delivery_method: 'Email',
    });
    const [userImageFile, setUserImageFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>('');
    const [orderId, setOrderId] = useState<string>('');
    const [status, setStatus] = useState<'idle' | 'submitting' | 'submitted' | 'confirming' | 'confirmed' | 'error'>('idle');
    const [resultMessage, setResultMessage] = useState('');
    const [qrCodeUrl, setQrCodeUrl] = useState('');

    const placeholderSVG = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360"><rect width="100%" height="100%" fill="%23fffbf5"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%238E7B7E" font-size="20">Ảnh của người được ghép mặt (Bắt buộc)</text></svg>';

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setUserImageFile(file);
            const reader = new FileReader();
            reader.onload = (ev) => {
                setPreview(ev.target?.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setUserImageFile(null);
            setPreview(placeholderSVG);
        }
    };

    const handleSubmitOrder = async () => {
        if (!userImageFile) {
            alert("Vui lòng upload ảnh khách hàng (ảnh để ghép mặt)!");
            return;
        }
        if (!formData.customer_name || !formData.birthday_name) {
            alert("Vui lòng điền đầy đủ Họ tên khách hàng và Tên người được chúc.");
            return;
        }
        
        setStatus('submitting');
        setResultMessage('Đang gửi ảnh và thông tin đơn hàng...');

        try {
            const newOrderId = generateOrderId('M');
            let photoMessage = `📸 *[BƯỚC 1/2: ĐÃ GỬI ẢNH]* Đơn hàng: ${newOrderId} (CHƯA THANH TOÁN)\n\n`;
            photoMessage += `*Người chúc:* ${formData.customer_name}\n`;
            photoMessage += `*Người được chúc:* ${formData.birthday_name}\n`;
            photoMessage += `*Mẫu:* ${video.title}\n`;
            photoMessage += `*Email:* ${formData.email || '_Không có_'}\n`;
            photoMessage += `*Zalo:* ${formData.zalo || '_Không có_'}\n`;
            photoMessage += `*Phương thức nhận video:* ${formData.delivery_method || '_Không có_'}\n`;
            photoMessage += `*Yêu cầu/Lời nhắn:* ${formData.message || '_Không có lời nhắn._'}\n\n`;
            photoMessage += `*TRẠNG THÁI:* CHỜ THANH TOÁN.`;

            const photoResult = await sendTelegramPhoto(userImageFile, photoMessage);
            if (!photoResult.ok) throw new Error('Lỗi gửi ảnh lên Telegram: ' + (photoResult.description || ''));
            
            setOrderId(newOrderId);
            const qrUrl = `https://api.vietqr.io/v2/generate?accountNo=${ACCOUNT_NO}&accountName=${encodeURIComponent(ACCOUNT_NAME)}&acqId=${BANK_ID}&amount=${video.price}&template=compact2&addInfo=${newOrderId}`;
            setQrCodeUrl(qrUrl);
            setStatus('submitted');
            setResultMessage(`✅ Đã gửi ảnh thành công! Vui lòng thanh toán để hoàn tất.`);

        } catch (error: any) {
            setStatus('error');
            setResultMessage('Lỗi Gửi Ảnh: ' + error.message);
            alert('Đã xảy ra lỗi khi gửi đơn hàng. Vui lòng kiểm tra lại thông tin và kết nối mạng.');
        }
    };

    const handleConfirmPayment = async () => {
        setStatus('confirming');
        setResultMessage('Đang gửi xác nhận...');
        try {
            await sendTelegramMessage(`💰 *[KHÁCH BÁO ĐÃ THANH TOÁN]*\nĐơn hàng *${orderId}* đã được thanh toán ${formatVND(video.price)}. Vui lòng kiểm tra tài khoản MB Bank.`);
            setStatus('confirmed');
            onPaymentSuccess();
        } catch (error: any) {
            setStatus('error');
            setResultMessage('Lỗi gửi xác nhận: ' + error.message);
        }
    }
    
    if (status === 'confirmed') {
         return (
            <div className="mt-3 border border-green-600 rounded-xl p-4 bg-green-50 text-center">
                <div className="text-lg font-bold text-green-800">✅ Đặt hàng thành công!</div>
                <div className="mt-2 font-semibold text-brand-text">
                    {`Cảm ơn bạn đã đặt hàng! Chúng tôi đã nhận được xác nhận thanh toán cho đơn hàng ${orderId} và sẽ xử lý video sớm nhất!`}
                </div>
            </div>
        )
    }

    if (status === 'submitted' || status === 'confirming') {
        return (
            <div className="text-center">
                <h4 className="font-title text-xl text-brand-accent">Bước 2: Thanh toán chuyển khoản</h4>
                <p className="text-sm text-brand-muted">Quét mã QR dưới đây để thanh toán {formatVND(video.price)}</p>
                {qrCodeUrl && <img src={qrCodeUrl} alt="QR Code Thanh toán" className="mx-auto rounded-lg shadow-md" />}
                <div className="text-left bg-amber-50 p-3 rounded-lg mt-4 space-y-2 text-sm border border-amber-200">
                    <div className="flex justify-between items-center"><span>Ngân hàng:</span> <strong className="font-mono">MB Bank</strong></div>
                    <div className="flex justify-between items-center"><span>Chủ tài khoản:</span> <strong className="font-mono">{ACCOUNT_NAME}</strong></div>
                    <div className="flex justify-between items-center">
                        <div>Số tài khoản: <strong className="font-mono">{ACCOUNT_NO}</strong></div>
                        <CopyButton textToCopy={ACCOUNT_NO}>Chép STK</CopyButton>
                    </div>
                    <div className="flex justify-between items-center">
                        <div>Nội dung: <strong className="font-mono text-red-600">{orderId}</strong></div>
                        <CopyButton textToCopy={orderId}>Chép ND</CopyButton>
                    </div>
                </div>
                <button 
                    onClick={handleConfirmPayment}
                    disabled={status === 'confirming'}
                    className="w-full mt-4 p-4 rounded-lg border-none bg-[#9B306B] text-white font-bold text-base cursor-pointer transition-colors duration-200 hover:bg-pink-800 disabled:bg-gray-400">
                    { status === 'confirming' ? 'Đang xác nhận...' : 'Tôi đã chuyển khoản' }
                </button>
                 {resultMessage && (
                    <div className="text-sm mt-2.5 text-brand-muted">
                        {resultMessage}
                    </div>
                )}
            </div>
        );
    }
    
    return (
        <form onSubmit={(e) => e.preventDefault()} autoComplete="off">
            <InputField label="Họ & tên khách hàng" name="customer_name" id="customer_name" type="text" value={formData.customer_name} onChange={handleChange} required isRequired placeholder="Nguyễn Văn A" />
            <InputField label="Tên người được chúc" name="birthday_name" id="birthday_name" type="text" value={formData.birthday_name} onChange={handleChange} required isRequired placeholder="Ví dụ: Minh" />

            <div className="flex flex-col md:flex-row gap-2.5">
                <div className="flex-1">
                    <InputField label="Email liên hệ (Ưu tiên)" name="email" id="email" type="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" />
                </div>
                <div className="w-full md:w-40">
                    <InputField label="Số Zalo" name="zalo" id="zalo" type="text" value={formData.zalo} onChange={handleChange} placeholder="094xxxxxxx" />
                </div>
            </div>

            <div>
                <label htmlFor="message" className="block mt-3.5 font-bold text-brand-text text-base">Lời nhắn cho clip (tùy chọn)</label>
                <textarea id="message" name="message" value={formData.message} onChange={handleChange} placeholder="Ví dụ: Chúc mừng sinh nhật Minh! Sắp thành công rồi!" className="w-full p-3 rounded-lg border border-[#EEDBC5] mt-2 text-base bg-[#fff8f0] text-inherit transition-colors duration-200 focus:border-brand-accent-2 focus:outline-none focus:bg-white min-h-[90px] resize-y" />
            </div>

            <div>
                <label className="block mt-3.5 font-bold text-brand-text text-base">Ảnh khách hàng (Bắt buộc để ghép mặt) <span className="text-brand-accent">*</span></label>
                <input id="user_image" name="user_image_file" type="file" accept="image/*" required onChange={handleFileChange} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-brand-accent hover:file:bg-violet-100 mt-2" />
                <img id="preview" src={preview || placeholderSVG} className="mt-2 rounded-xl object-cover h-48 w-full border border-[#EEDBC5]" alt="Preview"/>
            </div>
            
            <div>
                 <label htmlFor="finalMethod" className="block mt-3.5 font-bold text-brand-text text-base">Phương thức nhận video</label>
                 <select id="finalMethod" name="delivery_method" value={formData.delivery_method} onChange={handleChange} className="w-full p-3 rounded-lg border border-brand-accent-2 mt-2 bg-white focus:outline-none">
                     <option value="Email">Gửi về Email</option>
                     <option value="Zalo">Gửi về Zalo</option>
                 </select>
            </div>
            
             <div className="mt-4">
                 <button type="button" onClick={handleSubmitOrder} disabled={status === 'submitting'} className="w-full p-4 rounded-lg border-none bg-brand-accent text-white font-bold text-base cursor-pointer transition-colors duration-200 hover:bg-brand-accent-2 disabled:bg-gray-400 disabled:cursor-not-allowed">
                     {status === 'submitting' ? 'Đang xử lý...' : '1. Gửi ảnh & Lấy mã đơn hàng'}
                 </button>
            </div>

            {resultMessage && (
                <div className={`text-sm mt-2.5 ${status === 'error' ? 'text-red-600' : 'text-brand-muted'}`}>
                    {resultMessage}
                </div>
            )}
             <p className="text-sm mt-5 font-semibold text-brand-accent">
                *Hệ thống sẽ tạo mã QR tự động để bạn thanh toán ở bước tiếp theo.
             </p>
        </form>
    );
};
