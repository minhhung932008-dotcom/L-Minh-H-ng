
import React from 'react';

export const Header: React.FC = () => {
    return (
        <header className="flex flex-col md:flex-row gap-5 items-center mb-6 p-2.5 border-b border-[#F0E6D8]">
            <img 
                src="https://raw.githubusercontent.com/minhhaiaiter/temp/main/mhai.ico" 
                alt="Video AI Logo" 
                className="w-[70px] h-[70px] rounded-full object-cover shadow-[0_4px_12px_rgba(217,54,54,0.3)] border-4 border-brand-card flex-shrink-0"
            />
            <div className="flex-1 text-center md:text-left">
                <h1 className="m-0 text-xl md:text-2xl font-title text-brand-accent">DỊCH VỤ VIDEO AI CHÚC MỪNG SINH NHẬT</h1>
                <p className="mt-1 mb-0 text-brand-text font-normal text-base">
                    Chọn mẫu, điền thông tin, <strong>gửi ảnh trước</strong>, thanh toán <span className="text-brand-accent font-bold">20.000₫</span> — nhận video qua Zalo/Email.
                </p>
            </div>
            <div className="text-center md:text-right flex-shrink-0 mt-2 md:mt-0">
                <div className="text-sm text-brand-muted">Hotline/Zalo hỗ trợ</div>
                <div className="font-extrabold text-brand-accent text-lg">0947262458</div>
            </div>
        </header>
    );
};
