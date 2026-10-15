export function initLiquidPhotos(root: ParentNode = document): () => void {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const cleanups: Array<() => void> = [];

  const frames = root.querySelectorAll<HTMLElement>("[data-photo-transition]");

  frames.forEach((frame) => {
    const before = frame.querySelector<HTMLElement>(".story-photo-before");
    const current = frame.querySelector<HTMLElement>(".story-photo-now");
    const displacement = frame.querySelector<SVGFEDisplacementMapElement>(
      "[data-liquid-displacement]",
    );

    if (!before || !current || !displacement) return;

    // Intake: 4 seconds. Current: 6 seconds.
    // Each liquid transition: 1.8 seconds.
    const intakeHold = 4000;
    const transition = 1800;
    const currentHold = 6000;
    const cycle = intakeHold + transition + currentHold + transition;

    let elapsed = 0;
    let lastTime: number | null = null;
    let animationId = 0;
    let visible = false;
    let ready = false;
    let disposed = false;

    const ease = (value: number) => value * value * (3 - 2 * value);

    function render() {
      if (!before || !current || !displacement) return;

      let amount = 0;
      let strength = 0;

      if (elapsed < intakeHold) {
        amount = 0;
      } else if (elapsed < intakeHold + transition) {
        const progress = (elapsed - intakeHold) / transition;
        amount = ease(progress);
        strength = Math.sin(Math.PI * progress) * 65;
      } else if (elapsed < intakeHold + transition + currentHold) {
        amount = 1;
      } else {
        const progress =
          (elapsed - intakeHold - transition - currentHold) / transition;
        amount = 1 - ease(progress);
        strength = Math.sin(Math.PI * progress) * 65;
      }

      // The intake photo stays underneath so no blank background
      // appears as the current photo fades in or out.
      before.style.opacity = "1";
      current.style.opacity = String(amount);
      displacement.setAttribute("scale", strength.toFixed(2));

      frame.toggleAttribute("data-liquid-active", strength > 0.1);

      // Show only the label belonging to the dominant photo.
      const beforeLabel = before.querySelector("span");
      const currentLabel = current.querySelector("span");

      if (beforeLabel) {
        beforeLabel.style.opacity = amount < 0.5 ? "1" : "0";
      }

      if (currentLabel) {
        currentLabel.style.opacity = amount >= 0.5 ? "1" : "0";
      }
    }

    function tick(time: number) {
      animationId = 0;

      if (!shouldRun()) {
        lastTime = null;
        return;
      }

      if (lastTime !== null) {
        elapsed = (elapsed + Math.min(time - lastTime, 100)) % cycle;
      }

      lastTime = time;
      render();
      animationId = requestAnimationFrame(tick);
    }

    function shouldRun() {
      return (
        ready &&
        !disposed &&
        visible &&
        !document.hidden &&
        !reducedMotion.matches
      );
    }

    function sync() {
      if (!before || !current || !displacement) return;

      if (animationId) cancelAnimationFrame(animationId);
      animationId = 0;
      lastTime = null;

      if (reducedMotion.matches) {
        frame.removeAttribute("data-liquid-ready");
        frame.removeAttribute("data-liquid-active");
        before.style.opacity = "0";
        current.style.opacity = "1";
        displacement.setAttribute("scale", "0");
      } else if (ready) {
        frame.setAttribute("data-liquid-ready", "");
        render();
      }

      if (shouldRun()) {
        animationId = requestAnimationFrame(tick);
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        sync();
      },
      { threshold: 0.1 },
    );

    observer.observe(frame);
    reducedMotion.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);

    // Wait for both lazy-loaded photos before starting.
    const images = Array.from(frame.querySelectorAll<HTMLImageElement>("img"));

    Promise.all(
      images.map(
        (image) =>
          new Promise<void>((resolve) => {
            if (image.complete) {
              resolve();
              return;
            }

            image.addEventListener("load", () => resolve(), { once: true });
            image.addEventListener("error", () => resolve(), { once: true });
          }),
      ),
    ).then(() => {
      if (disposed) return;
      ready = images.every((image) => image.naturalWidth > 0);
      sync();
    });

    cleanups.push(() => {
      disposed = true;
      cancelAnimationFrame(animationId);
      observer.disconnect();
      reducedMotion.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
    });
  });

  const cleanup = () => cleanups.forEach((c) => c());
  document.addEventListener("astro:before-swap", cleanup, { once: true });
  return cleanup;
}
