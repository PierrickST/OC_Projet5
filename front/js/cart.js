const sectionCart = document.querySelector("#cart__items");

let products = localStorage.getItem("products");
products = JSON.parse(products);
let totalQty = 0;
for (const returnQty of products) {
  totalQty = totalQty + parseInt(returnQty.quantite);
}
console.log(totalQty);
const totalQuantity = document.querySelector("#totalQuantity");
totalQuantity.innerText = totalQty;
let totalPrice = 0;
const totalPriceId = document.querySelector("#totalPrice");

for (const returnProducts of products) {
  fetch(`http://localhost:3000/api/products/${returnProducts.id}`)
    .then(function (response) {
      return response.json();
    })
    .then(function (basketProducts) {
      console.log(basketProducts);
      totalPrice =
        totalPrice +
        parseInt(basketProducts.price) * parseInt(returnProducts.quantite);
      totalPriceId.innerText = totalPrice;
      console.log(totalPrice);

      let newArticle = document.createElement("article");
      newArticle.setAttribute("class", "cart__item");
      newArticle.setAttribute("data-id", `${basketProducts.id}`);
      newArticle.setAttribute("data-color", `${returnProducts.color}`);
      sectionCart.appendChild(newArticle);

      let newDiv = document.createElement("div");
      newDiv.setAttribute("class", "cart__item__img");
      newArticle.appendChild(newDiv);

      let newImg = document.createElement("img");
      newImg.setAttribute("src", basketProducts.imageUrl);
      newImg.setAttribute("alt", basketProducts.altTxt);
      newDiv.appendChild(newImg);

      let newDivContent = document.createElement("div");
      newDivContent.setAttribute("class", "cart__item__content");
      newArticle.appendChild(newDivContent);

      let newDivContentDescription = document.createElement("div");
      newDivContentDescription.setAttribute(
        "class",
        "cart__item__content__description"
      );
      newDivContent.appendChild(newDivContentDescription);

      let newH2 = document.createElement("h2");
      newH2.innerText = basketProducts.name;
      newDivContentDescription.appendChild(newH2);

      let newPColor = document.createElement("p");
      newPColor.innerText = returnProducts.color;
      newDivContentDescription.appendChild(newPColor);

      let newPPrice = document.createElement("p");
      newPPrice.innerText = basketProducts.price + " €";
      newDivContentDescription.appendChild(newPPrice);

      let newDivContentSettings = document.createElement("div");
      newDivContentSettings.setAttribute(
        "class",
        "cart__item__content__settings"
      );
      newDivContent.appendChild(newDivContentSettings);

      let newDivContentSettingsQuantity = document.createElement("div");
      newDivContentSettingsQuantity.setAttribute(
        "class",
        "cart__item__content__settings__quantity"
      );
      newDivContentSettings.appendChild(newDivContentSettingsQuantity);

      let newPQuantite = document.createElement("p");
      newPQuantite.innerText = "Qté :";
      newDivContentSettingsQuantity.appendChild(newPQuantite);

      let newPInput = document.createElement("input");
      newPInput.setAttribute("type", "number");
      newPInput.setAttribute("class", "itemQuantity");
      newPInput.setAttribute("name", "itemQuantity");
      newPInput.setAttribute("min", "1");
      newPInput.setAttribute("max", "100");
      newPInput.setAttribute("value", `${returnProducts.quantite}`);
      newDivContentSettingsQuantity.appendChild(newPInput);

      let newDivContentSettingsDelete = document.createElement("div");
      newDivContentSettingsDelete.setAttribute(
        "class",
        "cart__item__content__settings__delete"
      );
      newDivContentSettings.appendChild(newDivContentSettingsDelete);

      let newPDelete = document.createElement("p");
      newPDelete.setAttribute("class", "deleteItem");
      newPDelete.innerText = "Supprimer";
      newDivContentSettingsDelete.appendChild(newPDelete);

      modififyQty();
      validationFormulaire();

      deleteProduct();
    });
}

// ******** Récupération des données saisies par l'utilisateur *******

let fillForm = document.getElementById("order");
fillForm.addEventListener("click", function (event) {
  event.preventDefault();
  let getInput = document.getElementById("firstName");
  if (!getInput.value.trim()) {
    let firstNameErrorMsg = document.getElementById("firstNameErrorMsg");
    firstNameErrorMsg.textContent = "Ecrivez votre prénom";
    return;
  }
  let getLastName = document.getElementById("lastName");
  if (!getLastName.value.trim()) {
    let lastNameErrorMsg = document.getElementById("lastNameErrorMsg");
    lastNameErrorMsg.textContent = "Ecrivez votre nom";
    return;
  }
  let getAdress = document.getElementById("address");
  if (!getAdress.value.trim()) {
    let adressErrorMsg = document.getElementById("addressErrorMsg");
    adressErrorMsg.textContent = "Ecrivez votre adresse";
    return;
  }
  let getCity = document.getElementById("city");
  if (!getCity.value.trim()) {
    let cityErrorMsg = document.getElementById("cityErrorMsg");
    cityErrorMsg.textContent = "Ecrivez votre ville";
    return;
  }
  let getEmail = document.getElementById("email");
  const emailRegex = new RegExp(
    /^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/,
    "gm"
  );
  if (!getEmail.value.trim()) {
    let mailErrorMsg = document.getElementById("emailErrorMsg");
    mailErrorMsg.textContent = "Ecrivez votre email";
    return;
  }
  if (!emailRegex.test(getEmail.value)) {
    let mailErrorMsg = document.getElementById("emailErrorMsg");
    mailErrorMsg.textContent = "Ecrivez une adresse email valide";
    return;
  }
});

let nomRegex = new RegExp(/^[a-zA-Zàâäéèêëïîôöùûüç ,.'-]+$/);

let emailRegex = new RegExp(
  /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-z]{2,3})$/
);

let adressRegex = new RegExp(/^[0-9 A-Za-z'-]{1,40}$/);

function validationFormulaire() {
  // PRENOM

  let prenomFamille = document.querySelector("#firstName");

  prenomFamille.addEventListener("input", () => {
    if (nomRegex.test(prenomFamille.value) === false) {
      document.querySelector("#firstNameErrorMsg").textContent =
        "Caractères spéciaux non pris en compte pour votre prenom";
    } else {
      document.querySelector("#firstNameErrorMsg").textContent = "";
    }
  });

  // NOM DE FAMILLE

  let firstName = document.querySelector("#lastName");

  firstName.addEventListener("input", () => {
    if (nomRegex.test(firstName.value) === false) {
      document.querySelector("#lastNameErrorMsg").textContent =
        "Caractères spéciaux non pris en compte pour votre nom";
    } else {
      document.querySelector("#lastNameErrorMsg").textContent = "";
    }
  });

  // ADRESSE

  let address = document.querySelector("#address");

  address.addEventListener("input", () => {
    if (adressRegex.test(address.value) === false) {
      document.querySelector("#addressErrorMsg").textContent =
        "Caractères spéciaux non pris en compte pour votre adresse";
    } else {
      document.querySelector("#addressErrorMsg").textContent = "";
    }
  });

  // VILLE

  let city = document.querySelector("#city");

  city.addEventListener("input", () => {
    if (nomRegex.test(city.value) === false) {
      document.querySelector("#cityErrorMsg").textContent =
        "Caractères spéciaux non pris en compte pour votre ville";
    } else {
      document.querySelector("#cityErrorMsg").textContent = "";
    }
  });

  // EMAIL

  let email = document.querySelector("#email");

  email.addEventListener("input", () => {
    if (emailRegex.test(email.value) === false) {
      document.querySelector("#emailErrorMsg").textContent =
        "Caractères spéciaux non pris en compte pour votre adresse mail";
    } else {
      document.querySelector("#emailErrorMsg").textContent = "";
    }
  });
}

// ******** supp v2
function deleteProduct() {
  let selectSupprimer = document.querySelectorAll(".deleteItem");

  for (let l = 0; l < selectSupprimer.length; l++) {
    selectSupprimer[l].addEventListener("click", (event) => {
      event.preventDefault();
      console.log("delete");

      // on filtre les éléments du localStorage pour ne garder que ceux qui sont différents de l'élément qu'on supprime
      const idProduitASupprimer = products[l].id;
      const couleurProduitASupprimer = products[l].couleur;

      products = products.filter(
        (element) =>
          element.id !== idProduitASupprimer ||
          element.couleur !== couleurProduitASupprimer
      );

      // On met à jour le localStorage
      localStorage.setItem("products", JSON.stringify(products));

      //Alerte produit supprimé
      alert("Ce produit va être supprimé du panier.");
      location.reload();
    });
  }
}
//}

// ****** fin v2

// *************** EXAMPLE 2 MODIFICATION DE PANIER
function modififyQty() {
  // Selection des références de touts les input gérant la quantité

  const inputQuantite = document.querySelectorAll(".itemQuantity");

  // Boucle for pour écouté tout les éléments

  for (let q = 0; q < inputQuantite.length; q++) {
    // Ecoute des evements au 'click' sur les input

    inputQuantite[q].addEventListener("change", (event) => {
      event.preventDefault();
      console.log("change");

      products[q].quantite = event.target.value;

      // condition si quantité = 0 => renvoie vers la fonction supprimer produit.

      if (products[q].quantite == 0) {
        const idProduitASupprimer = products[q].id;
        const couleurProduitASupprimer = products[q].couleur;

        // Fitler method

        products = products.filter(
          (element) =>
            element.id !== idProduitASupprimer ||
            element.couleur !== couleurProduitASupprimer
        );

        // Actualisation de la clés "produit" puis un reload de la page.

        localStorage.setItem("products", JSON.stringify(products));
        //location.reload();
        location.reload();
      }

      if (
        products[q].quantite > 0 &&
        products[q].quantite <= 100 &&
        products[q].quantite != 0
      ) {
        localStorage.setItem("products", JSON.stringify(products));

        // Second appel de la fonction afficherQteEtPrixTotal pour modifier de maniere dynamique le prix, sans reload la page.

        totalQtyTotalPrice();
      } else {
        // Actualisation du local storage.
        alert("ERREUR : Veuillez sélectionner un nombre entre 1 et 100 ");

        location.reload();
      }
    });
  }
}

function totalQtyTotalPrice() {
  // Selection des références pour la qté produit, qté total et prix total.

  let quantityProduct = document.querySelectorAll(".itemQuantity");

  let quantityBasket = document.querySelector("#totalQuantity");

  let calcTotalPrice = document.querySelector("#totalPrice");

  // Déclaration des valeurs par défauts.

  let totalQuantityBasket = 0;

  let totalPrix = 0;

  for (let i = 0; i < quantityProduct.length; i++) {
    // L'opérateur d'addition (+=) : permet l'addition de la quantite du dernière objet du tableau + tout les autres elements grâce à la boucle.

    totalQuantityBasket += quantityProduct[i].valueAsNumber;
  }
  console.log(totalQuantityBasket);

  quantityBasket.textContent = totalQuantityBasket;

  for (let p = 0; p < quantityProduct.length; p++) {
    totalPrix += quantityProduct[p].valueAsNumber * products[p].price;
  }

  calcTotalPrice.textContent = totalPrix;
  console.log(totalPrix);
  console.log(calcTotalPrice);

  return totalPrix;

  // location.reload();
}

function validationCommande() {
  // Selection de la référence pour le bouton 'commander'

  const btnCommander = document.querySelector("#order");

  // Écoute de l'evenement au click du bouton

  btnCommander.addEventListener("click", (event) => {
    event.preventDefault();

    // Condition de confirmation du formulaire : Si tout les Regex ont étés contrôlé et validés.

    if (
      !nomRegex.test(firstName.value) ||
      !nomRegex.test(lastName.value) ||
      !emailRegex.test(email.value) ||
      !nomRegex.test(city.value) ||
      !adressRegex.test(address.value)
    ) {
      alert("Veuillez vérifier les champs de complétion du formulaire");
    } else {
      // Creation d'un tableau pour récupérer les ID produits :

      let productId = [];

      // Boucle for pour parcourir tout les elements :

      for (let i = 0; i < products.length; i++) {
        // method PUSH pour ajouter un ou plusieurs elements dans le tableau 'productId'

        productId.push(products[i].id);
      }

      // Creation de l'objet contact à partir des données du formulaire et du tableau productId.

      let order = {
        contact: {
          firstName: firstName.value,
          lastName: lastName.value,
          address: address.value,
          city: city.value,
          email: email.value,
        },
        products: productId,
      };

      // Options de la method POST.

      const options = {
        method: "POST",
        body: JSON.stringify(order),
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
      };

      // Appel de l'API et Envoie des informations contact & products à l'aide de la méthode POST.

      fetch("http://localhost:3000/api/products/order", options)
        .then((response) => response.json())

        .then((dataBase) => {
          const orderId = dataBase.orderId;

          //envoie vers la page de de confirmation avec l'orderId en fin de l'URL.
          window.location.href = "confirmation.html" + "?orderId=" + orderId;
        })
        .catch((error) => {
          alert(error);
        });
    }
  });
}

validationCommande();

function messagePanierVide() {
  compositionProduitsPanier = "Le panier est vide !";
  let newH2 = document.createElement("h2");
  productsPositionHtml.appendChild(newH2);
  newH2.innerText = compositionProduitsPanier;
  // On insère 0 dans le html pour la quantité et le prix du panier
  document.getElementById("totalQuantity").innerText = 0;
  document.getElementById("totalPrice").innerText = 0;
}
