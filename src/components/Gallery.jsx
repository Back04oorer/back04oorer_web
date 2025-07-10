import React, { useState, useMemo } from 'react';
import { useSwipeable } from 'react-swipeable';
import './Gallery.css';

/**
 * 动态导入 assets/images 下一级子文件夹内的所有图片
 * 假设只一层子文件夹，如 assets/images/landscape/*.jpg
 */
const modules = import.meta.glob('../assets/images/*/*.{png,jpg,jpeg}', {
  eager: true,
  as: 'url',
});

// 按子文件夹分组并排序
const imagesByFolder = Object.entries(modules).reduce((acc, [path, url]) => {
  // 解析子文件夹名：倒数第二个路径段
  const parts = path.split('/');
  const folder = parts[parts.length - 2];
  if (!acc[folder]) acc[folder] = [];
  acc[folder].push(url);
  return acc;
}, {});

// 对每组图片进行排序，保证加载顺序一致
Object.values(imagesByFolder).forEach(arr => arr.sort());

export default function Gallery() {
  // lightbox state: open, 当前组名, 以及索引
  const [lightbox, setLightbox] = useState({ open: false, folder: '', idx: 0 });

  // 展平后的列表，用于全局导航或按组导航
  const flatList = useMemo(() => {
    return Object.entries(imagesByFolder)
      .map(([folder, urls]) => urls.map(url => ({ folder, url })))
      .reduce((all, group) => all.concat(group), []);
  }, []);

  // 打开某组的第 i 张
  const openAt = (folder, idx) => setLightbox({ open: true, folder, idx });
  const close = () => setLightbox({ open: false, folder: '', idx: 0 });

  // 在当前组内上/下张
  const prev = () => {
    const arr = imagesByFolder[lightbox.folder];
    setLightbox(b => ({
      open: true,
      folder: b.folder,
      idx: (b.idx - 1 + arr.length) % arr.length,
    }));
  };
  const next = () => {
    const arr = imagesByFolder[lightbox.folder];
    setLightbox(b => ({
      open: true,
      folder: b.folder,
      idx: (b.idx + 1) % arr.length,
    }));
  };

  // swipe handlers
  const swipeHandlers = useSwipeable({
    onSwipedUp: () => next(),
    onSwipedDown: () => prev(),
    trackTouch: true,
    trackMouse: true,
    delta: 30,
    preventScrollOnSwipe: true,
    touchEventOptions: { passive: false },
  });

  return (
    <>
      {/* 针对子文件夹渲染多组画廊 */}
      {Object.entries(imagesByFolder).map(([folder, urls]) => (
        <div key={folder} className="gallery-group">
          <h2 className="gallery-title">{folder}</h2>
          <div className="gallery-grid">
            {urls.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`${folder}-thumb-${i}`}
                className="gallery-thumb"
                onClick={() => openAt(folder, i)}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Lightbox */}
      {lightbox.open && (
        <div className="lightbox" onClick={close}>
          <div className="lightbox-inner" {...swipeHandlers}>
            <img
              src={imagesByFolder[lightbox.folder][lightbox.idx]}
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
