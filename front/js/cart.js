/**
 * Fetch the products in the API
 * Sort them by ID
 * Create an object with the products in the cart by filtering them by ID
 * Sort them by ID so that the array and the object have the same indexation
 * @param {Array} productsInCart 
 * @returns {Promise<object>} product from the API indexed by ID
 */
function fetchApiProductById(productsInCart) {
	return fetch('http://localhost:3000/api/products')
		.then((response) => response.json())
		.then((allProductInfo) => {
			const cartIds = productsInCart.map((p) => p.id);
			const shoppingCartProductInfo = allProductInfo.filter((p) => cartIds.indexOf(p._id) != -1);
			let filteredProducts = {};
			shoppingCartProductInfo.forEach(p => {
				filteredProducts[p._id] = p;
			});
			return filteredProducts;
		});
}

/**
 * Create a div for the picture of the picture and put it in
 * @param {HTMLElement} article 
 * @param {Object} apiProduct
 */
function displayProductPicture(article, apiProduct) {
	const cartItemImg = document.createElement("div");
	article.appendChild(cartItemImg);
	cartItemImg.classList.add("cart__item__img");

	const articleImg = document.createElement("img");
	cartItemImg.appendChild(articleImg);
	articleImg.setAttribute("src", apiProduct.imageUrl);
	articleImg.setAttribute("alt", apiProduct.altTxt);
}

/**
 * Create all the elements necessary for the displaying of the quantity
 * Make sure the customer add the product within the 1-100 range
 * Add the delete button
 * @param {HTMLElement} cartItemContent 
 * @param {Object} shoppingCartProduct
 */
function displayProductQuantity(cartItemContent, shoppingCartProduct) {
	const cartItemContentSettings = document.createElement("div");
	cartItemContent.appendChild(cartItemContentSettings);
	cartItemContentSettings.classList.add("cart__item__content__settings");

	const cartItemContentSettingsQuantity = document.createElement("div");
	cartItemContentSettings.appendChild(cartItemContentSettingsQuantity);
	cartItemContentSettingsQuantity.classList.add("cart__item__content__settings__quantity");

	const articleQuantity = document.createElement("p");
	cartItemContentSettingsQuantity.appendChild(articleQuantity);
	articleQuantity.textContent = "Qté : ";
	const itemQuantity = document.createElement("input");
	cartItemContentSettingsQuantity.appendChild(itemQuantity);
	itemQuantity.classList.add("itemQuantity");
	itemQuantity.value = shoppingCartProduct.quantity;
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

/**
 * Check if the cart is empty or not
 * If it's empty, doesn't show the form
 * If it's not empty the function proceed
 * Create an element article
 * Create elements for the content and put the title, the colors and the price 
 * @param {Array} productsInCart
 * @param {HTMLElement} cartProducts
 */
function displayProducts(productsInCart, cartProducts) {
	if (productsInCart === null || productsInCart == 0) {
		cartProducts.textContent = "Votre panier est vide. N'hésitez pas à faire un tour sur notre site afin de trouver votre bonheur!";
		const divToHide = document.getElementsByClassName("cart__order");
		for (let i = 0; i < divToHide.length; i++) {
			divToHide[i].style.display = "none";
		}

	} else {
		fetchApiProductById(productsInCart)
			.then((filteredProducts) => {

				for (let i = 0; i < productsInCart.length; i++) {

					const shoppingCartProduct = productsInCart[i];
					const apiProduct = filteredProducts[productsInCart[i].id];


					const article = document.createElement("article");
					cartProducts.appendChild(article);
					article.classList.add("cart__item");

					displayProductPicture(article, apiProduct);

					const cartItemContent = document.createElement("div");
					article.appendChild(cartItemContent);
					cartItemContent.classList.add("cart__item__content");

					const cartItemContentDescription = document.createElement("div");
					cartItemContent.appendChild(cartItemContentDescription);
					cartItemContentDescription.classList.add("cart__item__content__description");

					const articleTitle = document.createElement("h2");
					cartItemContentDescription.appendChild(articleTitle);
					articleTitle.textContent = apiProduct.name;

					const articleColor = document.createElement("p");
					cartItemContentDescription.appendChild(articleColor);
					articleColor.textContent = shoppingCartProduct.colors;

					const articlePrice = document.createElement("p");
					cartItemContentDescription.appendChild(articlePrice);
					articlePrice.textContent = "Prix unitaire : " + apiProduct.price.toLocaleString() + "€";

					displayProductQuantity(cartItemContent, shoppingCartProduct);
				}
				modifyQuantityUpdatePrice(productsInCart);
				deleteProduct(productsInCart);
			});
	}
}
/**
 * Get the total quantity of the products and then display it
 * @param {Array} productsInCart
 */
function totalQuantityProducts(productsInCart) {

	let totalQuantity = 0;

	if (productsInCart == null) {
		totalQuantity = 0;
	} else {
		for (let t = 0; t < productsInCart.length; t++) {
			totalQuantity = totalQuantity + Number(productsInCart[t].quantity);
		}
	}
	document.getElementById("totalQuantity").textContent = totalQuantity.toLocaleString();

}

/**
 * Get the total price of the products and then display it
 * @param {Array} productsInCart
 */
function totalPriceProducts(productsInCart) {

	let totalPrice = 0;

	if (productsInCart == null) {
		document.getElementById("totalPrice").textContent = totalPrice;
	} else {
		fetchApiProductById(productsInCart)
			.then((filteredProducts) => {

				for (let i = 0; i < productsInCart.length; i++) {
					totalPrice = totalPrice + Number(filteredProducts[productsInCart[i].id].price) * Number(productsInCart[i].quantity);
				}
				document.getElementById("totalPrice").textContent = totalPrice.toLocaleString();
			});
	}

}


/**
 * Modify the quantity of the products in the local storage
 * Update the total price and quantity
 * @param {Array} productsInCart
 */
function modifyQuantityUpdatePrice(productsInCart) {

	let itemQuantity = document.getElementsByClassName("itemQuantity");

	for (let i = 0; i < itemQuantity.length; i++) {
		itemQuantity[i].addEventListener("change", () => {
			productsInCart[i].quantity = itemQuantity[i].value;
			localStorage.setItem("cart", JSON.stringify(productsInCart));
			totalPriceProducts(productsInCart);
			totalQuantityProducts(productsInCart);
		});
	}
}


/**
 * Give a role to the "Supprimer" button
 * Make sure we delete the specific product with the color the customer want to delete
 * @param {Array} productsInCart
 */
function deleteProduct(productsInCart) {

	let deleteButton = document.getElementsByClassName("deleteItem");

	for (let i = 0; i < deleteButton.length; i++) {
		deleteButton[i].addEventListener("click", () => {
			let deletingProduct = productsInCart[i].colors;
			productsInCart = productsInCart.filter((product) => product.colors !== deletingProduct);
			localStorage.setItem("cart", JSON.stringify(productsInCart));
			alert("Ce produit va être définitivement supprimé de votre panier. Pour confirmer, cliquez sur OK.");
			window.location.reload();
		});
	}
}

/**
 * Create an object "contact" with the values filled by the user in the form
 * Create an object noNumberRegExp to check some of the inputs
 * Create an array "products" containing only the id of the products in the cart
 * Create an object order with the info of contact and products
 * Redirection to the confirmation page
 * @param {Array} productsInCart
 */
function sendForm(productsInCart) {

	let submitButton = document.getElementById("order");
	submitButton.addEventListener("click", (event) => {
		event.preventDefault();

		const contact = {
			firstName: document.getElementById("firstName").value,
			lastName: document.getElementById("lastName").value,
			address: document.getElementById("address").value,
			city: document.getElementById("city").value,
			email: document.getElementById("email").value,
		};

		const noNumberRegExp = /^[^0-9]+$/;

		/**
		 * Ease the display of the error message
		 * @param {HTMLElement} id 
		 * @param {HTMLElement} errorMsg 
		 */
		function setErrorMessage(id, errorMsg) {
			document.getElementById(id).textContent = errorMsg;
		}

		/**
		 * Make sure the entry field of the first name is filled correctly
		 * @returns {boolean}
		 */
		function formFirstName() {

			setErrorMessage("firstNameErrorMsg", "");
			if (noNumberRegExp.test(contact.firstName) && (contact.firstName).trim().length > 0) {
				return true;
			}
			setErrorMessage("firstNameErrorMsg", "Erreur de saisie dans ce champ");
			return false;
		}

		/**
		 * Make sure the entry field of the last name is filled correctly
		 * @returns {boolean}
		 */
		function formLastName() {

			setErrorMessage("lastNameErrorMsg", "");
			if (noNumberRegExp.test(contact.lastName) && (contact.lastName).trim().length > 0) {
				return true;
			}
			setErrorMessage("lastNameErrorMsg", "Erreur de saisie dans ce champ");
			return false;
		}

		/**
		 * Make sure the entry field of the adress is filled correctly
		 * @returns {boolean}
		 */
		function formAddress() {

			setErrorMessage("addressErrorMsg", "");
			if ((contact.address).trim().length > 0) {
				return true;
			}
			setErrorMessage("addressErrorMsg", "Veuillez remplir ce champ");
			return false;
		}

		/**
		 * Make sure the entry field of the city is filled correctly
		 * @returns {boolean}
		 */
		function formCity() {

			setErrorMessage("cityErrorMsg", "");
			if (noNumberRegExp.test(contact.city) && (contact.city).trim().length > 0) {
				return true;
			}
			setErrorMessage("cityErrorMsg", "Erreur de saisie dans ce champ");
			return false;
		}

		/**
		 * Make sure the entry field of the email is filled correctly
		 * @returns {boolean}
		 */
		function formEmail() {

			setErrorMessage("emailErrorMsg", "");
			if (/^[\w\-\.]+@([\w-]+\.)+[\w-]{2,10}$/.test(contact.email) && (contact.email).trim().length > 0) {
				return true;
			}
			setErrorMessage("emailErrorMsg", "Erreur de saisie dans ce champ");
			return false;
		}

		/**
		 * Check if the form in it's entirety is correctly filled
		 * If it is, it creates an object contact in the local storage, otherwise, it display an error message
		 * @returns {boolean}
		 */
		function formValidation() {

			if (formFirstName() && formLastName() && formAddress() && formCity() && formEmail()) {
				localStorage.setItem("contact", JSON.stringify(contact));
				return true;
			} else {
				event.preventDefault();
				alert("Veuillez remplir correctement le formulaire.");
				return false;
			}
		}

		let products = [];
		for (let i = 0; i < productsInCart.length; i++) {
			products.push(productsInCart[i].id);
		}

		if (!formValidation()) {
			return;
		} else {
			const order = {
				contact,
				products
			};
			fetch("http://localhost:3000/api/products/order", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(order),
				})
				.then((response) => response.json())
				.then((data) => {
					localStorage.clear();
					document.location.href = `confirmation.html?orderId=${data.orderId}`;
				})
				.catch((error) => console.log(error));
		}
	});
}

/**
 * Function that contains all the functions that need for the DOM to be ready before starting
 */
function DOMLoaded() {
	let productsInCart = JSON.parse(localStorage.getItem("cart"));
	const cartProducts = document.getElementById("cart__items");
	displayProducts(productsInCart, cartProducts);
	totalQuantityProducts(productsInCart);
	totalPriceProducts(productsInCart);
	sendForm(productsInCart);
}

/** 
 * Starting the function when the DOM is fully loaded 
 */
window.addEventListener("DOMContentLoaded", DOMLoaded);
