const products = [
  {
    id: "red-bench",
    title: "Red Bench",
    price: 3.89,
    category: "People",
    image: "./Assets/2.jpg",
  },
  {
    id: "egg-balloon-1",
    title: "Egg Balloon",
    price: 93.89,
    category: "Food",
    image: "./Assets/5.jpg",
  },
  {
    id: "egg-balloon-2",
    title: "Egg Balloon",
    price: 93.89,
    category: "Food",
    image: "./Assets/6.jpg",
  },
  {
    id: "man",
    title: "Man",
    price: 100.0,
    category: "People",
    image: "./Assets/7.png",
  },
  {
    id: "architecture-1",
    title: "Architecture",
    price: 101.0,
    category: "Landmarks",
    image: "./Assets/3.jpg",
  },
  {
    id: "architecture-2",
    title: "Architecture",
    price: 101.0,
    category: "Landmarks",
    image: "./Assets/3.jpg",
  },
  {
    id: "samurai-king",
    title: "Samurai King Resting",
    price: 100.0,
    category: "Premium",
    image: "./Assets/samuraiking.jpg",
  },
];

let cart = [];
let filteredProducts = [...products];
let currentPage = 1;
const productsPerPage = 6;

// Initialize the page
function init() {
  renderProducts();
  updateCartCount();
}

// Render products
function renderProducts() {
  const grid = document.getElementById("productsGrid");
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const pageProducts = filteredProducts.slice(startIndex, endIndex);

  grid.innerHTML = pageProducts
    .map(
      (product) => `
                <div class="product-card">
                    <div style="position: relative;">
                       <img src="${product.image}" alt="${
        product.title
      }" class="product-image" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 200 180\\'%3E%3Crect width=\\'200\\' height=\\'400\\' fill=\\'%23ddd\\'/%3E%3Ctext x=\\'100\\' y=\\'90\\' text-anchor=\\'middle\\' font-family=\\'Arial\\' font-size=\\'12\\' fill=\\'%23666\\'%3E${
        product.title
      }%3C/text%3E%3C/svg%3E'">
                        <button class="product-add-btn" onclick="addToCart('${
                          product.id
                        }', '${product.title}', ${product.price}, '${
        product.category
      }')">ADD TO CART</button>
                    </div>
                    <div class="product-info">
                        <div class="product-category">${product.category}</div>
                        <div class="product-title">${product.title}</div>
                        <div class="product-price">$${product.price.toFixed(
                          2
                        )}</div>
                    </div>
                </div>
            `
    )
    .join("");
}

// Add to cart
function addToCart(id, title, price, category) {
  const existingItem = cart.find((item) => item.id === id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    // Find the original product to get its image
    const originalProduct = products.find((product) => product.id === id);
    cart.push({
      id,
      title,
      price,
      category,
      quantity: 1,
      image: originalProduct.image, // Add this line
    });
  }
  updateCartCount();
  updateCartDisplay();
}

// Update cart count
function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById("cartCount").textContent = count;
}

// Toggle cart modal
function toggleCart() {
  const modal = document.getElementById("cartModal");
  modal.style.display = modal.style.display === "block" ? "none" : "block";
  updateCartDisplay();
}

// Update cart display
function updateCartDisplay() {
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");

  if (cart.length === 0) {
    cartItems.innerHTML = "<p>Your cart is empty</p>";
    cartTotal.innerHTML = "";
    return;
  }

  cartItems.innerHTML = cart
    .map(
      (item) => `
  <div class="cart-item">
    <div class="cart-item-info">
      <div class="cart-item-title">${item.title}</div>
      <div class="cart-item-price">$${item.price.toFixed(2)} × ${
        item.quantity
      }</div>
    </div>
     <img src="${item.image}" alt="${
        item.title
      }" class="cart-item-image" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 60 60\\'%3E%3Crect width=\\'60\\' height=\\'60\\' fill=\\'%23ddd\\'/%3E%3Ctext x=\\'30\\' y=\\'35\\' text-anchor=\\'middle\\' font-family=\\'Arial\\' font-size=\\'8\\' fill=\\'%23666\\'%3E${
        item.title
      }%3C/text%3E%3C/svg%3E'">
  </div>
`
    )
    .join("");

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartTotal.innerHTML = `Total: $${total.toFixed(2)}`;
}

// Apply filters
function applyFilters() {
  const checkedCategories = [];
  const checkboxes = document.querySelectorAll(
    '.filter-option input[type="checkbox"]'
  );

  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      const label = checkbox.nextElementSibling.textContent;
      checkedCategories.push(label);
    }
  });

  if (checkedCategories.length === 0) {
    filteredProducts = [...products];
  } else {
    filteredProducts = products.filter((product) =>
      checkedCategories.includes(product.category)
    );
  }

  currentPage = 1;
  renderProducts();
}

// Apply price filters
function applyPriceFilters() {
  const priceRanges = [];

  if (document.getElementById('price-lower-20').checked) {
    priceRanges.push([0, 20]);
  }
  if (document.getElementById('price-20-100').checked) {
    priceRanges.push([20, 100]);
  }
  if (document.getElementById('price-100-200').checked) {
    priceRanges.push([100, 200]);
  }
  if (document.getElementById('price-more-200').checked) {
    priceRanges.push([200, Infinity]);
  }

  if (priceRanges.length === 0) {
    applyFilters();
    return;
  }

  const checkedCategories = [];
  const checkboxes = document.querySelectorAll('.filter-option input[type="checkbox"]');

  checkboxes.forEach(checkbox => {
    if (checkbox.checked) {
      const label = checkbox.nextElementSibling.textContent;
      checkedCategories.push(label);
    }
  });

  let filtered = [...products];

  if (checkedCategories.length > 0) {
    filtered = filtered.filter(product =>
      checkedCategories.includes(product.category)
    );
  }

  filtered = filtered.filter(product => {
    return priceRanges.some(range =>
      product.price >= range[0] && product.price < range[1]
    );
  });

  filteredProducts = filtered;
  currentPage = 1;
  renderProducts();
}

// Sort products
function sortProducts(sortType) {
  switch (sortType) {
    case 'price-asc':
      filteredProducts.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      filteredProducts.sort((a, b) => b.price - a.price);
      break;
    case 'name':
      filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
      break;
  }
  renderProducts();
}

// Change page
function changePage(direction) {
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const newPage = currentPage + direction;

  if (newPage >= 1 && newPage <= totalPages) {
    currentPage = newPage;
    renderProducts();
  }
}

// Clear entire cart
function clearCart() {
  cart = [];
  updateCartCount();
  updateCartDisplay();
}

function openMobileFilters() {
  const modal = document.getElementById('mobileFilterModal');
  const container = document.getElementById('mobile-filters-container');
  const desktopFilters = document.querySelector('.category-filters');
  
  // Move existing filters to mobile modal
  container.appendChild(desktopFilters.cloneNode(true));
  modal.style.display = 'block';
}

function closeMobileFilters() {
  const modal = document.getElementById('mobileFilterModal');
  modal.style.display = 'none';
}

function clearAllFilters() {
  const allInputs = document.querySelectorAll('input[type="checkbox"]');
  allInputs.forEach(input => input.checked = false);
  filteredProducts = [...products];
  currentPage = 1;
  renderProducts();
}