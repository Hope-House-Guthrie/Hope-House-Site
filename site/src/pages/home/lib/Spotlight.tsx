import React, { useState, useEffect, useRef, useCallback } from "react";

export interface SpotlightItem {
  id: string;
  title: string;
  src: string;
  srcset?: string;
  width?: number;
  height?: number;
}

export interface Props {
  spotlights: SpotlightItem[];
}

export const Spotlight: React.FC<Props> = ({ spotlights }) => {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
    return false;
  });
  const [hovering, setHovering] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const [enlargedImage, setEnlargedImage] = useState<{ src: string; alt: string } | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const dialogRef = useRef<HTMLDialogElement>(null);
  const touchStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const showSlide = useCallback(
    (index: number, manual = false) => {
      if (!spotlights.length) return;
      const newIndex = (index + spotlights.length) % spotlights.length;
      setCurrent(newIndex);

      if (manual) {
        setPaused(true);
        setAnnouncement(`1 of ${spotlights.length}: ${spotlights[newIndex].title}`);
      }
    },
    [spotlights]
  );

  // Auto-rotation timer
  useEffect(() => {
    if (paused || hovering || isDialogOpen) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % spotlights.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [paused, hovering, isDialogOpen, spotlights.length]);

  const handlePrevious = () => showSlide(current - 1, true);
  const handleNext = () => showSlide(current + 1, true);
  const togglePlay = () => setPaused((prev) => !prev);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.changedTouches[0];
    if (touch) {
      touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touch = e.changedTouches[0];
    if (!touch) return;

    const distanceX = touch.clientX - touchStartRef.current.x;
    const distanceY = touch.clientY - touchStartRef.current.y;

    if (Math.abs(distanceX) > 60 && Math.abs(distanceX) > Math.abs(distanceY)) {
      showSlide(current + (distanceX < 0 ? 1 : -1), true);
    }
  };

  const openEnlargedModal = (item: SpotlightItem) => {
    setPaused(true);
    setEnlargedImage({ src: item.src, alt: item.title });
    setIsDialogOpen(true);
    dialogRef.current?.showModal();
  };

  const closeEnlargedModal = () => {
    dialogRef.current?.close();
    setIsDialogOpen(false);
    setEnlargedImage(null);
  };

  if (!spotlights || spotlights.length === 0) return null;

  return (
    <>
      <div
        className="overflow-hidden raised bg-white"
        role="region"
        aria-roledescription="carousel"
        aria-label="Hope House community spotlights"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        onFocus={(e) => {
          // Pause if focus moves inside (unless it's the play button)
          if (!e.currentTarget.contains(e.relatedTarget)) {
            setPaused(true);
          }
        }}
      >
        <div
          className="bg-[radial-gradient(ellipse_at_top,#ffffff_20%,#f0f9ff_75%,#e0f2fe_100%)]p-3 sm:p-6"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {spotlights.map((item, index) => (
            <article
              key={item.id || index}
              hidden={index !== current}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${spotlights.length}: ${item.title}`}
            >
              <button
                type="button"
                onClick={() => openEnlargedModal(item)}
                className="block w-full rounded-lg focus-visible:outline focus-visible:outline-offset-4 focus-visible:outline-sky-700"
                aria-label={`Enlarge flyer: ${item.title}`}
              >
                <img
                  src={item.src}
                  srcSet={item.srcset}
                  alt={item.title}
                  width={item.width || 1000}
                  height={item.height}
                  loading="lazy"
                  className="w-full h-200 object-contain drop-shadow-[0_10px_12px_rgba(15,23,42,0.2)] transition duration-200 ease-out hover:-translate-y-0.5 hover:drop-shadow-[0_15px_16px_rgba(15,23,42,0.25)]"
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

        <div className="flex flex-col items-center gap-2 border-t border-sky-100 bg-sky-50 px-4 py-4">
          <span className="text-center text-xs font-semibold tracking-wider text-slate-500">
            {current + 1} / {spotlights.length}
          </span>

          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={handlePrevious}
              aria-label="Previous spotlight"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-linear-to-b from-sky-500 to-sky-700 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_3px_0_#075985,0_5px_8px_rgba(12,74,110,0.2)] transition active:translate-y-0.5 active:shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_1px_0_#075985] hover:bg-sky-800 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-sky-700"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M19 12H5m7 7-7-7 7-7"></path>
              </svg>
            </button>

            <button
              type="button"
              onClick={togglePlay}
              aria-label={paused ? "Play spotlight rotation" : "Pause spotlight rotation"}
              title={paused ? "Play spotlight rotation" : "Pause spotlight rotation"}
              className="flex h-11 w-11 items-center justify-center rounded-full text-sky-700 transition hover:bg-sky-100 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-sky-700"
            >
              {paused ? (
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="m8 5 11 7-11 7z"></path>
                </svg>
              ) : (
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M6 5h4v14H6zm8 0h4v14h-4z"></path>
                </svg>
              )}
            </button>

            <button
              type="button"
              onClick={handleNext}
              aria-label="Next spotlight"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-linear-to-b from-sky-500 to-sky-700 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_3px_0_#075985,0_5px_8px_rgba(12,74,110,0.2)] transition active:translate-y-0.5 active:shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_1px_0_#075985] hover:bg-sky-800 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-sky-700"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14m-7-7 7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </div>

        <p className="sr-only" aria-live="polite">
          {announcement}
        </p>
      </div>

      <dialog
        ref={dialogRef}
        onClose={closeEnlargedModal}
        aria-label="Enlarged spotlight flyer"
        className="m-auto max-h-[92dvh] w-[92vw] max-w-4xl overflow-y-auto rounded-xl bg-white p-3 shadow-xl backdrop:bg-slate-900/70 sm:p-5"
      >
        <div className="mb-3 flex justify-end">
          <button
            type="button"
            onClick={closeEnlargedModal}
            autoFocus
            className="min-h-11 rounded-lg bg-sky-700 px-5 py-2 font-semibold text-white hover:bg-sky-800"
          >
            Close ✕
          </button>
        </div>

        {enlargedImage && (
          <img
            src={enlargedImage.src}
            alt={enlargedImage.alt}
            className="h-auto w-full"
          />
        )}
      </dialog>
    </>
  );
};

export default Spotlight;