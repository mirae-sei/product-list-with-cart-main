let productsHTML = '';
let products = [];

let productContainer = document.querySelector('.flex-box-container');

function fetchAndDisplay() {
  fetch('data.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('NOT OK');
      }
      return response.json();
    })
    .then(data => {
      data.forEach(item => {
        products.push(item);
      
      });
      console.log(products);
      products.forEach((product) => {
        productsHTML += `<div class="product-container">
          <div class="image-and-button">
            <img src="${product.image.desktop}">
            <button> 
              <img src="./assets/images/icon-add-to-cart.svg"> Add to Cart
            </button>
          </div>
          <div class="product-info">
            <p class="product-category">${product.category}</p>
            <h3 class="product-name">${product.name}</h3>
            <h3 class="price">$${product.price.toFixed(2)}</h3>
          </div>
        </div>`;
      
        productContainer.innerHTML = productsHTML;
      });
      
      
      console.log(productsHTML);
    })
    .catch(error => {
      console.log(error);
    });
}

fetchAndDisplay();
