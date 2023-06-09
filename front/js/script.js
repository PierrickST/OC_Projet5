const sectionItems = document.querySelector("#items");

// ******* Récupération des données des produits via l'API et création des éléments qui permettent d'afficher les fiches produits **********
fetch(" http://localhost:3000/api/products")
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log(data);
    for (const listProducts of data) {
      let a = document.createElement("a");
      a.setAttribute("href", `./product.html?id=${listProducts._id}`);
      sectionItems.appendChild(a);

      let article = document.createElement("article");
      a.appendChild(article);

      let img = document.createElement("img");
      img.setAttribute("src", listProducts.imageUrl);
      img.setAttribute("alt", listProducts.altTxt);
      article.appendChild(img);

      let h3 = document.createElement("h3");
      h3.setAttribute("class", "productName");
      h3.innerText = listProducts.name;
      article.appendChild(h3);

      let p = document.createElement("p");
      p.setAttribute("class", "productDescription");
      p.innerText = listProducts.description;
      article.appendChild(p);
    }
  });
