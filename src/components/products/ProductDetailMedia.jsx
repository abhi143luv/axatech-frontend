import { useState, useRef, useEffect } from 'react';
import { Button, Modal } from '../common';
import { PlayIcon, PauseIcon } from '../icons';

function getVideoUrl(demoVideoLink) {
  if (!demoVideoLink) return null;
  if (demoVideoLink.startsWith('http')) return demoVideoLink;
  const base = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || '';
  return `${base}/uploads/${demoVideoLink.replace(/^[/\\]+/, '')}`;
}

/** Extract YouTube video id from watch, youtu.be, embed, or shorts URLs. */
function getYouTubeVideoId(url) {
  if (!url || typeof url !== 'string') return null;
  const u = url.trim();
  const id = '([a-zA-Z0-9_-]{11})';
  let m = u.match(new RegExp(`youtu\\.be\\/${id}(?:[?#]|$)`));
  if (m) return m[1];
  m = u.match(new RegExp(`youtube\\.com\\/embed\\/${id}(?:[?#]|$)`));
  if (m) return m[1];
  m = u.match(new RegExp(`youtube\\.com\\/shorts\\/${id}(?:[?#]|$)`));
  if (m) return m[1];
  if (/youtube\.com/i.test(u)) {
    m = u.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
    if (m) return m[1];
  }
  return null;
}

function getYouTubeEmbedUrl(url) {
  const id = getYouTubeVideoId(url);
  return id ? `https://www.youtube.com/embed/${id}?autoplay=0` : null;
}

const HIDE_ICON_AFTER_MS = 1000;

export default function ProductDetailMedia({ product }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [iconVisible, setIconVisible] = useState(true);
  const videoRef = useRef(null);
  const hideTimeoutRef = useRef(null);
  const videoUrl = getVideoUrl(product?.demoVideoLink);
  const youtubeEmbed = videoUrl ? getYouTubeEmbedUrl(videoUrl) : null;
  const isYouTube = !!youtubeEmbed;
  const images = product?.images || [];
  const mainImage = images[selectedIndex] || images[0];

  const scheduleHideIcon = () => {
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    hideTimeoutRef.current = setTimeout(() => setIconVisible(false), HIDE_ICON_AFTER_MS);
  };

  const showIcon = () => {
    setIconVisible(true);
    scheduleHideIcon();
  };

  useEffect(() => {
    if (!videoModalOpen) {
      setVideoPlaying(false);
      setIconVisible(true);
      videoRef.current?.pause();
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
    }
  }, [videoModalOpen]);

  useEffect(() => {
    if (videoModalOpen && !isYouTube) {
      setIconVisible(true);
      scheduleHideIcon();
      return () => {
        if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
      };
    }
  }, [videoModalOpen, isYouTube]);

  return (
    <div className="animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
      {images.length > 0 && (
        <div className="space-y-3">
          <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-lg bg-gray-100 dark:bg-gray-800">
            <img
              src={mainImage}
              alt={product.name}
              className="w-full h-auto object-contain max-h-[400px] mx-auto block"
            />
          </div>
          {images.length > 1 && (
            <div className="flex flex-wrap gap-2">
              {images.map((url, index) => (
                <button
                  key={url + index}
                  type="button"
                  onClick={() => setSelectedIndex(index)}
                  className={`rounded-xl overflow-hidden border-2 shrink-0 w-16 h-16 sm:w-20 sm:h-20 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-secondary ${
                    selectedIndex === index
                      ? 'border-primary dark:border-secondary ring-2 ring-primary/30 dark:ring-secondary/30'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <img
                    src={url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
      {videoUrl && (
        <div className="mt-5">
          <Button
            type="button"
            variant="outline"
            onClick={() => setVideoModalOpen(true)}
            className="rounded-xl border-2 border-primary text-primary dark:border-secondary dark:text-secondary hover:bg-primary/10 dark:hover:bg-secondary/10 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 px-6 py-3.5"
          >
            Watch Demo Video
          </Button>
        </div>
      )}

      <Modal
        open={videoModalOpen}
        title="Demo Video"
        size="2xl"
        onClose={() => setVideoModalOpen(false)}
        footer={null}
      >
        <div className="bg-black rounded-xl overflow-hidden aspect-video max-h-[70vh] flex items-center justify-center relative">
          {isYouTube ? (
            <iframe
              title="Demo video"
              src={youtubeEmbed}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div
              className="absolute inset-0 flex items-center justify-center z-10"
              onMouseEnter={showIcon}
              onMouseLeave={scheduleHideIcon}
            >
              <video
                ref={videoRef}
                src={videoUrl}
                controls
                className="w-full h-full object-contain absolute inset-0"
                preload="auto"
                onPlay={() => setVideoPlaying(true)}
                onPause={() => setVideoPlaying(false)}
                onEnded={() => setVideoPlaying(false)}
              >
                Your browser does not support the video tag.
              </video>
              <div
                className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                  iconVisible ? 'opacity-100 pointer-events-none' : 'opacity-0 pointer-events-none'
                }`}
              >
                <button
                  type="button"
                  onClick={() => {
                    if (videoPlaying) {
                      videoRef.current?.pause();
                    } else {
                      videoRef.current?.play();
                    }
                    showIcon();
                  }}
                  className="pointer-events-auto w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-full bg-white/90 text-black dark:bg-gray-800/90 dark:text-gray-100 shadow-lg hover:bg-white dark:hover:bg-gray-700/90 hover:scale-110 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-secondary dark:focus-visible:ring-offset-gray-900"
                  aria-label={videoPlaying ? 'Pause video' : 'Play video'}
                >
                  {videoPlaying ? (
                    <PauseIcon className="w-10 h-10 sm:w-12 sm:h-12 text-[2.5rem] sm:text-[3rem]" />
                  ) : (
                    <PlayIcon className="w-10 h-10 sm:w-12 sm:h-12 text-[2.5rem] sm:text-[3rem] ml-0.5" />
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
