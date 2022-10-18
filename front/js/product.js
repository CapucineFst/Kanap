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
 * Create an element image and put the picture of the product in it
* Add product name, price and description
* Create an element option and put the available colors in it
*/
function productFetch() {
  const productId = getProductId();
  fetch(`http://localhost:3000/api/products/${productId}`)
      .then((response) => response.json())
      .then((data) => {
          const productPicture = document.createElement("img");
          document.querySelector(".item__img").appendChild(productPicture);
          productPicture.src = data.imageUrl;
          productPicture.alt = data.altTxt;

          document.getElementById("title").textContent = data.name;
          document.getElementById("price").textContent = data.price;
          document.getElementById("description").textContent = data.description;

          for (i = 0; i < data.colors.length; i++) {
              const productColor = document.createElement("option");
              document.querySelector("#colors").appendChild(productColor);
              productColor.textContent = data.colors[i];
          }

      })
}
productFetch();

/** 
 * Give the "Ajouter au panier" button a role
* Make sure the quantity is between 1 and 100
* Assign the values of the product in the cart
* In case the product is already in the cart (using the id and the color) we add the quantity but make sure the customers can't put more than a 100 copies in the cart (50 products x3 for example)
* If the product is not in the cart, we simply add it to the existing cart
* If the cart was empty, we create it and add the product
*/
function addToCart() {
  const choosenQuantity = document.getElementById("quantity");
  document.getElementById("addToCart").addEventListener("click", () => {
      if (
          choosenQuantity.value > 0 &&
          choosenQuantity.value <= 100
      ) {
          let product = {
              id: getProductId(),
              name: document.getElementById("title").textContent,
              price: document.getElementById("price").textContent,
              colors: document.getElementById("colors").value,
              quantity: document.getElementById("quantity").value,
              imgProduct: document.getElementsByClassName("item__img").src,
          };

          let products = JSON.parse(localStorage.getItem("cart"));

          if (products) {
              const isProductInCart = products.find(
                  (productAlreadyInCart) =>
                  productAlreadyInCart.id === product.id &&
                  productAlreadyInCart.colors === product.colors
              );
              if (isProductInCart) {
                  let newQuantity =
                      parseInt(isProductInCart.quantity) + parseInt(product.quantity);
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
addToCart();
