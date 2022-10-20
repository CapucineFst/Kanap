/**
 * Give the id of the order to the client
 * Clear local storage for security
 */
 function orderConfirmation() {

    const idOrder = document.getElementById("orderId");
    idOrder.textContent = localStorage.getItem("orderId");
    localStorage.clear();
}

orderConfirmation();