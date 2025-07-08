import React, { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import './Gallery.css';

/* 1️⃣ 只扫 src/assets/images */
const modules = import.meta.glob('../assets/images/*.{png,jpg,jpeg}', {
  eager: true,
  as: 'url',
});
const images = Object.values(modules).sort();     // 保证顺序一致

export default function Gallery() {
  const [lightbox, setLightbox] = useState({ open: false, idx: 0 });

  /** 基础动作 **/
  const openAt = idx => setLightbox({ open: true, idx });
  const close  = ()   => setLightbox({ open: false, idx: 0 });
  const prev   = ()   =>
    setLightbox(b => ({ open: true, idx: (b.idx - 1 + images.length) % images.length }));
  const next   = ()   =>
    setLightbox(b => ({ open: true, idx: (b.idx + 1) % images.length }));

  /** 2️⃣ swipeable – 竖向切换 **/
  const swipeHandlers = useSwipeable({
    onSwipedUp   : () => { console.log('⬆️ swipe — next'); next(); },
    onSwipedDown : () => { console.log('⬇️ swipe — prev'); prev(); },
    trackTouch   : true,
    trackMouse   : true,
    delta        : 30,                    // 像素阈值
    preventScrollOnSwipe : true,
    touchEventOptions    : { passive: false }
  });

  return (
    <>
      {/* 缩略图网格 */}
      <div className="gallery-grid">
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`thumb-${i}`}
            className="gallery-thumb"
            onClick={() => openAt(i)}
          />
        ))}
      </div>

      {/* Lightbox + swipe */}
      {lightbox.open && (
        <div className="lightbox" onClick={close}>
          <div className="lightbox-inner" {...swipeHandlers}>
            <img
              src={images[lightbox.idx]}
              alt={`large-${lightbox.idx}`}
              className="lightbox-img"
            />
          </div>

          {/* 手动按钮（可选） */}
          <button className="lightbox-nav prev" onClick={e => { e.stopPropagation(); prev(); }}>‹</button>
          <button className="lightbox-nav next" onClick={e => { e.stopPropagation(); next(); }}>›</button>
        </div>
      )}
    </>
  );
}
