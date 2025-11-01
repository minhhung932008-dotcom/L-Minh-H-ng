
import React from 'react';
import type { Video } from '../types';
import { formatVND } from '../constants';

interface ProductCardProps {
    video: Video;
    onSelect: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ video, onSelect }) => {
    const thumbUrl = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;

    return (
        <div className="bg-brand-card p-4 rounded-brand shadow-brand overflow-hidden transition-all duration-300 ease-in-out flex flex-col hover:-translate-y-1.5 hover:shadow-brand-hover">
            <img className="w-full h-48 object-cover rounded-xl mb-3" src={thumbUrl} alt={video.title} />
            <h2 className="font-extrabold m-0 mb-1 font-title text-brand-text text-2xl">{video.title}</h2>
            <p className="text-sm text-brand-muted mb-3 flex-grow">{video.desc}</p>
            <div className="flex items-end justify-between mb-3">
                <div className="flex items-end">
                    <span className="text-brand-accent font-extrabold text-3xl leading-none">{formatVND(video.price)}</span>
                    <span className="text-brand-muted line-through text-base font-normal ml-2.5 leading-snug">{formatVND(video.oldPrice)}</span>
                </div>
            </div>
            <button
                onClick={onSelect}
                className="mt-auto p-3 rounded-lg border-none bg-brand-accent text-white font-bold w-full cursor-pointer text-base transition-colors duration-200 hover:bg-brand-accent-2 focus:outline-none focus:ring-2 focus:ring-brand-accent-2 focus:ring-opacity-50"
            >
                Chọn mẫu này
            </button>
        </div>
    );
};
