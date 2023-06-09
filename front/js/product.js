let url = new URLSearchParams(window.location.search);
let showId = url.get("id");
console.log(showId);
let produit = null;

// ******* Permet l'affichage de chaque produits dans la page produit ******

fetch(`http://localhost:3000/api/products/${showId}`)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log(data);
    produit = data;
    let img = document.createElement("img");
    img.setAttribute("src", data.imageUrl);
    img.setAttribute("alt", data.altTxt);
    let showImg = document.querySelector(".item__img");
    showImg.appendChild(img);

    let title = document.getElementById("title");
    title.textContent = data.name;

    let description = document.getElementById("description");
    description.textContent = data.description;

    let price = document.getElementById("price");
    price.textContent = data.price;

    data.colors.forEach(function (color) {
      let option = document.createElement("option");
      let select = document.getElementById("colors");

      option.value = color;
      option.innerText = color;

      select.appendChild(option);
    });
  });

// ******* Affichage d'un message d'alert ci pas de couleur   / quantité séléctionnée ******
let addBasket = document.getElementById("addToCart");
addBasket.addEventListener("click", function () {
  let getSelect = document.getElementById("colors");
  if (!getSelect.value) {
    alert("Choisissez une couleur");
    return;
  }
  let quantity = document.getElementById("quantity");
  if (quantity.value < 1) {
    alert("choisir une quantité supérieur à 0 ");
    return;
  }
  if (quantity.value > 100) {
    alert("choisir uen quantité inférieur à 100");
    return;
  }

  // ****** stockage des informations dans le localstorage *******
  let productData = {
    id: showId,
    color: getSelect.value,
    quantite: quantity.value,
  };
  let products = localStorage.getItem("products");
  products = JSON.parse(products);
  if (!products) {
    products = [];
  }
  const existe = (element) =>
    element.id == productData.id && element.color == productData.color;
  let position = products.findIndex(existe);
  if (position == -1) {
    products.push(productData);
  } else {
    let returnProduct = products[position];
    if (
      parseInt(returnProduct.quantite) + parseInt(productData.quantite) >
      100
    ) {
      alert("La quantité ne peu être supérieur à 100");
      return;
    }

    returnProduct.quantite =
      parseInt(returnProduct.quantite) + parseInt(productData.quantite);
  }
  localStorage.setItem("products", JSON.stringify(products));
  alert("Le produit a bien été ajouté");
});
