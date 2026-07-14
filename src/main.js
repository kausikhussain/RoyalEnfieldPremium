import "./style.css";

const models = [
  {
    id: "continental-gt",
    name: "Continental GT 650",
    category: "Cafe racer",
    accent: "#ff6b1a",
    accentSoft: "#ffd0a7",
    gradient: "linear-gradient(135deg, rgba(255, 107, 26, 0.36), rgba(255, 210, 167, 0.08))",
    heroTag: "Built for late-night city runs",
    story:
      "Clip-ons, twin-cylinder urgency, and a low silhouette tuned to feel lean, fast, and precise.",
    engine: "648 cc",
    power: "47 hp",
    torque: "52.3 Nm",
    range: "315 km",
    topSpeed: "169 km/h",
    image: "/media/gt-rocker-red.png",
    film: "https://www.youtube.com/embed/qJmQ6eNJa1U?rel=0",
    chips: ["Twin cylinder", "LED headlamp", "Cafe geometry", "Analog spirit"],
    specs: [
      { label: "Engine", value: "648 cc parallel twin" },
      { label: "Output", value: "47 hp @ 7250 rpm" },
      { label: "Torque", value: "52.3 Nm @ 5150 rpm" }
    ],
    variants: [
      {
        name: "Rocker Red",
        hex: "#ff6421",
        image: "/media/gt-rocker-red.png"
      },
      {
        name: "Slipstream Blue",
        hex: "#4f7fb5",
        image: "/media/gt-slipstream-blue.png"
      },
      {
        name: "British Racing Green",
        hex: "#1f4a35",
        image: "/media/gt-british-racing-green.png"
      }
    ]
  },
  {
    id: "super-meteor",
    name: "Super Meteor 650",
    category: "Cruiser",
    accent: "#e6b451",
    accentSoft: "#ffe6ad",
    gradient: "linear-gradient(135deg, rgba(230, 180, 81, 0.34), rgba(255, 237, 190, 0.1))",
    heroTag: "Long-range highway elegance",
    story:
      "A planted cruiser with stretched proportions, polished finishes, and effortless mile-eating composure.",
    engine: "648 cc",
    power: "47 hp",
    torque: "52.3 Nm",
    range: "340 km",
    topSpeed: "160 km/h",
    image: "/media/super-meteor-celestial-red.webp",
    film: "https://www.youtube.com/embed/keVoECYNGg4?rel=0",
    chips: ["Low-slung stance", "Touring comfort", "Showa suspension", "Wide bars"],
    specs: [
      { label: "Engine", value: "648 cc parallel twin" },
      { label: "Seat height", value: "740 mm" },
      { label: "Torque", value: "52.3 Nm @ 5650 rpm" }
    ],
    variants: [
      {
        name: "Celestial Red",
        hex: "#a53028",
        image: "/media/super-meteor-celestial-red.webp"
      },
      {
        name: "Celestial Blue",
        hex: "#2c546f",
        image: "/media/super-meteor-celestial-blue.webp"
      },
      {
        name: "Astral Black",
        hex: "#161616",
        image: "/media/super-meteor-astral-black.webp"
      }
    ]
  },
  {
    id: "himalayan",
    name: "Himalayan 450",
    category: "Adventure",
    accent: "#97c1d7",
    accentSoft: "#dceff7",
    gradient: "linear-gradient(135deg, rgba(151, 193, 215, 0.32), rgba(220, 239, 247, 0.08))",
    heroTag: "Built by the Himalayas",
    story:
      "Upright control, adventure-ready balance, and a purpose-built platform for broken roads and long climbs.",
    engine: "452 cc",
    power: "40 hp",
    torque: "40 Nm",
    range: "420 km",
    topSpeed: "145 km/h",
    image: "/media/himalayan-hanle-black.webp",
    film: "https://www.youtube.com/embed/jtzzPlVmJJw?rel=0",
    chips: ["Ride-by-wire", "USD forks", "TripperDash", "All-road chassis"],
    specs: [
      { label: "Engine", value: "452 cc Sherpa single" },
      { label: "Output", value: "40 hp @ 8000 rpm" },
      { label: "Torque", value: "40 Nm @ 5500 rpm" }
    ],
    variants: [
      {
        name: "Hanle Black",
        hex: "#222222",
        image: "/media/himalayan-hanle-black.webp"
      },
      {
        name: "Kamet White",
        hex: "#d4d8d6",
        image: "/media/himalayan-kamet-white.webp"
      },
      {
        name: "Kaza Brown",
        hex: "#7f5d46",
        image: "/media/himalayan-kaza-brown.webp"
      }
    ]
  }
];

const app = document.querySelector("#app");

app.innerHTML = `
  <div class="site-shell">
    <div class="loader" data-loader>
      <div class="loader__wordmark">Royal Enfield</div>
      <div class="loader__bar"><span></span></div>
    </div>

    <header class="topbar">
      <a class="brand" href="#hero">
        <span class="brand__mark"></span>
        <span class="brand__text">Royal Enfield</span>
      </a>
      <nav class="topbar__nav">
        <a href="#hero">Home</a>
        <a href="#showcase">Showcase</a>
        <a href="#lineup">Lineup</a>
        <a href="#configure">Configure</a>
        <a href="#reserve">Reserve</a>
      </nav>
      <button class="topbar__menu" type="button" aria-label="Toggle navigation" data-menu-toggle>
        <span></span><span></span>
      </button>
    </header>

    <main>
      <section class="hero" id="hero">
        <div class="hero__copy reveal">
          <p class="eyebrow">Royal Enfield immersive concept</p>
          <h1>Same energy as the reference. More polished. Fully working.</h1>
          <p class="hero__lede">
            A darker launch stage, brighter catalogue transition, richer product imagery, animated model switching,
            working video previews, and a smoother responsive flow built around official Royal Enfield bike assets.
          </p>

          <div class="hero__actions">
            <a class="button button--primary" href="#reserve">Reserve a Test Ride</a>
            <a class="button button--ghost" href="#configure">Explore the Configurator</a>
          </div>

          <div class="hero__metrics">
            <article>
              <span data-hero-engine>648 cc</span>
              <p>Engine platform</p>
            </article>
            <article>
              <span data-hero-power>47 hp</span>
              <p>Peak output</p>
            </article>
            <article>
              <span data-hero-range>315 km</span>
              <p>Estimated ride range</p>
            </article>
          </div>
        </div>

        <div class="hero__stage-wrap reveal reveal--delay">
          <div class="hero__stage" data-stage>
            <div class="hero__stage-glow"></div>
            <div class="hero__stage-ring"></div>

            <div class="hero__stage-top">
              <div class="stage-chip" data-chip-0>Twin cylinder</div>
              <div class="stage-chip" data-chip-1>LED headlamp</div>
              <div class="stage-chip" data-chip-2>Cafe geometry</div>
              <div class="stage-chip" data-chip-3>Analog spirit</div>
            </div>

            <article class="stage-panel stage-panel--left">
              <p class="stage-panel__label">Selected machine</p>
              <h2 data-model-name>Continental GT 650</h2>
              <span class="stage-panel__tag" data-model-category>Cafe racer</span>
              <p class="stage-panel__copy" data-model-story>
                Clip-ons, twin-cylinder urgency, and a low silhouette tuned to feel lean, fast, and precise.
              </p>
              <button class="button button--panel" type="button" data-open-film>Watch film</button>
            </article>

            <article class="stage-panel stage-panel--right">
              <div class="stage-panel__grid">
                <div>
                  <span>Torque</span>
                  <strong data-hero-torque>52.3 Nm</strong>
                </div>
                <div>
                  <span>Top speed</span>
                  <strong data-hero-speed>169 km/h</strong>
                </div>
              </div>
              <div class="stage-panel__progress">
                <p>Variant switch</p>
                <div class="stage-panel__bar"><span data-rotation-bar></span></div>
              </div>
            </article>

            <div class="hero-bike" data-bike-shell>
              <img class="hero-bike__image" data-hero-image src="/media/gt-rocker-red.png" alt="Royal Enfield Continental GT 650 in Rocker Red" />
            </div>

            <div class="hero-selector">
              <div class="hero-selector__models" data-model-tabs></div>
              <div class="hero-selector__variants" data-variant-swatches></div>
            </div>
          </div>
        </div>
      </section>

      <section class="ticker">
        <div class="ticker__track">
          <span>Official bike imagery</span>
          <span>Reference-inspired sequencing</span>
          <span>Animated model switching</span>
          <span>Responsive glassmorphism panels</span>
          <span>Working video lightbox</span>
        </div>
      </section>

      <section class="showcase" id="showcase">
        <div class="section-heading reveal">
          <p class="eyebrow eyebrow--dark">Visual breakdown</p>
          <h2>The bright product section now behaves like a real showcase.</h2>
          <p>
            The reference transitions from a moody launch frame into a clean catalogue. This section mirrors that move
            with a white canvas, highlighted stats, proper bike imagery, and a stronger product hierarchy.
          </p>
        </div>

        <div class="showcase-card reveal">
          <div class="showcase-card__media">
            <div class="showcase-card__glow"></div>
            <img data-gallery-image src="/media/gt-rocker-red.png" alt="Continental GT 650 studio shot" />
          </div>
          <div class="showcase-card__body">
            <p class="showcase-card__eyebrow" data-gallery-category>Cafe racer</p>
            <h3 data-gallery-name>Continental GT 650</h3>
            <p data-gallery-story>
              Clip-ons, twin-cylinder urgency, and a low silhouette tuned to feel lean, fast, and precise.
            </p>
            <div class="showcase-card__specs" data-gallery-specs></div>
          </div>
        </div>
      </section>

      <section class="lineup" id="lineup">
        <div class="lineup__wave"></div>
        <div class="lineup__intro reveal">
          <p class="eyebrow">Popular bikes</p>
          <h2>A stronger lineup section, closer to the rhythm of the reference.</h2>
        </div>
        <div class="lineup__grid" data-lineup-grid></div>
      </section>

      <section class="configure" id="configure">
        <div class="section-heading reveal">
          <p class="eyebrow eyebrow--dark">Configure and preview</p>
          <h2>Switch bikes, swap variants, and keep the stage in sync.</h2>
          <p>
            The same selected state now drives the hero, the bright showcase, the lineup emphasis, and the reserve flow
            so the experience behaves like one connected product story.
          </p>
        </div>

        <div class="config-shell reveal">
          <div class="config-shell__controls">
            <div class="config-block">
              <p class="config-block__label">Choose your bike</p>
              <div class="config-block__choices" data-config-models></div>
            </div>

            <div class="config-block">
              <p class="config-block__label">Available finishes</p>
              <div class="config-block__swatches" data-config-swatches></div>
            </div>

            <div class="config-checks">
              <article>
                <span>01</span>
                <p>Model-linked imagery updates instantly</p>
              </article>
              <article>
                <span>02</span>
                <p>Accent colors drive panels, buttons, and glows</p>
              </article>
              <article>
                <span>03</span>
                <p>Video modal and reserve form stay in sync</p>
              </article>
            </div>
          </div>

          <div class="config-shell__preview">
            <div class="config-preview">
              <div class="config-preview__top">
                <div>
                  <p data-preview-tag>Built for late-night city runs</p>
                  <h3 data-preview-name>Continental GT 650</h3>
                </div>
                <button class="button button--ghost-dark" type="button" data-open-film>
                  Play video
                </button>
              </div>

              <div class="config-preview__image-wrap">
                <div class="config-preview__glow"></div>
                <img data-config-image src="/media/gt-rocker-red.png" alt="Continental GT 650 preview" />
              </div>

              <div class="config-preview__stats">
                <article><span data-preview-power>47 hp</span><p>Peak power</p></article>
                <article><span data-preview-torque>52.3 Nm</span><p>Torque</p></article>
                <article><span data-preview-speed>169 km/h</span><p>Top speed</p></article>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="media reveal" id="media">
        <div class="media__card">
          <div>
            <p class="eyebrow">Film and motion</p>
            <h2>Video interaction is wired up too, not just mocked.</h2>
            <p class="media__copy">
              Open the selected model film in a lightbox, keep the page context intact, and preserve the premium flow
              instead of kicking people away from the experience.
            </p>
          </div>
          <button class="button button--primary" type="button" data-open-film>
            Open Selected Film
          </button>
        </div>
      </section>

      <section class="reserve" id="reserve">
        <div class="reserve__card reveal">
          <div class="reserve__copy">
            <p class="eyebrow eyebrow--dark">Reserve the ride</p>
            <h2>Book a test ride with the same machine selected everywhere else.</h2>
            <p>
              The chosen model now pre-fills the form so the conversion path feels connected to the interactions above.
            </p>
          </div>

          <form class="reserve-form" data-reserve-form>
            <label>
              <span>Name</span>
              <input type="text" name="name" placeholder="Rider name" required />
            </label>
            <label>
              <span>Email</span>
              <input type="email" name="email" placeholder="you@example.com" required />
            </label>
            <label>
              <span>Preferred machine</span>
              <select name="model" data-reserve-model></select>
            </label>
            <button class="button button--primary" type="submit">Request Test Ride</button>
            <p class="reserve-form__message" aria-live="polite"></p>
          </form>
        </div>
      </section>
    </main>

    <div class="video-modal" data-video-modal hidden>
      <div class="video-modal__backdrop" data-close-film></div>
      <div class="video-modal__panel" role="dialog" aria-modal="true" aria-label="Royal Enfield model film">
        <button class="video-modal__close" type="button" aria-label="Close video" data-close-film>&times;</button>
        <div class="video-modal__frame">
          <iframe
            data-film-frame
            title="Royal Enfield film"
            src=""
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
      </div>
    </div>
  </div>
`;

const root = document.documentElement;
const loader = document.querySelector("[data-loader]");
const stage = document.querySelector("[data-stage]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector(".topbar__nav");
const message = document.querySelector(".reserve-form__message");
const reserveForm = document.querySelector("[data-reserve-form]");
const reserveModel = document.querySelector("[data-reserve-model]");
const rotationBar = document.querySelector("[data-rotation-bar]");
const filmFrame = document.querySelector("[data-film-frame]");
const videoModal = document.querySelector("[data-video-modal]");

let selectedModelIndex = 0;
let selectedVariantIndex = 0;
let autoRotateTimer = null;
let progressTimer = null;
let progressValue = 0;

function buildReserveOptions() {
  reserveModel.innerHTML = models
    .map((model) => `<option value="${model.name}">${model.name}</option>`)
    .join("");
}

function renderModelTabs() {
  const tabsMarkup = models
    .map(
      (model, index) => `
        <button class="model-tab ${index === selectedModelIndex ? "is-active" : ""}" type="button" data-select-model="${index}">
          <span>${model.category}</span>
          <strong>${model.name}</strong>
        </button>
      `
    )
    .join("");

  const configMarkup = models
    .map(
      (model, index) => `
        <button class="config-choice ${index === selectedModelIndex ? "is-active" : ""}" type="button" data-select-model="${index}">
          <span>${model.category}</span>
          <strong>${model.name}</strong>
        </button>
      `
    )
    .join("");

  document.querySelector("[data-model-tabs]").innerHTML = tabsMarkup;
  document.querySelector("[data-config-models]").innerHTML = configMarkup;
}

function renderVariants() {
  const model = models[selectedModelIndex];
  const markup = model.variants
    .map(
      (variant, index) => `
        <button
          class="swatch ${index === selectedVariantIndex ? "is-active" : ""}"
          type="button"
          title="${variant.name}"
          aria-label="${variant.name}"
          data-select-variant="${index}"
          style="--swatch:${variant.hex}"
        >
          <span></span>
        </button>
      `
    )
    .join("");

  document.querySelector("[data-variant-swatches]").innerHTML = markup;
  document.querySelector("[data-config-swatches]").innerHTML = markup;
}

function renderLineup() {
  const markup = models
    .map((model, index) => {
      const previewVariant = model.variants[0];
      const active = index === selectedModelIndex;
      return `
        <article class="lineup-card ${active ? "is-active" : ""} reveal" style="--card-accent:${model.accent}">
          <button class="lineup-card__inner" type="button" data-select-model="${index}">
            <div class="lineup-card__visual">
              <div class="lineup-card__glow"></div>
              <img src="${previewVariant.image}" alt="${model.name} in ${previewVariant.name}" />
            </div>
            <div class="lineup-card__body">
              <span>${model.category}</span>
              <h3>${model.name}</h3>
              <p>${model.story}</p>
              <div class="lineup-card__specs">
                <strong>${model.topSpeed}</strong>
                <strong>${model.range}</strong>
              </div>
            </div>
          </button>
        </article>
      `;
    })
    .join("");

  document.querySelector("[data-lineup-grid]").innerHTML = markup;
}

function updateSelectedVariantImage() {
  const model = models[selectedModelIndex];
  const variant = model.variants[selectedVariantIndex];

  root.style.setProperty("--accent", model.accent);
  root.style.setProperty("--accent-soft", model.accentSoft);
  root.style.setProperty("--hero-gradient", model.gradient);

  document.querySelector("[data-model-name]").textContent = model.name;
  document.querySelector("[data-model-category]").textContent = model.category;
  document.querySelector("[data-model-story]").textContent = model.story;

  document.querySelector("[data-hero-engine]").textContent = model.engine;
  document.querySelector("[data-hero-power]").textContent = model.power;
  document.querySelector("[data-hero-range]").textContent = model.range;
  document.querySelector("[data-hero-torque]").textContent = model.torque;
  document.querySelector("[data-hero-speed]").textContent = model.topSpeed;

  document.querySelector("[data-gallery-category]").textContent = model.category;
  document.querySelector("[data-gallery-name]").textContent = model.name;
  document.querySelector("[data-gallery-story]").textContent = model.story;
  document.querySelector("[data-preview-tag]").textContent = model.heroTag;
  document.querySelector("[data-preview-name]").textContent = model.name;
  document.querySelector("[data-preview-power]").textContent = model.power;
  document.querySelector("[data-preview-torque]").textContent = model.torque;
  document.querySelector("[data-preview-speed]").textContent = model.topSpeed;

  document.querySelector("[data-chip-0]").textContent = model.chips[0];
  document.querySelector("[data-chip-1]").textContent = model.chips[1];
  document.querySelector("[data-chip-2]").textContent = model.chips[2];
  document.querySelector("[data-chip-3]").textContent = model.chips[3];

  document.querySelector("[data-gallery-specs]").innerHTML = model.specs
    .map(
      (spec) => `
        <article>
          <span>${spec.label}</span>
          <strong>${spec.value}</strong>
        </article>
      `
    )
    .join("");

  const heroImage = document.querySelector("[data-hero-image]");
  const galleryImage = document.querySelector("[data-gallery-image]");
  const configImage = document.querySelector("[data-config-image]");

  [heroImage, galleryImage, configImage].forEach((image) => {
    image.classList.remove("is-ready");
    image.src = variant.image;
    image.alt = `${model.name} in ${variant.name}`;
  });

  reserveModel.value = model.name;

  document.querySelectorAll("[data-select-model]").forEach((button) => {
    button.classList.toggle("is-active", Number(button.dataset.selectModel) === selectedModelIndex);
  });

  document.querySelectorAll("[data-select-variant]").forEach((button) => {
    button.classList.toggle("is-active", Number(button.dataset.selectVariant) === selectedVariantIndex);
  });

  document.querySelectorAll(".lineup-card").forEach((card, index) => {
    card.classList.toggle("is-active", index === selectedModelIndex);
  });
}

function setModel(index, preserveVariant = false) {
  selectedModelIndex = index;
  if (!preserveVariant) {
    selectedVariantIndex = 0;
  } else {
    selectedVariantIndex = Math.min(selectedVariantIndex, models[index].variants.length - 1);
  }

  renderModelTabs();
  renderVariants();
  renderLineup();
  updateSelectedVariantImage();
  wireDynamicButtons();
  resetRotation();
}

function setVariant(index) {
  selectedVariantIndex = index;
  updateSelectedVariantImage();
  resetRotation();
}

function openFilm() {
  const model = models[selectedModelIndex];
  filmFrame.src = `${model.film}&autoplay=1`;
  videoModal.hidden = false;
  document.body.classList.add("is-modal-open");
}

function closeFilm() {
  filmFrame.src = "";
  videoModal.hidden = true;
  document.body.classList.remove("is-modal-open");
}

function resetRotation() {
  if (autoRotateTimer) {
    window.clearInterval(autoRotateTimer);
  }
  if (progressTimer) {
    window.clearInterval(progressTimer);
  }

  progressValue = 0;
  rotationBar.style.transform = "scaleX(0)";

  progressTimer = window.setInterval(() => {
    progressValue = Math.min(progressValue + 2, 100);
    rotationBar.style.transform = `scaleX(${progressValue / 100})`;
  }, 100);

  autoRotateTimer = window.setInterval(() => {
    const nextModel = (selectedModelIndex + 1) % models.length;
    setModel(nextModel);
  }, 5000);
}

function wireDynamicButtons() {
  document.querySelectorAll("[data-select-model]").forEach((button) => {
    button.addEventListener("click", () => {
      setModel(Number(button.dataset.selectModel));
    });
  });

  document.querySelectorAll("[data-select-variant]").forEach((button) => {
    button.addEventListener("click", () => {
      setVariant(Number(button.dataset.selectVariant));
    });
  });
}

menuToggle.addEventListener("click", () => {
  nav.classList.toggle("is-open");
  menuToggle.classList.toggle("is-open");
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (event) => {
    const href = anchor.getAttribute("href");
    const target = href ? document.querySelector(href) : null;
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    nav.classList.remove("is-open");
    menuToggle.classList.remove("is-open");
  });
});

stage.addEventListener("pointermove", (event) => {
  const rect = stage.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width - 0.5) * 16;
  const y = ((event.clientY - rect.top) / rect.height - 0.5) * 10;
  stage.style.setProperty("--tilt-x", `${-y}deg`);
  stage.style.setProperty("--tilt-y", `${x}deg`);
});

stage.addEventListener("pointerleave", () => {
  stage.style.setProperty("--tilt-x", "0deg");
  stage.style.setProperty("--tilt-y", "0deg");
});

document.querySelectorAll("[data-open-film]").forEach((button) => {
  button.addEventListener("click", openFilm);
});

document.querySelectorAll("[data-close-film]").forEach((button) => {
  button.addEventListener("click", closeFilm);
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !videoModal.hidden) {
    closeFilm();
  }
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

document.querySelectorAll(".reveal").forEach((item) => observer.observe(item));

document.querySelectorAll("img").forEach((image) => {
  image.addEventListener("load", () => image.classList.add("is-ready"));
});

window.addEventListener("load", () => {
  window.setTimeout(() => loader.classList.add("is-hidden"), 900);
});

reserveForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(reserveForm);
  const rider = data.get("name");
  const machine = data.get("model");
  message.textContent = `Thanks, ${rider}. Your ${machine} request is ready for follow-up.`;
  reserveForm.reset();
  reserveModel.value = models[selectedModelIndex].name;
});

buildReserveOptions();
renderModelTabs();
renderVariants();
renderLineup();
updateSelectedVariantImage();
wireDynamicButtons();
resetRotation();
