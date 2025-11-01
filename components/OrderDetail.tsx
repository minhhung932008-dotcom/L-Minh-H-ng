import React from 'react';
import type { Video } from '../types';
import { formatVND } from '../constants';
import { OrderForm } from './OrderForm';

interface OrderDetailProps {
    video: Video;
    onBack: () => void;
    onPaymentSuccess: () => void;
}

export const OrderDetail: React.FC<OrderDetailProps> = ({ video, onBack, onPaymentSuccess }) => {
    return (
        <section className="mt-3.5">
            <button onClick={onBack} className="inline-block mb-4 text-brand-accent cursor-pointer font-semibold hover:underline">
                ← Quay lại danh sách mẫu
            </button>
            <div className="grid grid-cols-1 lg:grid-cols-[1fr,400px] gap-6">
                <div>
                    <div className="relative pt-[56.25%] h-0 overflow-hidden rounded-xl bg-black shadow-brand">
                        <iframe
                            src={`https://www.youtube.com/embed/${video.id}?rel=0&autoplay=0`}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="absolute top-0 left-0 w-full h-full rounded-xl"
                        ></iframe>
                    </div>
                    <div className="mt-4 text-base text-brand-text border-l-4 border-brand-accent-2 pl-2.5">
                        {`Mô tả: ${video.desc}`}
                    </div>
                </div>

                <div className="bg-brand-card p-5 rounded-brand shadow-brand border border-[#F0E6D8]">
                    <h3 className="m-0 mb-2.5 text-brand-accent font-title text-3xl border-b-2 border-brand-accent pb-1.5">
                        {`Đặt mẫu: ${video.title}`}
                    </h3>
                    <div className="flex items-center justify-between border-b border-dashed border-[#EEDBC5] pb-4 mb-2">
                        <div>
                            <span className="text-3xl font-extrabold text-brand-accent">{formatVND(video.price)}</span>
                            <span className="ml-2.5 text-base text-brand-muted line-through">{formatVND(video.oldPrice)}</span>
                        </div>
                        <div className="text-sm font-bold text-brand-accent">Đã giảm giá!</div>
                    </div>
                    
                    <OrderForm video={video} onPaymentSuccess={onPaymentSuccess} />
                </div>
            </div>
        </section>
    );
};
