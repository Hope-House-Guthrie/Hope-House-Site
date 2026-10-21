export class SpotlightCarousel {
  private carousel: HTMLElement;
  private dialog: HTMLDialogElement;
  private slides: HTMLElement[];
  private counter: HTMLElement | null;
  private playBtn: HTMLButtonElement | null;
  private pauseIcon: SVGElement | null = null;
  private playIcon: SVGElement | null = null;
  private announcement: HTMLElement | null;
  private fullImage: HTMLImageElement | null;

  private current = 0;
  private paused = window.matchMedia("(prefers-reduced-motion: reduce)")
    .matches;
  private hovering = false;
  private touchStartX = 0;
  private touchStartY = 0;
  private timerId: number | null = null;

  constructor(carouselElement: HTMLElement, dialogElement: HTMLDialogElement) {
    this.carousel = carouselElement;
    this.dialog = dialogElement;

    this.slides = Array.from(
      this.carousel.querySelectorAll<HTMLElement>("[data-slide]"),
    );
    this.counter = this.carousel.querySelector<HTMLElement>("[data-counter]");
    this.playBtn =
      this.carousel.querySelector<HTMLButtonElement>("[data-play]");

    if (this.playBtn) {
      this.pauseIcon =
        this.playBtn.querySelector<SVGElement>("[data-pause-icon]");
      this.playIcon =
        this.playBtn.querySelector<SVGElement>("[data-play-icon]");
    }

    this.announcement = this.carousel.querySelector<HTMLElement>(
      "[data-announcement]",
    );
    this.fullImage =
      this.dialog.querySelector<HTMLImageElement>("[data-full-image]");

    this.init();
  }

  private init(): void {
    this.bindEvents();
    this.updatePlayLabel();
    this.startAutoplay();
  }

  private updatePlayLabel(): void {
    if (!this.playBtn) return;

    this.pauseIcon?.toggleAttribute("hidden", this.paused);
    this.playIcon?.toggleAttribute("hidden", !this.paused);

    const label = this.paused
      ? "Play spotlight rotation"
      : "Pause spotlight rotation";

    this.playBtn.setAttribute("aria-label", label);
    this.playBtn.title = label;
  }

  public showSlide(index: number, manual = false): void {
    if (!this.slides.length) return;

    this.current = (index + this.slides.length) % this.slides.length;

    this.slides.forEach((slide, i) => {
      slide.hidden = i !== this.current;
    });

    if (this.counter) {
      this.counter.textContent = `${this.current + 1} / ${this.slides.length}`;
    }

    if (manual) {
      this.paused = true;
      this.updatePlayLabel();

      if (this.announcement) {
        this.announcement.textContent =
          this.slides[this.current].getAttribute("aria-label") ?? "";
      }
    }
  }

  private bindEvents(): void {
    this.carousel
      .querySelector("[data-previous]")
      ?.addEventListener("click", () => {
        this.showSlide(this.current - 1, true);
      });

    this.carousel
      .querySelector("[data-next]")
      ?.addEventListener("click", () => {
        this.showSlide(this.current + 1, true);
      });

    this.playBtn?.addEventListener("click", () => {
      this.paused = !this.paused;
      this.updatePlayLabel();
    });

    this.carousel.addEventListener("mouseenter", () => {
      this.hovering = true;
    });

    this.carousel.addEventListener("mouseleave", () => {
      this.hovering = false;
    });

    this.carousel.addEventListener("focusin", (event) => {
      if (event.target === this.playBtn) return;

      this.paused = true;
      this.updatePlayLabel();
    });

    const slideArea = this.carousel.querySelector<HTMLElement>("[data-slides]");

    slideArea?.addEventListener(
      "touchstart",
      (event) => {
        const touch = event.changedTouches[0];
        if (!touch) return;

        this.touchStartX = touch.clientX;
        this.touchStartY = touch.clientY;
      },
      { passive: true },
    );

    slideArea?.addEventListener(
      "touchend",
      (event) => {
        const touch = event.changedTouches[0];
        if (!touch) return;

        const distanceX = touch.clientX - this.touchStartX;
        const distanceY = touch.clientY - this.touchStartY;

        if (
          Math.abs(distanceX) > 60 &&
          Math.abs(distanceX) > Math.abs(distanceY)
        ) {
          this.showSlide(this.current + (distanceX < 0 ? 1 : -1), true);
        }
      },
      { passive: true },
    );

    this.carousel.querySelectorAll("[data-enlarge]").forEach((button) => {
      button.addEventListener("click", () => {
        const image = button.querySelector("img");

        if (image && this.fullImage) {
          this.paused = true;
          this.updatePlayLabel();

          this.fullImage.src = image.currentSrc || image.src;
          this.fullImage.alt = image.alt;

          this.dialog.showModal();
        }
      });
    });
  }

  private startAutoplay(): void {
    this.timerId = window.setInterval(() => {
      if (
        !this.paused &&
        !this.hovering &&
        !this.dialog.open &&
        !document.hidden
      ) {
        this.showSlide(this.current + 1);
      }
    }, 10000);
  }

  public destroy(): void {
    if (this.timerId !== null) {
      clearInterval(this.timerId);
    }
  }
}

export function initSpotlight(): SpotlightCarousel | null {
  const carousel = document.getElementById("hope-spotlight");
  const dialog = document.querySelector<HTMLDialogElement>(
    "#spotlight-enlarged",
  );

  if (carousel && dialog) {
    return new SpotlightCarousel(carousel, dialog);
  }
  return null;
}
