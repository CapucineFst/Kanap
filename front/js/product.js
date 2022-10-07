function productURL() {
  // get the product id from current page URL
  const url = new URL(window.location.href);
  const urlParams = new URLSearchParams(url.search);
  const productId = urlParams.get("id");
  return productId;
}

function productFetch() {
  const productId = productURL() ;
  fetch (`http://localhost:3000/api/products/${productId}`)
  .then((response) => response.json())
      .then((data) => {
        // Create an element image and put the picture of the product in this element
        const productPicture = document.createElement("img");
        document.querySelector(".item__img").appendChild (productPicture);
        productPicture.src = data.imageUrl;
        productPicture.alt = data.altTxt;

        // Add product name
        const productName = document.getElementById("title");
        productName.textContent = data.name;

        // Add product price
        const productPrice = document.getElementById("price");
        productPrice.textContent = data.price;

        // Add product description
        const productDescription = document.getElementById("description");
        productDescription.textContent = data.description;
        
      })
}
productFetch();