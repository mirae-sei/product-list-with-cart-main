let productsHTML;
let products = ['adasd'];

let productContainer = document.querySelector('.flex-box-container');





function fetchAndDisplay(){


fetch('data.json').then(response =>{
  if(!response.ok){
    throw new Error('NOT OK');

  }
  return response.json();
}
 ).then(
  data => {
   data.forEach(item => {
    products.push(item);
    console,log
   });




  products.forEach((product) => {
    productsHTML += `<div class="product-container">
      <div class="image-and-button">
        <img src="${product.image.mobile}">
        <button> Add to Cart</button>
      </div>
      <div class="product-info">
        <p class="product-category">${product.category}</p>
        <h3 class="product-name">${product.name}</h3>
        <h3>$${product.price}</h3>
      </div>
    </div>`;
    

  })
   
  }
 ).catch(error => {
  console.log(error);
 }
 )

 
}


fetchAndDisplay();
console.log(products);




 




 











