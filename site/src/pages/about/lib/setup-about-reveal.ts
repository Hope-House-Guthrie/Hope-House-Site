export function setupAboutReveal() {
  const cards = Array.from(
    document.querySelectorAll<HTMLElement>("[data-about-reveal]"),
  );

  if (!cards.length || !("IntersectionObserver" in window)) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (reducedMotion.matches) return;

  const animations = new Set<Animation>();
  const targets = new Map<HTMLElement, HTMLElement>();

  cards.forEach((card) => {
    const wrapper = document.createElement("div");
    wrapper.style.minWidth = "0";
    wrapper.style.display = "grid";

    card.before(wrapper);
    wrapper.appendChild(card);

    card.style.visibility = "hidden";
    targets.set(wrapper, card);
  });

  function reveal(card: HTMLElement) {
    const desktop = window.matchMedia("(min-width: 768px)").matches;
    const direction = card.dataset.aboutReveal;
    const rect = card.getBoundingClientRect();

    let x = 0;
    let y = 0;

    if (direction === "left" || (!desktop && direction === "value-top")) {
      x = -rect.right - 40;
    } else if (
      direction === "right" ||
      (!desktop && direction === "value-bottom")
    ) {
      x = window.innerWidth - rect.left + 40;
    } else if (direction === "value-top") {
      y = -rect.bottom - 40;
    } else if (direction === "value-bottom") {
      y = window.innerHeight - rect.top + 40;
    }

    const delay = desktop
      ? parseFloat(getComputedStyle(card).getPropertyValue("--reveal-delay")) ||
        0
      : 0;

    const animation = card.animate(
      [{ translate: `${x}px ${y}px` }, { translate: "0px 0px" }],
      {
        duration: 1600,
        delay,
        easing: "cubic-bezier(0.25, 0.1, 0.25, 1)",
        fill: "both",
      },
    );

    card.style.visibility = "";
    animations.add(animation);

    animation.onfinish = () => {
      animation.cancel();
      animations.delete(animation);
    };
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const wrapper = entry.target as HTMLElement;
        const card = targets.get(wrapper);

        if (card) reveal(card);
        observer.unobserve(wrapper);
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -40px 0px",
    },
  );

  targets.forEach((_, wrapper) => observer.observe(wrapper));

  function showAll() {
    observer.disconnect();
    animations.forEach((animation) => animation.cancel());
    animations.clear();
    cards.forEach((card) => {
      card.style.visibility = "";
    });
  }

  function onMotionChange() {
    if (reducedMotion.matches) showAll();
  }

  reducedMotion.addEventListener("change", onMotionChange);

  document.addEventListener(
    "astro:before-swap",
    () => {
      showAll();
      reducedMotion.removeEventListener("change", onMotionChange);
    },
    { once: true },
  );
}
