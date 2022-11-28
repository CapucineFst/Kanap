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
 * Run the function UpdateProductInPage when a product is selected
 */
function productFetch(productElements) {
    const productId = getProductId();
    fetch(`http://localhost:3000/api/products/${productId}`)
        .then((response) => response.json())
        .then(function(selectedProduct) {
            if (!selectedProduct) {
                return;
            }
            UpdateProductInPage(selectedProduct, productElements);
        });
}

// Creation of the object "product" and setting his default parameters
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
 * Create an element image and put the picture of the product in it
 * Add product name, price, description, image and altTxt
 * Create an element option and put the available colors in it
 * Add the name, price, description, image and altTxt to the object product
 * @param {*} selectedProduct 
 * @param {*} productElements
 */
function UpdateProductInPage(selectedProduct, productElements) {

    const productPicture = document.createElement("img");
    document.querySelector(".item__img").appendChild(productPicture);
    productPicture.src = selectedProduct.imageUrl;
    productPicture.alt = selectedProduct.altTxt;

    productElements.title.textContent = selectedProduct.name;
    productElements.price.textContent = selectedProduct.price;
    productElements.description.textContent = selectedProduct.description;

    for (let i = 0; i < selectedProduct.colors.length; i++) {
        const productColor = document.createElement("option");
        document.querySelector("#colors").appendChild(productColor);
        productColor.textContent = selectedProduct.colors[i];
    }

    product.image = selectedProduct.imageUrl;
    product.altTxt = selectedProduct.altTxt;
    product.name = selectedProduct.name;
    product.price = selectedProduct.price;
    product.description = selectedProduct.description;

}

/**
 * Make sure a color is selected
 * @returns {boolean}
 */
function correctColor(productElements) {
    if (productElements.colors.value !== "") {
        return true;
    } else {
        window.alert("Veuillez choisir une couleur.");
        return false;
    }
}

/**
 * Make sure the selected quantity is between 0 and 100
 * @returns {boolean}
 */
function correctQuantity(productElements) {
    if (productElements.quantity.value > 0 && productElements.quantity.value <= 100) {
        return true;
    } else {
        window.alert("Le nombre d'articles doit être compris entre 0 et 100.");
        return false;
    }
}

/**
 * Updates the product once the color and quantity is selected
 */
function updateProduct(productElements) {
    let choosenQuantity = productElements.quantity.value;
    let choosenColor = productElements.colors.value;

    product.id = getProductId();
    product.colors = choosenColor;
    product.quantity = choosenQuantity;
}

/** 
 * Verify if a color and a quantity is chosen
 * Create the place in the cart
 * Check if the cart is empty
 * If it is, create the array containing the product info
 * Check if the product is already in the cart, if it is just add the new quantity, making sure the customer can't buy more than a hundred. If not, push it to the cart.
 * Display a window asking if the customer want to go to the cart page
 */
function addToCart(productElements) {
    if (!correctColor(productElements) || !correctQuantity(productElements)) {
        return;
    }

    updateProduct(productElements);
    let productsInCart = JSON.parse(localStorage.getItem("cart"));

    if (!productsInCart) {
        productsInCart = [];
    }

    const productInCart = productsInCart.find(
        (productAlreadyInCart) =>
        productAlreadyInCart.id === product.id &&
        productAlreadyInCart.colors === product.colors
    );
    if (productInCart) {
        let newQuantityInNumber = parseInt(productInCart.quantity) + parseInt(product.quantity);
        let newQuantity = newQuantityInNumber.toString();

        if (newQuantity > 100) {
            window.alert("Vous ne pouvez pas acheter plus de 100 exemplaires");
            return;
        }

        productInCart.quantity = newQuantity;
    } else {
        productsInCart.push(product);
    }

    localStorage.setItem("cart", JSON.stringify(productsInCart));
    goToCartPage();
}

/** 
 * Give the "Ajouter au panier" button a role
 */
function InitAddToCartButton(productElements) {
    document.getElementById("addToCart").addEventListener("click", (event) => {
        event.preventDefault();
        addToCart(productElements);
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

/**
 * Function that contains all the other functions
 */
function DOMLoaded() {
    const productElements = {
        title: document.getElementById("title"),
        price: document.getElementById("price"),
        description: document.getElementById("description"),
        colors: document.getElementById("colors"),
        quantity: document.getElementById("quantity")
    };
    productFetch(productElements);
    InitAddToCartButton(productElements);
}

/** 
 * Starting the function when the DOM is fully loaded 
 */
window.addEventListener('DOMContentLoaded', DOMLoaded);