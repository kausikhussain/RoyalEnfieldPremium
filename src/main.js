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
  </div>
`;

const loader = document.querySelector("[data-loader]");
window.addEventListener("load", () => {
  window.setTimeout(() => loader.classList.add("is-hidden"), 900);
});
