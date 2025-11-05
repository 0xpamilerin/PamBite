window.addEventListener("load", () => {
  // Wait until everything (HTML, CSS, and scripts) is loaded
  const mobileCartBtns = document.querySelectorAll(".mobile-cart-btn");
  const mobileCartOverlay = document.getElementById("mobile-cart-overlay");
  const mobileCart = document.getElementById("mobile-cart");
  const closeMobileCart = document.getElementById("close-mobile-cart");
  const mobileCartItems = document.getElementById("mobile-cart-items");
  const mobileCartTotal = document.getElementById("mobile-cart-total");
  const checkoutBtn = document.getElementById("checkout-btn"); // ✅ Checkout button

  // Recheck every 1 second until elements are available
  if (!mobileCart || !mobileCartOverlay || !mobileCartItems) {
    console.warn("Mobile cart elements not found — retrying...");
    setTimeout(() => window.dispatchEvent(new Event("load")), 1000);
    return;
  }

  // Ensure global cart exists
  if (typeof window.cart === "undefined") window.cart = [];

  // === FUNCTION TO UPDATE MOBILE CART UI ===
  function updateMobileCartUI() {
    mobileCartItems.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
      mobileCartItems.innerHTML = `<p class="text-gray-500 text-center">Your cart is empty.</p>`;
    } else {
      cart.forEach((item, index) => {
        total += item.price;
        const div = document.createElement("div");
        div.classList.add("flex", "justify-between", "items-center", "border-b", "pb-2");
        div.innerHTML = `
          <div>
            <h4 class="font-medium">${item.name}</h4>
            <p class="text-orange-500 font-bold">$${item.price.toFixed(2)}</p>
          </div>
          <button class="text-red-500 hover:underline text-sm" data-index="${index}">
            Remove
          </button>
        `;
        mobileCartItems.appendChild(div);
      });

      // Remove items
      mobileCartItems.querySelectorAll("button").forEach(btn => {
        btn.addEventListener("click", () => {
          const i = btn.getAttribute("data-index");
          cart.splice(i, 1);
          updateMobileCartUI();
          if (typeof updateCartUI === "function") updateCartUI(); // sync desktop cart
        });
      });
    }

    mobileCartTotal.textContent = `$${total.toFixed(2)}`;
  }

  // ✅ Expose this function globally so other scripts (like Add to Cart) can call it
  window.updateMobileCartUI = updateMobileCartUI;

  // === OPEN MOBILE CART ===
  mobileCartBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      updateMobileCartUI();
      mobileCartOverlay.classList.remove("hidden");
      mobileCart.classList.remove("translate-y-full");

      // ✅ Close sidebar if open
      const mobileMenu = document.getElementById("mobile-menu");
      if (mobileMenu && mobileMenu.classList.contains("active")) {
        mobileMenu.classList.remove("active");
      }
    });
  });

  // === CLOSE MOBILE CART ===
  closeMobileCart.addEventListener("click", () => {
    mobileCart.classList.add("translate-y-full");
    setTimeout(() => mobileCartOverlay.classList.add("hidden"), 300);
  });

  // === CLOSE WHEN CLICKING OUTSIDE ===
  mobileCartOverlay.addEventListener("click", e => {
    if (e.target === mobileCartOverlay) {
      mobileCart.classList.add("translate-y-full");
      setTimeout(() => mobileCartOverlay.classList.add("hidden"), 300);
    }
  });

  // ✅ HANDLE CHECKOUT BUTTON CLICK
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      // Save cart to localStorage
      localStorage.setItem("cart", JSON.stringify(cart));

      // Redirect to your checkout page
      window.location.href = "checkout.html"; // change if your filename differs
    });
  }

  console.log("✅ Mobile cart ready");
});
