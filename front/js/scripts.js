/** 
 * Fetch the API 
 * Loop to make sure we take all the informations we need to create the product card (link, image, name, description)
 */
 function cardsFetch() {

    fetch('http://localhost:3000/api/products')
        .then((response) => response.json())
        .then((data) => {
            console.log(data);

            for (i = 0; i < data.length; i++) {

                const productSection = document.getElementById("items");

                const productLink = document.createElement("a");
                productSection.appendChild(productLink);
                productLink.setAttribute("href", `product.html?id=${data[i]._id}`);


                const productCard = document.createElement("article");
                productLink.appendChild(productCard);

                const productPicture = document.createElement("img");
                productCard.appendChild(productPicture);
                productPicture.setAttribute("src", data[i].imageUrl);
                productPicture.setAttribute("alt", data[i].altTxt);

                const productName = document.createElement("h3");
                productCard.appendChild(productName);
                productName.textContent = data[i].name;

                const productDescription = document.createElement("p");
                productCard.appendChild(productDescription);
                productDescription.textContent = data[i].description;
            }
        })
}

/** 
 * Starting the function when the DOM is fully loaded 
 */
window.addEventListener('DOMContentLoaded', cardsFetch);