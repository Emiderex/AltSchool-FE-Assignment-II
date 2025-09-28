 // Sample product data
    const products = [
      { id: 'red-bench', title: 'Red Bench', price: 3.89, category: 'People', image: 'red-bench' },
      { id: 'egg-balloon-1', title: 'Egg Balloon', price: 93.89, category: 'Food', image: 'egg-balloon' },
      { id: 'egg-balloon-2', title: 'Egg Balloon', price: 93.89, category: 'Food', image: 'egg-balloon' },
      { id: 'man', title: 'Man', price: 100.00, category: 'People', image: 'man' },
      { id: 'architecture-1', title: 'Architecture', price: 101.00, category: 'Landmarks', image: 'architecture' },
      { id: 'architecture-2', title: 'Architecture', price: 101.00, category: 'Landmarks', image: 'architecture' }
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
      const grid = document.getElementById('productsGrid');
      const startIndex = (currentPage - 1) * productsPerPage;
      const endIndex = startIndex + productsPerPage;
      const pageProducts = filteredProducts.slice(startIndex, endIndex);

      grid.innerHTML = pageProducts.map(product => `
                <div class="product-card">
                    <div style="position: relative;">
                        <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 180'%3E%3Crect width='200' height='180' fill='%23ddd'/%3E%3Ctext x='100' y='90' text-anchor='middle' font-family='Arial' font-size='12' fill='%23666'%3E${product.title}%3C/text%3E%3C/svg%3E" alt="${product.title}" class="product-image">
                        <button class="product-add-btn" onclick="addToCart('${product.id}', '${product.title}', ${product.price}, '${product.category}')">ADD TO CART</button>
                    </div>
                    <div class="product-info">
                        <div class="product-category">${product.category}</div>
                        <div class="product-title">${product.title}</div>
                        <div class="product-price">${product.price.toFixed(2)}</div>
                    </div>
                </div>
            `).join('');
    }

    // Add to cart
    function addToCart(id, title, price, category) {
      const existingItem = cart.find(item => item.id === id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({ id, title, price, category, quantity: 1 });
      }
      updateCartCount();
      updateCartDisplay();
    }

    // Update cart count
    function updateCartCount() {
      const count = cart.reduce((sum, item) => sum + item.quantity, 0);
      document.getElementById('cartCount').textContent = count;
    }

    // Toggle cart modal
    function toggleCart() {
      const modal = document.getElementById('cartModal');
      modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
      updateCartDisplay();
    }

    // Update cart display
    function updateCartDisplay() {
      const cartItems = document.getElementById('cartItems');
      const cartTotal = document.getElementById('cartTotal');

      if (cart.length === 0) {
        cartItems.innerHTML = '<p>Your cart is empty</p>';
        cartTotal.innerHTML = '';
        return;
      }

      cartItems.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 60'%3E%3Crect width='60' height='60' fill='%23ddd'/%3E%3Ctext x='30' y='35' text-anchor='middle' font-family='Arial' font-size='8' fill='%23666'%3E${item.title}%3C/text%3E%3C/svg%3E" alt="${item.title}" class="cart-item-image">
                    <div class="cart-item-info">
                        <div class="cart-item-title">${item.title}</div>
                        <div class="cart-item-price">$${item.price.toFixed(2)} × ${item.quantity}</div>
                    </div>
                </div>
            `).join('');

      const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      cartTotal.innerHTML = `Total: $${total.toFixed(2)}`;
    }

    // Apply filters
    function applyFilters() {
      const checkedCategories = [];
      const checkboxes = document.querySelectorAll('.filter-option input[type="checkbox"]');

      checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
          const label = checkbox.nextElementSibling.textContent;
          checkedCategories.push(label);
        }
      });

      if (checkedCategories.length === 0) {
        filteredProducts = [...products];
      } else {
        filteredProducts = products.filter(product =>
          checkedCategories.includes(product.category)
        );
      }

      currentPage = 1;
      renderProducts();
    }

    // Apply price filters - FIXED TO WORK WITH DEFAULT SHOWING
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

      // If no price ranges selected, show all products (apply category filters only)
      if (priceRanges.length === 0) {
        applyFilters();
        return;
      }

      // Apply both category and price filters
      const checkedCategories = [];
      const checkboxes = document.querySelectorAll('.filter-option input[type="checkbox"]');

      checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
          const label = checkbox.nextElementSibling.textContent;
          checkedCategories.push(label);
        }
      });

      let filtered = [...products];

      // Filter by category if any selected
      if (checkedCategories.length > 0) {
        filtered = filtered.filter(product =>
          checkedCategories.includes(product.category)
        );
      }

      // Filter by price ranges
      filtered = filtered.filter(product => {
        return priceRanges.some(range =>
          product.price >= range[0] && product.price < range[1]
        );
      });

      filteredProducts = filtered;
      currentPage = 1;
      renderProducts();
    }

    // Clear entire cart
    function clearCart() {
      cart = [];
      updateCartCount();
      updateCartDisplay();
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

    // Initialize the page when loaded
    init();