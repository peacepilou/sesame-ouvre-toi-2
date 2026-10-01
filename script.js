// ============================================================
// Exercice 1 : la caisse. C'est la correction : tu n'y touches que quand une étape te le demande.
// ============================================================

// Fournie : transforme 220 en "2,20 €". Tu n'as pas à la modifier.
function formatPrice(cents) {
  return (cents / 100).toFixed(2).replace(".", ",") + " €";
}

// Étape 1 · Afficher la carte

const menuSection = document.querySelector("#menu");

function categoryLabel(category) {
  if (category === "coffee") {
    return "Café";
  }
  if (category === "tea") {
    return "Thé & autres";
  }
  if (category === "pastry") {
    return "Pâtisserie";
  }
  return category;
}

function renderMenu(category) {
  menuSection.textContent = "";

  for (let i = 0; i < menu.length; i++) {
    const product = menu[i];

    // Étape 6 : on saute les produits des autres catégories
    if (category !== "all" && product.category !== category) {
      continue;
    }

    const card = document.createElement("article");
    card.classList.add("product");

    const categorySpan = document.createElement("span");
    categorySpan.classList.add("product-category");
    categorySpan.textContent = categoryLabel(product.category);

    const name = document.createElement("h3");
    name.classList.add("product-name");
    name.textContent = product.name;

    const price = document.createElement("p");
    price.classList.add("product-price");
    price.textContent = formatPrice(product.price);

    const button = document.createElement("button");
    button.type = "button";
    button.classList.add("product-add");
    button.textContent = "Ajouter";

    // Étape 2 · Les produits épuisés
    if (product.available === false) {
      card.classList.add("is-sold-out");
      button.disabled = true;
    }

    button.addEventListener("click", function () {
      order.add(product);
      renderTicket();
    });

    card.append(categorySpan, name, price, button);
    menuSection.append(card);
  }
}

// Étape 3 · L'objet order

const order = {
  customer: "",
  lines: [],
  discountRate: 0,

  add(product) {
    for (let i = 0; i < this.lines.length; i++) {
      if (this.lines[i].id === product.id) {
        this.lines[i].quantity++;
        return;
      }
    }
    this.lines.push({ id: product.id, name: product.name, price: product.price, quantity: 1 });
  },

  remove(id) {
    for (let i = 0; i < this.lines.length; i++) {
      if (this.lines[i].id === id) {
        this.lines[i].quantity--;
        if (this.lines[i].quantity === 0) {
          this.lines.splice(i, 1);
        }
        return;
      }
    }
  },

  getSubtotal() {
    let subtotal = 0;
    for (let i = 0; i < this.lines.length; i++) {
      subtotal = subtotal + this.lines[i].price * this.lines[i].quantity;
    }
    return subtotal;
  },

  getDiscount() {
    return Math.round(this.getSubtotal() * this.discountRate);
  },

  getTotal() {
    return this.getSubtotal() - this.getDiscount();
  }
};

// Étape 4 · Afficher le ticket

const ticketLines = document.querySelector("#ticket-lines");
const ticketEmpty = document.querySelector("#ticket-empty");
const ticketTitle = document.querySelector("#ticket-title");
const ticketDiscount = document.querySelector("#ticket-discount");
const ticketTotal = document.querySelector("#ticket-total");

function renderTicket() {
  ticketLines.textContent = "";

  for (let i = 0; i < order.lines.length; i++) {
    const line = order.lines[i];

    const li = document.createElement("li");
    li.classList.add("ticket-line");

    const name = document.createElement("span");
    name.classList.add("line-name");
    name.textContent = line.name;

    const qty = document.createElement("span");
    qty.classList.add("line-qty");
    qty.textContent = "× " + line.quantity;

    const price = document.createElement("span");
    price.classList.add("line-price");
    price.textContent = formatPrice(line.price * line.quantity);

    // Étape 5 · Retirer une ligne
    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.classList.add("line-remove");
    removeButton.setAttribute("aria-label", "Retirer un " + line.name);
    removeButton.textContent = "−";
    removeButton.addEventListener("click", function () {
      order.remove(line.id);
      renderTicket();
    });

    li.append(name, qty, price, removeButton);
    ticketLines.append(li);
  }

  if (order.lines.length === 0) {
    ticketEmpty.classList.remove("is-hidden");
  } else {
    ticketEmpty.classList.add("is-hidden");
  }

  if (order.customer !== "") {
    ticketTitle.textContent = "Ticket de " + order.customer;
  } else {
    ticketTitle.textContent = "Ticket";
  }

  ticketDiscount.textContent = formatPrice(order.getDiscount());
  ticketTotal.textContent = formatPrice(order.getTotal());
}

// Étape 6 · Filtrer par catégorie

const categories = document.querySelector("#categories");
const categoryButtons = document.querySelectorAll("#categories button");

categories.addEventListener("click", function (event) {
  if (event.target.tagName === "BUTTON") {
    for (let i = 0; i < categoryButtons.length; i++) {
      categoryButtons[i].classList.remove("is-active");
    }
    event.target.classList.add("is-active");
    renderMenu(event.target.value);
  }
});

// Étape 7 · Le prénom du client

const customerForm = document.querySelector("#customer-form");
const customerInput = document.querySelector("#customer-name");
const customerError = document.querySelector("#customer-error");

customerForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const name = customerInput.value.trim();

  if (name === "") {
    customerError.textContent = "Indique le prénom du client.";
    return;
  }

  // textContent, jamais innerHTML : le prénom est tapé par quelqu'un
  order.customer = name;
  customerError.textContent = "";
  renderTicket();
});

// Étape 8 · Le code promo

const promoForm = document.querySelector("#promo-form");
const promoInput = document.querySelector("#promo-code");
const promoMessage = document.querySelector("#promo-message");

promoForm.addEventListener("submit", function (event) {
  event.preventDefault();

  if (promoInput.value.trim().toUpperCase() === "BARISTA") {
    order.discountRate = 0.1;
    promoMessage.textContent = "−10 % appliqués";
  } else {
    order.discountRate = 0;
    promoMessage.textContent = "Code inconnu";
  }
  renderTicket();
});

// Bonus · Encaisser

const checkoutButton = document.querySelector("#checkout");
let ticketNumber = 1;

checkoutButton.addEventListener("click", function () {
  if (order.lines.length === 0) {
    return;
  }

  alert("Ticket n°" + ticketNumber + " encaissé : " + formatPrice(order.getTotal()));
  ticketNumber++;

  order.lines = [];
  order.customer = "";
  order.discountRate = 0;
  customerInput.value = "";
  promoInput.value = "";
  customerError.textContent = "";
  promoMessage.textContent = "";
  renderTicket();
});

// ============================================================
// Exercice 2 : l'IA du comptoir. Ton code, une section par étape.
// ============================================================

// Étape 1 · Parler à Qwen


// Étape 2 · La carte dans le prompt système


// Étape 3 · Une réponse en JSON


// Étape 4 · Le ticket se remplit


// Étape 5 · La caisse décide


// Étape 6 · Quand l'IA ne répond pas


// Étape 7 · Le prénom aussi


// Étape 8 · Le conseil du barista


// Bonus


// Premier affichage
renderMenu("all");
renderTicket();
