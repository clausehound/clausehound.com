(() => {
  const el = document.createElement("header");
  el.id = "masthead";
  el.className = "site-header";
  el.setAttribute("role", "banner");

  el.innerHTML = `
  <div class="navbar navbar-main sticky-navigation navbar-fixed-top">
    <div class="container container-header">
      <div class="header-inner">
        <div class="header-inner-site-branding">
          <div class="site-branding">
            <a href="/" title="Cobalt AI">
              <img src="./images/cobaltAI.png" alt="" />
            </a>
          </div>
          <div class="menu-toggle-button-wrap">
            <button class="menu-toggle" aria-controls="primary-menu" aria-expanded="false">

            </button>
          </div>
        </div>
        <div class="main-navigation-wrap">
          <nav id="site-navigation" class="main-navigation" role="navigation">
            <div class="menu-top-main-container">
              <ul id="primary-menu" class="menu">

              </ul>
            </div>
          </nav>
        </div>
      </div>
    </div>
  </div>`;

  const primary = el.querySelector("#primary-menu");
  const toggle = el.querySelector(".menu-toggle");
  if (primary == null || toggle == null) {
    throw new Error("Failed to build menu controls");
  }

  window.addEventListener("keydown", e => {
    if (e.key == "Escape") primary.classList.remove("open");
  });
  document.addEventListener("click", e => {
    if (!el.contains(e.target)) {
      primary.classList.remove("open");
    }
  });
  toggle.addEventListener("click", () => primary.classList.toggle("open"));

  document.currentScript.parentNode.insertBefore(el, document.currentScript);
})();
