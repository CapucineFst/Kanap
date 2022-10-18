/**  
 * Extract the id of the product from the URL 
 */
function getProductId() {
  const url = new URL(window.location.href);
  const urlParams = new URLSearchParams(url.search);
  const productId = urlParams.get("id");
  return productId;
}

/** 
 * Fetch the produt with the id found in the function getProductId
 * Run the function dataTreatment when a product is selected
*/
function productFetch() {
  const productId = getProductId();
  fetch(`http://localhost:3000/api/products/${productId}`)
      .then((response) => response.json())
        .then(function (data) {
            const selectedProduct = data;
            if (selectedProduct) {
                dataTreatment(selectedProduct);
            }
        })
    }
productFetch();

// Variable we need for the following functions
const productPicture = document.querySelector(".item__img");
const productTitle = document.getElementById("title");
const productPrice = document.getElementById("price");
const productDescription = document.getElementById("description");
const productColor = document.getElementById("colors");
const productQuantity = document.getElementById("quantity");

/**
 *Create an element image and put the picture of the product in it
 * Add product name, price and description
 * Create an element option and put the available colors in it
 * @param {*} selectedProduct 
 */
function dataTreatment(selectedProduct) {

          const productPicture = document.createElement("img");
          document.querySelector(".item__img").appendChild(productPicture);
          productPicture.src = selectedProduct.imageUrl;
          productPicture.alt = selectedProduct.altTxt;

          productTitle.textContent = selectedProduct.name;
          productPrice.textContent = selectedProduct.price;
          productDescription.textContent = selectedProduct.description;

          for (i = 0; i < selectedProduct.colors.length; i++) {
              const productColor = document.createElement("option");
              document.querySelector("#colors").appendChild(productColor);
              productColor.textContent = selectedProduct.colors[i];
          }
          addToCart(selectedProduct);

      }
/** 
 * Give the "Ajouter au panier" button a role
* Make sure the quantity is between 1 and 100
* Assign the values of the product in the cart
* In case the product is already in the cart (using the id and the color) we add the quantity but make sure the customers can't put more than a 100 copies in the cart (50 products x3 for example)
* If the product is not in the cart, we simply add it to the existing cart
* If the cart was empty, we create it and add the product
*/
function addToCart() {
  document.getElementById("addToCart").addEventListener("click", () => {
      if ( productQuantity.value > 0 && productQuantity.value <= 100) {
          let choosenQuantity = productQuantity.value;
          let choosenColor = productColor.value;
    
          let product = {
              id: getProductId(),
              colors: choosenColor,
              quantity: choosenQuantity,
              name: productTitle.textContent,
              price: productPrice.textContent,
              image: productPicture.src,
          };

          let products = JSON.parse(localStorage.getItem("cart"));

          if (products) {
              const isProductInCart = products.find(
                  (productAlreadyInCart) =>
                  productAlreadyInCart.id === product.id &&
                  productAlreadyInCart.colors === product.colors
              );
              if (isProductInCart) {
                  let newQuantityInNumber =
                      parseInt(isProductInCart.quantity) + parseInt(product.quantity);
                      newQuantity = newQuantityInNumber.toString();

                  if (newQuantity <= 100) {
                      isProductInCart.quantity = newQuantity;
                      localStorage.setItem("cart", JSON.stringify(products));
                      goToCartPage();
                  } else {
                      window.alert("Vous ne pouvez pas acheter plus de 100 exemplaires")
                  }

              } else {
                  products.push(product);
                  localStorage.setItem("cart", JSON.stringify(products));
                  goToCartPage();
              }
          } else {
              products=[];
              products.push(product);
              localStorage.setItem("cart", JSON.stringify(products));
              goToCartPage();
          }
      } else {
          window.alert("Le nombre d'articles doit être compris entre 0 et 100.")
      }
  });
}

/** 
 * Display an alert window to inform the customer the product has been added to the cart
* Customer can click "ok" if they want to go to their cart
*/
function goToCartPage() {
  if (
      window.confirm(
          "Votre produit a été ajouté au panier avec succès. Pour le consulter, cliquez sur OK."
      )
  ) {
      window.location.href = "cart.html";
  }
}
