// Assignment 2 - Simple retail store cart logic (plain JavaScript)

var products = [
  { id: 1, name: "Wireless Mouse", price: 3500, emoji: "\uD83D\uDDB1\uFE0F" },
  { id: 2, name: "USB Flash Drive 32GB", price: 4500, emoji: "\uD83D\uDCBE" },
  { id: 3, name: "Bluetooth Headset", price: 12000, emoji: "\uD83C\uDFA7" },
  { id: 4, name: "Phone Charger Cable", price: 2000, emoji: "\uD83D\uDD0C" },
  { id: 5, name: "Notebook (A5)", price: 800, emoji: "\uD83D\uDCD3" },
  { id: 6, name: "Ball Point Pen (Pack)", price: 500, emoji: "\uD83D\uDD8A\uFE0F" }
];

var cart = [];

function formatNaira(amount) {
  return "\u20A6" + amount.toLocaleString();
}

function renderProducts() {
  var grid = document.getElementById("productGrid");
  grid.innerHTML = "";
  products.forEach(function (p) {
    var card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML =
      "<div class='emoji'>" + p.emoji + "</div>" +
      "<h3>" + p.name + "</h3>" +
      "<div class='price'>" + formatNaira(p.price) + "</div>" +
      "<button onclick='addToCart(" + p.id + ")'>Add to Cart</button>";
    grid.appendChild(card);
  });
}

function addToCart(id) {
  var product = products.find(function (p) { return p.id === id; });
  var existing = cart.find(function (item) { return item.id === id; });
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id: product.id, name: product.name, price: product.price, qty: 1 });
  }
  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter(function (item) { return item.id !== id; });
  renderCart();
}

function renderCart() {
  var list = document.getElementById("cartItems");
  list.innerHTML = "";
  var total = 0;

  if (cart.length === 0) {
    list.innerHTML = "<li style='justify-content:center;color:#888;'>Cart is empty</li>";
  }

  cart.forEach(function (item) {
    var subtotal = item.price * item.qty;
    total += subtotal;
    var li = document.createElement("li");
    li.innerHTML =
      "<span>" + item.name + " x" + item.qty + "</span>" +
      "<span>" + formatNaira(subtotal) + " <button onclick='removeFromCart(" + item.id + ")'>&times;</button></span>";
    list.appendChild(li);
  });

  document.getElementById("cartTotal").textContent = formatNaira(total);
}

function checkout() {
  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }
  alert("Thank you for your order! (This is a demo checkout - no real payment is taken.)");
  cart = [];
  renderCart();
}

document.addEventListener("DOMContentLoaded", function () {
  renderProducts();
  renderCart();
  document.getElementById("checkoutBtn").addEventListener("click", checkout);
});
