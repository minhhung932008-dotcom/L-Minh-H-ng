import React, { useState } from 'react';
import { Header } from './components/Header';
import { ProductGrid } from './components/ProductGrid';
import { OrderDetail } from './components/OrderDetail';
import type { Video } from './types';
import FireworksCanvas from './components/FireworksCanvas';

const App: React.FC = () => {
    const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
    const [showFireworks, setShowFireworks] = useState(false);

    const handleSelectVideo = (video: Video) => {
        setSelectedVideo(video);
        setShowFireworks(false); // Reset fireworks when selecting a new video
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    
    const handlePaymentSuccess = () => {
        setShowFireworks(true);
    };

    const handleBackToGrid = () => {
        setSelectedVideo(null);
    };

    return (
        <div className="w-full max-w-7xl mx-auto">
            {showFireworks && <FireworksCanvas />}
            <Header />
            <main>
                {!selectedVideo ? (
                    <ProductGrid onSelectVideo={handleSelectVideo} />
                ) : (
                    <OrderDetail
                        video={selectedVideo}
                        onBack={handleBackToGrid}
                        onPaymentSuccess={handlePaymentSuccess}
                    />
                )}
            </main>
            <footer className="mt-8 text-center text-brand-muted text-xs md:text-sm py-4 border-t border-dashed border-[#F0E6D8]">
                Dữ liệu đơn hàng được gửi trực tiếp đến Telegram Bot. Liên hệ Zalo: 0947262458 nếu cần hỗ trợ gấp.
            </footer>
        </div>
    );
};

export default App;
