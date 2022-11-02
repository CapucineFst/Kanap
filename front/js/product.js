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
 * Run the function productData when a product is selected
 */
function productFetch() {
    const productId = getProductId();
    fetch(`http://localhost:3000/api/products/${productId}`)
        .then((response) => response.json())
        .then(function(data) {
            const selectedProduct = data;
            if (selectedProduct) {
                productData(selectedProduct);
            }
        });
}
productFetch();

// Variable we need for the following functions
const productTitle = document.getElementById("title");
const productPrice = document.getElementById("price");
const productDescription = document.getElementById("description");
const productColor = document.getElementById("colors");
const productQuantity = document.getElementById("quantity");

// Creation of the object "product" and setting his default parameter

let product = {
    id: 0,
    colors: "",
    quantity: 0,
    name: "",
    price: "",
    image: "",
    altTxt: "" 
};

/**
 *Create an element image and put the picture of the product in it
 * Add product name, price, description, image and altTxt
 * Create an element option and put the available colors in it
 * Add the name, price, description, image and altTxt to the object product
 * @param {*} selectedProduct 
 */
function productData(selectedProduct) {

    const productPicture = document.createElement("img");
    document.querySelector(".item__img").appendChild(productPicture);
    productPicture.src = selectedProduct.imageUrl;
    productPicture.alt = selectedProduct.altTxt;

    productTitle.textContent = selectedProduct.name;
    productPrice.textContent = selectedProduct.price;
    productDescription.textContent = selectedProduct.description;

    for (let i = 0; i < selectedProduct.colors.length; i++) {
        const productColor = document.createElement("option");
        document.querySelector("#colors").appendChild(productColor);
        productColor.textContent = selectedProduct.colors[i];
        console.log(productColor)  ;
    }

    product.image = selectedProduct.imageUrl;
    product.altTxt = selectedProduct.altTxt;
    product.name = selectedProduct.name;
    product.price = selectedProduct.price;
    product.description = selectedProduct.description;

    addToCart();

}

/**
 * Make sure a color is selected
 */
 function correctColor () {
    if (productColor.value !== "") {
        return true;
    }
    else {
        window.alert("Veuillez choisir une couleur.");
    }
};

/**
 * Make sure the selected quantity is between 0 and 100
 */
function correctQuantity () {
    if (productQuantity.value > 0 && productQuantity.value <= 100) {
        return true;
    }
    else {
        window.alert("Le nombre d'articles doit être compris entre 0 et 100.");
    }
};

/**
 * Updates the product once the color and quantity is selected
 */
function updateProduct() {
    let choosenQuantity = productQuantity.value;
    let choosenColor = productColor.value;

    product.id = getProductId();
    product.colors = choosenColor;
    product.quantity = choosenQuantity;
    console.log(product);
}
/** 
 * Give the "Ajouter au panier" button a role
 * Assign the values of the product in the cart
 * In case the product is already in the cart (using the id and the color) we add the quantity but make sure the customers can't put more than a 100 copies in the cart (50 products x3 for example)
 * If the product is not in the cart, we simply add it to the existing cart
 * If the cart was empty, we create it and add the product
 */
 function addToCart() {
    document.getElementById("addToCart").addEventListener("click", (event) => {
        event.preventDefault();
        if (correctColor() == true && correctQuantity() == true){
            updateProduct();
            let products = JSON.parse(localStorage.getItem("cart"));

            if (products) {
                const isProductInCart = products.find(
                    (productAlreadyInCart) =>
                    productAlreadyInCart.id === product.id &&
                    productAlreadyInCart.colors === product.colors
                );
                if (isProductInCart) {
                    let newQuantityInNumber = parseInt(isProductInCart.quantity) + parseInt(product.quantity);
                    let newQuantity = newQuantityInNumber.toString();

                    if (newQuantity <= 100) {
                        isProductInCart.quantity = newQuantity;
                        localStorage.setItem("cart", JSON.stringify(products));
                        goToCartPage();
                    } else {
                        window.alert("Vous ne pouvez pas acheter plus de 100 exemplaires");
                    }

                } else {
                    products.push(product);
                    localStorage.setItem("cart", JSON.stringify(products));
                    goToCartPage();
                }
            } else {
                products = [];
                products.push(product);
                localStorage.setItem("cart", JSON.stringify(products));
                goToCartPage();
            }
    }});
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