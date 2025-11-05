// === INITIALIZE AOS ===
AOS.init({
  duration: 1000,
  once: false,
  easing: "ease-in-out",
});

window.addEventListener("load", () => AOS.refresh());

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", () => {
    setTimeout(() => AOS.refreshHard(), 400);
  });
});

// === MAIN SCRIPT ===
document.addEventListener("DOMContentLoaded", () => {
  // === MOBILE MENU TOGGLE ===
  const menuBtn = document.getElementById("menu-btn");
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobile-menu");
  const overlay = document.getElementById("overlay");

  if (menuBtn && hamburger && mobileMenu && overlay) {
    menuBtn.addEventListener("click", () => {
      hamburger.classList.toggle("hamburger-active");
      mobileMenu.classList.toggle("active");
      overlay.classList.toggle("hidden");
    });

    overlay.addEventListener("click", () => {
      hamburger.classList.remove("hamburger-active");
      mobileMenu.classList.remove("active");
      overlay.classList.add("hidden");
    });
  }

  // === VIEW MORE / VIEW LESS ===
  document.querySelectorAll(".toggle-btn").forEach(button => {
    button.addEventListener("click", () => {
      const target = document.getElementById(button.dataset.target);
      if (target) {
        target.classList.toggle("hidden");
        button.textContent = target.classList.contains("hidden")
          ? "View More"
          : "View Less";
      }
    });
  });

  // === GLOBAL CART ===
  window.cart = window.cart || [];

  // === DESKTOP CART ELEMENTS ===
  const cartBtn = document.getElementById("cart-btn");
  const cartOverlay = document.getElementById("cart-overlay");
  const cartDrawer = document.getElementById("cart-drawer");
  const closeCartBtn = document.getElementById("close-cart");
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const cartCount = document.getElementById("cart-count");

  // === MOBILE CART ELEMENTS ===
  const mobileCartBtn = document.getElementById("mobile-cart-btn");
  const mobileCartOverlay = document.getElementById("mobile-cart-overlay");
  const mobileCartDrawer = document.getElementById("mobile-cart-drawer");
  const mobileCartClose = document.getElementById("mobile-cart-close");
  const mobileCartItems = document.getElementById("mobile-cart-items");
  const mobileCartTotal = document.getElementById("mobile-cart-total");
  const mobileCartCount = document.getElementById("mobile-cart-count");

  // === UPDATE DESKTOP CART ===
  function updateCartUI() {
    if (!cartItemsContainer) return;
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
      total += item.price;
      const div = document.createElement("div");
      div.className = "flex justify-between items-center border-b pb-2";
      div.innerHTML = `
        <div>
          <h4 class="font-medium">${item.name}</h4>
          <p class="text-orange-500 font-bold">$${item.price.toFixed(2)}</p>
        </div>
        <button class="text-red-500 hover:underline" data-index="${index}">Remove</button>
      `;
      cartItemsContainer.appendChild(div);
    });

    if (cartTotal) cartTotal.textContent = `$${total.toFixed(2)}`;
    if (cartCount) cartCount.textContent = cart.length;

    cartItemsContainer.querySelectorAll("button").forEach(btn => {
      btn.addEventListener("click", () => {
        const i = btn.dataset.index;
        cart.splice(i, 1);
        updateCartUI();
        updateMobileCartUI();
      });
    });
  }

  // === UPDATE MOBILE CART ===
  function updateMobileCartUI() {
    if (!mobileCartItems) return;
    mobileCartItems.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
      total += item.price;
      const div = document.createElement("div");
      div.className = "flex justify-between items-center border-b pb-2";
      div.innerHTML = `
        <div>
          <h4 class="font-medium">${item.name}</h4>
          <p class="text-orange-500 font-bold">$${item.price.toFixed(2)}</p>
        </div>
        <button class="text-red-500 hover:underline" data-index="${index}">Remove</button>
      `;
      mobileCartItems.appendChild(div);
    });

    if (mobileCartTotal) mobileCartTotal.textContent = `$${total.toFixed(2)}`;
    if (mobileCartCount) mobileCartCount.textContent = cart.length;

    mobileCartItems.querySelectorAll("button").forEach(btn => {
      btn.addEventListener("click", () => {
        const i = btn.dataset.index;
        cart.splice(i, 1);
        updateMobileCartUI();
        updateCartUI();
      });
    });
  }

  // === CART TOGGLES ===
  if (cartBtn && cartOverlay && cartDrawer && closeCartBtn) {
    cartBtn.addEventListener("click", () => {
      cartOverlay.classList.remove("hidden");
      cartDrawer.classList.remove("translate-x-full");
    });
    closeCartBtn.addEventListener("click", () => {
      cartDrawer.classList.add("translate-x-full");
      setTimeout(() => cartOverlay.classList.add("hidden"), 300);
    });
    cartOverlay.addEventListener("click", e => {
      if (e.target === cartOverlay) {
        cartDrawer.classList.add("translate-x-full");
        setTimeout(() => cartOverlay.classList.add("hidden"), 300);
      }
    });
  }

  if (mobileCartBtn && mobileCartOverlay && mobileCartDrawer && mobileCartClose) {
    mobileCartBtn.addEventListener("click", () => {
      mobileCartOverlay.classList.remove("hidden");
      mobileCartDrawer.classList.remove("translate-x-full");
    });
    mobileCartClose.addEventListener("click", () => {
      mobileCartDrawer.classList.add("translate-x-full");
      setTimeout(() => mobileCartOverlay.classList.add("hidden"), 300);
    });
    mobileCartOverlay.addEventListener("click", e => {
      if (e.target === mobileCartOverlay) {
        mobileCartDrawer.classList.add("translate-x-full");
        setTimeout(() => mobileCartOverlay.classList.add("hidden"), 300);
      }
    });
  }

  // === ADD TO CART FROM MENU ITEMS ===
  document.querySelectorAll(".add-to-cart").forEach(button => {
    button.addEventListener("click", () => {
      const itemCard = button.closest(".menu-item");
      if (!itemCard) return;

      const name = itemCard.querySelector("h4").textContent;
      const price = parseFloat(itemCard.querySelector("p").textContent.replace("$", "").trim());

      cart.push({ name, price });
      updateCartUI();
      updateMobileCartUI();
    });
  });

  // === SEARCH FUNCTIONALITY (DESKTOP + MOBILE) ===
  const searchInputs = document.querySelectorAll("#menu-search, #mobile-menu-search");
  const searchResults = document.getElementById("search-results");
  const searchResultsList = document.getElementById("search-results-list");
  const allMenuItems = document.querySelectorAll(".menu-item");

  if (searchInputs.length && searchResults && searchResultsList && allMenuItems) {
    searchInputs.forEach(searchInput => {
      searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase().trim();
        searchResultsList.innerHTML = "";

        if (!query) {
          searchResults.classList.add("hidden");
          return;
        }

        const matches = Array.from(allMenuItems).filter(item =>
          item.querySelector("h4").textContent.toLowerCase().includes(query)
        );

        if (matches.length) {
          matches.forEach(match => {
            const name = match.querySelector("h4").textContent;
            const priceText = match.querySelector("p").textContent;
            const price = parseFloat(priceText.replace("$", "").trim());

            const div = document.createElement("div");
            div.className = "border-b pb-2";
            div.innerHTML = `
              <h4 class="font-medium">${name}</h4>
              <p class="text-orange-500 font-bold">${priceText}</p>
              <button class="bg-orange-500 text-white text-sm px-3 py-1 rounded hover:bg-orange-600 mt-1">
                Add to Cart
              </button>
            `;

            div.querySelector("button").addEventListener("click", () => {
              cart.push({ name, price });
              updateCartUI();
              updateMobileCartUI();

              const btn = div.querySelector("button");
              btn.textContent = "Added!";
              setTimeout(() => (btn.textContent = "Add to Cart"), 1000);
            });

            searchResultsList.appendChild(div);
          });

          searchResults.classList.remove("hidden");
        } else {
          searchResultsList.innerHTML = `<p class="text-gray-500 text-sm">No meals found.</p>`;
          searchResults.classList.remove("hidden");
        }
      });
    });

    document.addEventListener("click", e => {
      if (!searchResults.contains(e.target) && !Array.from(searchInputs).includes(e.target)) {
        searchResults.classList.add("hidden");
      }
    });
  }
});
