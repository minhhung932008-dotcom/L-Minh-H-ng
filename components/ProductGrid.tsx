
import React from 'react';
import { ProductCard } from './ProductCard';
import { videoData } from '../constants';
import type { Video } from '../types';

interface ProductGridProps {
    onSelectVideo: (video: Video) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ onSelectVideo }) => {
    return (
        <section>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-3">
                {videoData.map(video => (
                    <ProductCard key={video.id} video={video} onSelect={() => onSelectVideo(video)} />
                ))}
            </div>
        </section>
    );
};
