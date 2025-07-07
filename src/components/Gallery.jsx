import React, { useState } from 'react';
import './Gallery.css';

const images = [
  '/images/1.jpeg',
  '/images/2.jpeg',
];

export default function Gallery() {
  const [lightbox, setLightbox] = useState({ open: false, idx: 0 });

  const openAt = i => setLightbox({ open: true, idx: i });
  const close = () => setLightbox({ open: false, idx: 0 });
  const prev = () => setLightbox(b => ({ open: true, idx: (b.idx - 1 + images.length) % images.length }));
  const next = () => setLightbox(b => ({ open: true, idx: (b.idx + 1) % images.length }));

  return (
    <>
      <div className="gallery-grid">
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`img-${i}`}
            onClick={() => openAt(i)}
            className="gallery-thumb"
          />
        ))}
      </div>
      {lightbox.open && (
        <div className="lightbox" onClick={close}>
          <button className="lightbox-nav prev"
                  onClick={e => { e.stopPropagation(); prev(); }}>
            ‹
          </button>
          <img
            className="lightbox-img"
            src={images[lightbox.idx]}
            alt={`large-${lightbox.idx}`}
          />
          <button className="lightbox-nav next"
                  onClick={e => { e.stopPropagation(); next(); }}>
            ›
          </button>
        </div>
      )}
    </>
  );
}
