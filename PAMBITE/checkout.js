// Handle form submission
document.getElementById("checkout-form").addEventListener("submit", (e) => {
  e.preventDefault();
  alert("✅ Order placed successfully!");
  localStorage.removeItem("cart");
  window.location.href = "index.html"; // redirect to homepage
});