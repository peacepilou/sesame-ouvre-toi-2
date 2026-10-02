// Le ticket : les lignes de la commande, le prénom et les totaux.

const ticketLines = document.querySelector("#ticket-lines");
const ticketEmpty = document.querySelector("#ticket-empty");
const ticketTitle = document.querySelector("#ticket-title");
const ticketDiscount = document.querySelector("#ticket-discount");
const ticketTotal = document.querySelector("#ticket-total");

// Crée une ligne du ticket, sur le modèle en commentaire dans index.html
function createTicketLine(line) {
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
  return li;
}

// Efface tout le ticket, puis le redessine à partir de order
function renderTicket() {
  ticketLines.textContent = "";
  order.lines.forEach((line) => {
    ticketLines.append(createTicketLine(line));
  });

  ticketEmpty.classList.toggle("is-hidden", order.lines.length > 0);

  // textContent, jamais innerHTML : le prénom est tapé par quelqu'un
  if (order.customer !== "") {
    ticketTitle.textContent = "Ticket de " + order.customer;
  } else {
    ticketTitle.textContent = "Ticket";
  }

  ticketDiscount.textContent = formatPrice(order.getDiscount());
  ticketTotal.textContent = formatPrice(order.getTotal());
}
