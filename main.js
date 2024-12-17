// Variables to hold product HTML, product list, and shopping cart
let productsHTML = '';
let products = [];
let cart = [];

// Container for displaying products
let gridContainer = document.querySelector('.flex-box-container');
let listOfOrder = document.querySelector('.order-list');
let orderTotalPrice = document.querySelector('.order-total-price');
let orderCountHTML = document.querySelector('.order-count');
let orderSummary = document.querySelector('.order-summary');

// Function to fetch product data and display products
function fetchAndDisplay() {
  fetch('data.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('NOT OK');
      }
      return response.json();
    })
    .then(data => {
      // Add fetched products to the products array
      data.forEach(item => {
        products.push(item);
      });

      // Generate HTML for each product and update the grid container
      products.forEach(product => {
        productsHTML += `
          <div class="product-container" data-product-id="${product.name}">
            <div class="image-and-button">
              <img src="${product.image.desktop}">
               <div class="add-to-cart-button-container">
                <button class="add-to-cart-button">
                  <img src="./assets/images/icon-add-to-cart.svg"> 
                  <p>Add to Cart</p>
                </button>
              </div>
              <div class="add-and-minus-button" style="display: none;">
                <button class="minusButton" data-product-id="${product.name}"><img src = "./assets/images/icon-decrement-quantity.svg"></button>
                <span class="itemQuantity" data-product-id="${product.name}">1</span>
                <button class="addButton" data-product-id="${product.name}"><img src = "./assets/images/icon-increment-quantity.svg"></button>
              </div>
            </div>
            <div class="product-info">
              <p class="product-category">${product.category}</p>
              <h3 class="product-name">${product.name}</h3>
              <h3 class="price">$${product.price.toFixed(2)}</h3>
            </div>
          </div>`;
      });

      gridContainer.innerHTML = productsHTML;
      addToCart();
      incrementDecrementButtons();
    })
    .catch(error => {
      console.error(error);
    });
}

// Call the fetch and display function to load products
fetchAndDisplay();

// Function to handle adding items to the cart
function addToCart() {
  let addToCartButtons = document.querySelectorAll('.add-to-cart-button-container');

  addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
      let productId = button.closest('.product-container').dataset.productId; // Get product ID from parent element
      let isInCart = false;

      // Check if the product already exists in the cart
      cart.forEach(cartItem => {
        if (cartItem.productName === productId) {
          cartItem.quantity++; // Increment quantity if product exists
          cartItem.totalPrice = cartItem.quantity * cartItem.price;
          isInCart = true;
        }
      });

      // If the product is not in the cart, add it
      if (!isInCart) {
        products.forEach(product => {
          if (productId === product.name) {
            let newProduct = {
              images: product.image,
              productName: product.name,
              quantity: 1,
              price: product.price,
              totalPrice: product.price,
            };

            cart.push(newProduct);

            cart.forEach((cartItem) => {
              const productContainer = button.closest('.product-container');
              productContainer.querySelector('.itemQuantity').innerText = cartItem.quantity;
            });

            // Hide "Add to Cart" and show "Add" and "Minus" buttons for this product
            const productContainer = button.closest('.product-container');
            productContainer.querySelector('.add-to-cart-button-container').style.display = 'none';
            productContainer.querySelector('.add-and-minus-button').style.display = 'flex';

            isInCart = true;
          }
        });
      }

      renderCart();
      renderOrderTotal();
      cartVisibility();
    });
  });
}

// Function to render the shopping cart
function renderCart() {
  let cartHTML = '';
  cart.forEach(cartItem => {
    cartHTML += `
      <div class="product-order">
        <div class="order-details">
          <p>${cartItem.productName}</p>
          <div class="order-numbers">
            <p>${cartItem.quantity}x</p>
            <p>@ $${(cartItem.price).toFixed(2)}</p>
            <p>$${(cartItem.totalPrice).toFixed(2)}</p>
          </div>
        </div>
        <button class="remove-item-button" data-product-id="${cartItem.productName}">
          <img src="./assets/images/icon-remove-item.svg">
        </button>
      </div>`;
  });

  listOfOrder.innerHTML = cartHTML;
  removeItem();
}

// Function to render the total order value
function renderOrderTotal() {
  let orderTotal = 0;
  let orderCount = 0;

  cart.forEach(cartItem => {
    orderTotal += cartItem.totalPrice;
    orderCount += cartItem.quantity;
  });

  orderTotalPrice.innerText = `$${orderTotal.toFixed(2)}`;
  orderCountHTML.innerText = `Your Cart(${orderCount})`;

  return orderTotal;
}

// Function to toggle visibility of empty cart message or order summary
function cartVisibility() {
  let isEmpty = renderOrderTotal();

  if (isEmpty === 0) {
    document.querySelector('.order-summary').style.display = 'none';
    document.querySelector('.empty-cart').style.display = 'block';
  } else {
    document.querySelector('.order-summary').style.display = 'block';
    document.querySelector('.empty-cart').style.display = 'none';
  }
}

// Function to remove an item from the cart
function removeItem() {
  let removeButton = document.querySelectorAll('.remove-item-button');

  removeButton.forEach(button => {
    button.addEventListener('click', () => {
      let productId = button.dataset.productId;

      // Remove item from the cart
      cart = cart.filter(item => item.productName !== productId);

      // After removal, check if the product's quantity is 0, then show the "Add to Cart" button again
      let productContainer = document.querySelector(`.product-container[data-product-id="${productId}"]`);
      if (cart.every(item => item.productName !== productId)) {
        productContainer.querySelector('.add-to-cart-button-container').style.display = 'flex';
        productContainer.querySelector('.add-and-minus-button').style.display = 'none';
      }

      renderCart();
      renderOrderTotal();
      cartVisibility();
    });
  });
}

// Function to display modal
function displayModal() {
  let modalHTML = ``;
  let confirmOrder = document.querySelector('.confirm-order-button');
  
  confirmOrder.addEventListener('click' , ()=> {
    
    document.getElementById('overlay').style.display = 'block';
    document.querySelector('.modal').style.display = 'block';
    document.querySelector('.body').style.pointerEvents = 'none';

    cart.forEach(item => {
      modalHTML  += `
      <div class="item-modal-order">
            <img src="${item.images.thumbnail}" alt="Product Thumbnail">
            <div class="product-details">
              <div class="order-details">
                <p class="order-name">${item.productName}</p>
                <div class="inner-order-details">
                  <p>${item.quantity}x</p>
                  <p class="initial-price">@${item.price.toFixed(2)}</p>
                </div>
              </div>
              <p class="product-price">$${item.totalPrice.toFixed(2)}</p>
            </div>
          </div>`;
    });

    document.querySelector('.modal-order').innerHTML = modalHTML;
    
    renderModalTotalOrder();
    
    hideModal();
    
  });
}

function renderModalTotalOrder() {
  let confirmOrder = document.querySelector('.confirm-order-button');
  
  document.querySelector('.modal-order').innerHTML += `
    <div class="modal-order-total">
            <p>Order Total</p>
            <H2>$${renderOrderTotal().toFixed(2)}</H2>
          </div>`;
}

function hideModal() {
  document.querySelector('.overlay').addEventListener('dblclick', ()=> {
    document.getElementById('overlay').style.display = 'none';
    document.querySelector('.modal').style.display = 'none';
    document.querySelector('.body').style.pointerEvents = 'auto';

    // Clear the cart
    cart.splice(0 , cart.length);

    // Reset all buttons to "Add to Cart"
    resetProductButtons();

    renderCart();
    renderOrderTotal();
    cartVisibility();
    displayModal();
  });

  document.querySelector('.new-order').addEventListener('click' , ()=> {
    document.getElementById('overlay').style.display = 'none';
    document.querySelector('.modal').style.display = 'none';
    document.querySelector('.body').style.pointerEvents = 'auto';

    // Clear the cart
    cart.splice(0 , cart.length);

    // Reset all buttons to "Add to Cart"
    resetProductButtons();

    renderCart();
    renderOrderTotal();
    cartVisibility();
    displayModal();
    
  });
}

// Function to reset all product buttons back to "Add to Cart" state
function resetProductButtons() {
  let productContainers = document.querySelectorAll('.product-container');

  productContainers.forEach(container => {
    // Show "Add to Cart" button again and hide "Add/Minus" buttons
    container.querySelector('.add-to-cart-button-container').style.display = 'flex';
    container.querySelector('.add-and-minus-button').style.display = 'none';
  });
}

// Function to increment or decrement quantity
function incrementDecrementButtons() {
  let addButtons = document.querySelectorAll('.addButton');
  let minusButtons = document.querySelectorAll('.minusButton');
  let itemQuantities = document.querySelectorAll('.itemQuantity');

  addButtons.forEach((addBtn) => {
    addBtn.addEventListener('click', () => {
      let productName = addBtn.dataset.productId;
      cart.forEach(cartItem => {
        if (cartItem.productName === productName) {
          cartItem.quantity++;
          cartItem.totalPrice = cartItem.quantity * cartItem.price;

          itemQuantities.forEach((productQuantity) => {
            let itemQuantityProductId = productQuantity.dataset.productId;
            if (cartItem.productName === itemQuantityProductId) {
              productQuantity.innerText = cartItem.quantity;
            }
          });
        }
      });
      renderCart();
    });
  });

  minusButtons.forEach((minusBtn) => {
    minusBtn.addEventListener('click', () => {
      let productName = minusBtn.dataset.productId;
      cart.forEach(cartItem => {
        if (cartItem.productName === productName && cartItem.quantity > 0) {
          cartItem.quantity--; // Decrease quantity
          cartItem.totalPrice = cartItem.quantity * cartItem.price;

          itemQuantities.forEach((productQuantity) => {
            let itemQuantityProductId = productQuantity.dataset.productId;
            if (cartItem.productName === itemQuantityProductId) {
              productQuantity.innerText = cartItem.quantity;
            }
          });

          // If the quantity becomes 0, remove the product from the cart
          if (cartItem.quantity === 0) {
            cart = cart.filter(item => item.productName !== productName); // Remove product
            let productContainer = document.querySelector(`.product-container[data-product-id="${productName}"]`);
            productContainer.querySelector('.add-to-cart-button-container').style.display = 'flex';
            productContainer.querySelector('.add-and-minus-button').style.display = 'none';
          }
        }
      });
      renderCart();
      renderOrderTotal();
      cartVisibility();
      displayModal();
      hideModal();
    });
  });
}

// Initialize the event listeners
incrementDecrementButtons();
renderCart();
cartVisibility();
displayModal();
