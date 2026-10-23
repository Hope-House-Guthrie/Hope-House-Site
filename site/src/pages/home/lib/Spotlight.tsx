import React, { useState, useEffect, useRef } from "react";

export interface OptimizedSpotlight {
  id: string;
  title: string;
  src: string;
  srcset?: string;
  width?: number;
  height?: number;
}

interface HopeSpotlightProps {
  spotlights: OptimizedSpotlight[];
}

export default function HopeSpotlight({ spotlights }: HopeSpotlightProps) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const [hovering, setHovering] = useState(false);
  const [enlargedImage, setEnlargedImage] = useState<OptimizedSpotlight | null>(null);
  const [announcement, setAnnouncement] = useState("");

  const dialogRef = useRef<HTMLDialogElement>(null);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const showSlide = (index: number, manual = false) => {
    if (!spotlights.length) return;
    const newIndex = (index + spotlights.length) % spotlights.length;
    setCurrent(newIndex);

    if (manual) {
      setPaused(true);
      setAnnouncement(`${newIndex + 1} of ${spotlights.length}: ${spotlights[newIndex].title}`);
    }
  };

  useEffect(() => {
    if (paused || hovering || enlargedImage || document.hidden) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % spotlights.length);
    }, 10000);

    return () => clearInterval(timer);
  }, [paused, hovering, enlargedImage, spotlights.length]);

  return (
    <>
      <div
        id="hope-spotlight"
        className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-sky-200 border-t-4 border-t-sky-500 bg-white shadow-xl shadow-sky-900/10"
        role="region"
        aria-roledescription="carousel"
        aria-label="Hope House community spotlights"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        <div 
          className="p-3 sm:p-6"
          onTouchStart={(e) => {
            const touch = e.changedTouches[0];
            if (touch) {
              touchStartX.current = touch.clientX;
              touchStartY.current = touch.clientY;
            }
          }}
          onTouchEnd={(e) => {
            const touch = e.changedTouches[0];
            if (!touch) return;
            const distanceX = touch.clientX - touchStartX.current;
            const distanceY = touch.clientY - touchStartY.current;

            if (Math.abs(distanceX) > 60 && Math.abs(distanceX) > Math.abs(distanceY)) {
              showSlide(current + (distanceX < 0 ? 1 : -1), true);
            }
          }}
        >
          {spotlights.map((item, index) => (
            <article
              key={item.id}
              hidden={index !== current}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${spotlights.length}: ${item.title}`}
            >
              <button
                type="button"
                onClick={() => {
                  setPaused(true);
                  setEnlargedImage(item);
                  dialogRef.current?.showModal();
                }}
                className="block w-full rounded-lg focus-visible:outline focus-visible:outline-offset-4 focus-visible:outline-sky-700"
                aria-label={`Enlarge flyer: ${item.title}`}
              >
                <img
                  src={item.src}
                  srcSet={item.srcset}
                  alt={item.title}
                  width={item.width}
                  height={item.height}
                  loading={index === 0 ? "eager" : "lazy"}
                  className="mx-auto h-90 w-full object-contain sm:h-130"
                />
              </button>

              <h3 className="mt-5 text-center text-lg font-bold text-slate-900">
                {item.title}
              </h3>

              <p className="mt-1 text-center text-sm text-slate-500">
                Tap or click the flyer to enlarge
              </p>
            </article>
          ))}
        </div>

        {/* Carousel controls omitted here for brevity, same as previous snippet */}
      </div>

      <dialog
        ref={dialogRef}
        aria-label="Enlarged spotlight flyer"
        className="m-auto max-h-[92dvh] w-[92vw] max-w-4xl overflow-y-auto rounded-xl bg-white p-3 shadow-xl backdrop:bg-slate-900/70 sm:p-5"
        onClose={() => setEnlargedImage(null)}
      >
        <form method="dialog" className="mb-3 flex justify-end">
          <button type="submit" autoFocus className="min-h-11 rounded-lg bg-sky-700 px-5 py-2 font-semibold text-white hover:bg-sky-800">
            Close ✕
          </button>
        </form>
        {enlargedImage && (
          <img src={enlargedImage.src} alt={enlargedImage.title} className="h-auto w-full" />
        )}
      </dialog>
    </>
  );
}