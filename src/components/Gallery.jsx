import React, { useState, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';
import './Gallery.css';

/**
 * 使用 vite-imagetools 生成：
 * - placeholder:极低分辨率 Base64 模糊图
 * - thumb:400px 宽 WebP 缩略图
 * - full:原图 URL
 */
const placeholderModules = import.meta.glob(
  '../assets/images/*/*.{png,jpg,jpeg}',
  { eager: true, query: '?width=20&format=webp', import: 'default' }
);
const thumbModules = import.meta.glob(
  '../assets/images/*/*.{png,jpg,jpeg}',
  { eager: true, query: '?width=400&format=webp', import: 'default' }
);
const fullModules = import.meta.glob(
  '../assets/images/*/*.{png,jpg,jpeg}',
  { eager: true, query: '?url', import: 'default' }
);

// 按文件路径分组并排序
function groupByPath(mods) {
  return Object.entries(mods).reduce((acc, [path, url]) => {
    const parts = path.split('/');
    const folder = parts[parts.length - 2];
    if (!acc[folder]) acc[folder] = [];
    acc[folder].push({ path, url });
    return acc;
  }, {});
}

const placeholdersByFolder = groupByPath(placeholderModules);
const thumbsByFolder       = groupByPath(thumbModules);
const fullByFolder         = groupByPath(fullModules);

// 对各组按路径排序，确保占位图、缩略图和原图一一对应
[placeholdersByFolder, thumbsByFolder, fullByFolder].forEach(groupMap => {
  Object.values(groupMap).forEach(arr =>
    arr.sort((a, b) => a.path.localeCompare(b.path))
  );
});

export default function Gallery() {
  const [lightbox, setLightbox] = useState({ open: false, folder: '', idx: 0 });

  const openAt = (folder, idx) => setLightbox({ open: true, folder, idx });
  const close  = () => setLightbox({ open: false, folder: '', idx: 0 });

  // 预加载下一张大图
  useEffect(() => {
    if (!lightbox.open) return;
    const arr = fullByFolder[lightbox.folder];
    const nextUrl = arr[(lightbox.idx + 1) % arr.length].url;
    new Image().src = nextUrl;
  }, [lightbox]);

  const prev = () => {
    const arr = fullByFolder[lightbox.folder];
    setLightbox(b => ({
      open: true,
      folder: b.folder,
      idx: (b.idx - 1 + arr.length) % arr.length,
    }));
  };
  const next = () => {
    const arr = fullByFolder[lightbox.folder];
    setLightbox(b => ({
      open: true,
      folder: b.folder,
      idx: (b.idx + 1) % arr.length,
    }));
  };

  const swipeHandlers = useSwipeable({
    onSwipedUp: next,
    onSwipedDown: prev,
    trackTouch: true,
    trackMouse: true,
    delta: 30,
    preventScrollOnSwipe: true,
    touchEventOptions: { passive: false },
  });

  return (
    <>
      {Object.keys(thumbsByFolder).map(folder => (
        <div key={folder} className="gallery-group">
          <h2 className="gallery-title">{folder}</h2>
          <div className="gallery-grid">
            {thumbsByFolder[folder].map((item, i) => {
              const placeholder = placeholdersByFolder[folder]?.[i]?.url;
              const thumbUrl = item.url;
              return (
                <div key={i} className="gallery-thumb-wrapper">
                  {/* 低质量占位图 */}
                  <img
                    className="gallery-thumb placeholder"
                    src={placeholder}
                    aria-hidden="true"
                  />
                  {/* 缩略图 */}
                  <img
                    className="gallery-thumb actual"
                    src={thumbUrl}
                    loading="lazy"
                    alt={`${folder}-thumb-${i}`}
                    onClick={() => openAt(folder, i)}
                    onLoad={e => {
                      e.currentTarget.classList.add('actual-loaded');
                      e.currentTarget.previousSibling.style.opacity = '0';
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {lightbox.open && (
        <div className="lightbox" onClick={close}>
          <div className="lightbox-inner" {...swipeHandlers}>
            <img
              src={fullByFolder[lightbox.folder][lightbox.idx].url}
              loading="eager"
              alt={`${lightbox.folder}-large-${lightbox.idx}`}
              className="lightbox-img"
            />
          </div>
          <button className="lightbox-nav prev" onClick={e => { e.stopPropagation(); prev(); }}>‹</button>
          <button className="lightbox-nav next" onClick={e => { e.stopPropagation(); next(); }}>›</button>
        </div>
      )}
    </>
  );
}
