// Variable we need for the following functions
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
	} else {
		for (let cart in products) {
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
			articleImg.setAttribute("alt", products[cart].altTxt);

			const cartItemContent = document.createElement("div");
			article.appendChild(cartItemContent);
			cartItemContent.classList.add("cart__item__content");

			const cartItemContentDescription = document.createElement("div");
			cartItemContent.appendChild(cartItemContentDescription);
			cartItemContentDescription.classList.add("cart__item__content__description");

			const articleTitle = document.createElement("h2");
			cartItemContentDescription.appendChild(articleTitle);
			articleTitle.textContent = products[cart].name;

			const articleColor = document.createElement("p");
			cartItemContentDescription.appendChild(articleColor);
			articleColor.textContent = products[cart].colors;

			const articlePrice = document.createElement("p");
			cartItemContentDescription.appendChild(articlePrice);
			articlePrice.textContent = "Prix unitaire : " + products[cart].price + "€";

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

/**
 * Get the total quantity of the products and then display it
 */

function totalQuantityProducts() {

	const totalQty = document.getElementsByClassName("itemQuantity");
	let totalQuantity = 0;

	for (let cart in products) {
		totalQuantity = totalQuantity + totalQty[cart].valueAsNumber;
	}

	document.getElementById("totalQuantity").textContent = totalQuantity;

}

/**
 * Get the total price of the products and then display it
 */
function totalPriceProducts() {

	let totalPrice = 0;
	for (let cart in products) {
		totalPrice = totalPrice + products[cart].price * products[cart].quantity;
	}
	document.getElementById("totalPrice").textContent = totalPrice;
}

/**
 * Modify the quantity of the products in the local storage
 * Update the total price and quantity
 */
function modifyQuantityUpdatePrice() {

	let itemQuantity = document.getElementsByClassName("itemQuantity");
	for (let i = 0; i < itemQuantity.length; i++) {
		itemQuantity[i].addEventListener("change", function() {
			products[i].quantity = itemQuantity[i].value;
			localStorage.setItem("cart", JSON.stringify(products));
			totalPriceProducts();
			totalQuantityProducts();
		});
	}
}

/**
 * Give a role to the "Suprrimer" button
 * Make sure we delete the specific product with the color the customer want to delete
 */

function deleteProduct() {

	let deleteButton = document.getElementsByClassName("deleteItem");

	for (let i = 0; i < deleteButton.length; i++) {

		deleteButton[i].addEventListener("click", (event) => {
			event.preventDefault();

			let deletingProduct = products[i].colors;

			products = products.filter((product) => product.colors !== deletingProduct);

			localStorage.setItem("cart", JSON.stringify(products));

			alert("Ce produit va être définitivement supprimé de votre panier. Pour confirmer, cliquez sur OK.");
			location.reload();
		});
	}
}

/**
 * Create an object "contact" with the values filled by the user in the form
 * Create an object noNumberRegExp to check some of the inputs
 * If the form is correctly filled, it will create an item contact in the local storage
 * Array from the local storage to send it to the server
 * Create an object order with the info of contact and products
 * Redirection to the confirmation page
 */
function sendForm() {

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
		 * @param {*} id 
		 * @param {*} errorMsg 
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

		function formValidation() {

			if (formFirstName() === true && formLastName() === true && formAddress() === true && formCity() === true && formEmail() === true) {
				localStorage.setItem("contact", JSON.stringify(contact));
				return true;
			} else {
				event.preventDefault();
				alert("Veuillez remplir correctement le formulaire.");
			}
		}
		formValidation();

		let products = [];
		for (let i = 0; i < products.length; i++) {
			products.push(products[i].id);
		}

		if (formValidation() === true) {
			const order = {
				contact,
				products,
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
					console.log(data);
					localStorage.clear();
					localStorage.setItem("orderId", data.orderId);
					document.location.href = "confirmation.html";
				})
				.catch((error) => console.log(error));
		} else {
			event.preventDefault();
		}
	});
}

/**
 * Function that contains all the other functions
 */
function DOMLoaded() {
	displayProducts();
	totalQuantityProducts();
	totalPriceProducts();
	modifyQuantityUpdatePrice();
	deleteProduct();
	sendForm();
}

/** 
 * Starting the function when the DOM is fully loaded 
 */
window.addEventListener('DOMContentLoaded', DOMLoaded);
