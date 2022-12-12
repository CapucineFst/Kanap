/**
 * Get the id of the order using the URL
 * @returns {String}
 */
function getOrderId () {
    const url = new URL(window.location.href);
    const urlParams = new URLSearchParams(url.search);
    const orderID = urlParams.get("orderId");
    return orderID;
}
/**
 * Give the id of the order to the client using the function above
 */
function orderConfirmation() {
    const idOrder = document.getElementById("orderId");
    idOrder.textContent = getOrderId();
}

/** 
 * Starting the function when the DOM is fully loaded 
 */
window.addEventListener('DOMContentLoaded', orderConfirmation);