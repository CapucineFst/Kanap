let products = JSON.parse(localStorage.getItem("cart"));
const cartProducts = document.getElementById("cart__items");

/**
 * Check if the cart is empty or not
 * If it's not empty the function proceed
 * Create an element article
 * Create a div for the picture and put it in
 * Create elements for the content and put the title, the name and the price 
 * Create a paragraph for the quantity (which can be modified with another function) and make sure the quantity stays within the 1 to a 100 interval
 * Add a delete button (which works with another function)
 */
function displayProducts() {
    if (products === null || products == 0) {
        const emptyCart = "Votre panier est vide. N'hésitez pas à faire un tour sur notre site afin de trouver votre bonheur!";
        cartProducts.textContent = emptyCart;
    }
    else {
        for (let cart in products) 
        {
            const article = document.createElement("article");
            let dataId = document.getElementsByClassName("data-id");
            cartProducts.appendChild(article);
            article.classList.add("cart__item", "data-id");
            dataId = article.setAttribute("data-id", products[cart].id);

            const cartItemImg = document.createElement("div");
            article.appendChild(cartItemImg);
            cartItemImg.classList.add("cart__item__img");

            const articleImg = document.createElement("img");
            cartItemImg.appendChild(articleImg);
            articleImg.setAttribute("src", products[cart].image);

            const cartItemContent = document.createElement("div");
            article.appendChild(cartItemContent);
            cartItemContent.classList.add("cart__item__content");

            const cartItemContentTitlePrice = document.createElement("div");
            cartItemContent.appendChild(cartItemContentTitlePrice);
            cartItemContentTitlePrice.classList.add("cart__item__content__titlePrice");

            const articleTitle = document.createElement("h2");
            cartItemContentTitlePrice.appendChild(articleTitle);
            articleTitle.textContent = products[cart].name;

            const articleColor = document.createElement("p");
            articleTitle.appendChild(articleColor);
            articleColor.textContent = products[cart].colors;

            const articlePrice = document.createElement("p");
            articleColor.appendChild(articlePrice);
            articlePrice.textContent = `${products[cart].price * products[cart].quantity} €`;

            const cartItemContentSettings = document.createElement("div");
            cartItemContent.appendChild(cartItemContentSettings);
            cartItemContentSettings.classList.add("cart__item__content__settings");

            const cartItemContentSettingsQuantity = document.createElement("div");
            cartItemContentSettings.appendChild(cartItemContentSettingsQuantity);
            cartItemContentSettingsQuantity.classList.add("cart__item__content__settings__quantity");

            const articleQuantity = document.createElement("p");
            cartItemContentSettingsQuantity.appendChild(articleQuantity);
            articleQuantity.textContent = "Qté : "

            const itemQuantity = document.createElement("input");
            cartItemContentSettingsQuantity.appendChild(itemQuantity);
            itemQuantity.classList.add("itemQuantity");
            itemQuantity.value = products[cart].quantity;
            itemQuantity.setAttribute("type", "number");
            itemQuantity.setAttribute("min", "1");
            itemQuantity.setAttribute("max", "100");
            itemQuantity.setAttribute("name", "itemQuantity");

            const cartItemContentSettingsDelete = document.createElement("div");
            cartItemContentSettings.appendChild(cartItemContentSettingsDelete);
            cartItemContentSettingsDelete.classList.add("cart__item__content__settings__delete");

            const deleteItem = document.createElement("p");
            cartItemContentSettingsDelete.appendChild(deleteItem);
            deleteItem.classList.add("deleteItem");
            deleteItem.textContent = "Supprimer";

        }
    }
}
displayProducts();