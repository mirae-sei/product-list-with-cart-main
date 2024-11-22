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
        throw new Error('NOT OK'); // Handle non-200 responses
      }
      return response.json(); // Parse JSON data
    })
    .then(data => {
      // Add fetched products to the products array
      data.forEach(item => {
        products.push(item);
      });

      // Generate HTML for each product and update the grid container
      products.forEach(product => {
        productsHTML += `
          <div class="product-container">
            <div class="image-and-button">
              <img src="${product.image.desktop}">
              <button class="add-to-cart-button" data-product-id="${product.name}">
                <img src="./assets/images/icon-add-to-cart.svg"> Add to Cart
              </button>
            </div>
            <div class="product-info">
              <p class="product-category">${product.category}</p>
              <h3 class="product-name">${product.name}</h3>
              <h3 class="price">$${product.price.toFixed(2)}</h3>
            </div>
          </div>`;
      });

      gridContainer.innerHTML = productsHTML; // Update container with product HTML
      addToCart(); // Initialize add-to-cart functionality
      
    })
    .catch(error => {
      console.error(error); // Log any errors during fetch
    });
}

// Call the fetch and display function to load products
fetchAndDisplay();

// Function to handle adding items to the cart
function addToCart() {
  // Select all "Add to Cart" buttons
  let addToCartButton = document.querySelectorAll('.add-to-cart-button');

  // Iterate through each button
  addToCartButton.forEach(button => {
    button.addEventListener('click', () => {
      let productId = button.dataset.productId; // Get product ID from button
      let isInCart = false; // Flag to check if product is already in the cart

      // Check if the product already exists in the cart
      cart.forEach(cartItem => {
        if (cartItem.productName === productId) {
          cartItem.quantity += 1; // Increment quantity if product exists
          cartItem.totalPrice = cartItem.quantity*cartItem.price;
          isInCart = true;
        }
      });

      // If the product is not in the cart, add it
      if (!isInCart) {
        
        products.forEach(product => {
          if (productId === product.name) {
            // Create a new cart item
            let newProduct = {
              productName: product.name,
              quantity: 1,
              price: product.price,
              totalPrice: product.price,
            };

            cart.push(newProduct); // Add new product to the cart
           
          
          }
        });
      }

      renderCart(); // Update the cart displayr\
      removeItem();
      renderOrderTotal();
      cartVisibility();

      
     
    });
  });
}

// Function to render the shopping cart
function renderCart() {
  let cartHTML = ''; // Initialize empty HTML for the cart
  
  
  // Generate HTML for each cart item
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
        <button class="remove-item-button" data-product-id="${cartItem.productName}" >
          <img src="./assets/images/icon-remove-item.svg">
        </button>
      </div>`;
      
  
  });

  



  listOfOrder.innerHTML = cartHTML;
  removeItem();

  // TODO: Insert cartHTML into the appropriate container (currently missing container reference)
}


function renderOrderTotal(){
  let orderTotal = 0;
  let orderCount = 0;
  cart.forEach((cartItem)=>{
    orderTotal += cartItem.totalPrice ;
    orderCount += cartItem.quantity ;
  })
  
 
  orderTotalPrice.innerText = `$${orderTotal.toFixed(2)}`
  orderCountHTML.innerText  = `Your Cart(${orderCount})`
  
  return orderCount;
}



renderOrderTotal();
// Render the cart initially (if needed)
renderCart();


function cartVisibility(){
  let isEmpty = renderOrderTotal();

  if(isEmpty === 0){
    document.querySelector('.order-summary').style.display = 'none';
    document.querySelector('.empty-cart').style.display = 'block';
    

  }else{
    document.querySelector('.order-summary').style.display = 'block';
    document.querySelector('.empty-cart').style.display = 'none';
    
  }
  
}




function removeItem(){
  let removeButton = document.querySelectorAll('.remove-item-button');
  
  removeButton.forEach((button)=>{
    button.addEventListener('click' , ()=>{
    
      let tempoCart = [];
      let productId = button.dataset.productId;
      console.log(productId);

     
     cart.forEach((item)=>{
      
      if(item.productName !== productId){
        tempoCart.push(item);
        
      }
      cart = tempoCart;
     })
      renderCart();
      renderOrderTotal();
      cartVisibility();
      

      
     
     
     
     
    })
  })
  
    
}


removeItem();
cartVisibility();

