import "./style.css";

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
