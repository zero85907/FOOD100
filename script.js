// Основа

// Создаем основной Объект с продуктами
const product = {
  plainBurger: {
    name: "Гамбургер простой",
    price: 10000,
    kcall: 400,
    amount: 0,
    get Summ() {
      return this.price * this.amount;
    },
    get Kcall() {
      return this.kcall * this.amount;
    },
  },
  freshBurger: {
    name: "Гамбургер FRESH",
    price: 20500,
    kcall: 500,
    amount: 0,
    get Summ() {
      return this.price * this.amount;
    },
    get Kcall() {
      return this.kcall * this.amount;
    },
  },
  freshCombo: {
    name: "FRESH COMBO",
    price: 31900,
    kcall: 700,
    amount: 0,
    get Summ() {
      return this.price * this.amount;
    },
    get Kcall() {
      return this.kcall * this.amount;
    },
  },
};
// Создаем доп Объект с модификациями
const extraProduct = {
  doubleMayonnaise: {
    name: "Двойной майонез",
    price: 500,
    kcall: 50,
  },
  lettuce: {
    name: "Салатный лист",
    price: 300,
    kcall: 10,
  },
  cheese: {
    name: "Сыр",
    price: 400,
    kcall: 30,
  },
};

document.addEventListener("DOMContentLoaded", () => {
  animateLevel(0);
  initImageView();
  initProducts();
  initOrder();
});

function animateLevel(current) {
  const el = document.querySelector(".header__timer-extra");
  if (!el) return;
  el.textContent = current;
  if (current >= 100) return;
  const delay = current < 50 ? 20 : 80;
  setTimeout(() => animateLevel(current + 1), delay);
}

function initImageView() {
  const view = document.querySelector(".view");
  if (!view) return;
  const viewImg = view.querySelector("img");
  const closeBtn = view.querySelector(".view__close");

  document.querySelectorAll(".main__product-info").forEach((info) => {
    info.addEventListener("click", () => {
      const img = info.querySelector("img");
      if (!img || !viewImg) return;
      viewImg.setAttribute("src", img.getAttribute("src"));
      view.classList.add("active");
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      view.classList.remove("active");
      viewImg.setAttribute("src", "");
    });
  }

  view.addEventListener("click", (e) => {
    if (e.target === view) {
      view.classList.remove("active");
      if (viewImg) viewImg.setAttribute("src", "");
    }
  });
}

function initProducts() {
  document.querySelectorAll(".main__product").forEach((section) => {
    const id = section.id;
    const btns = section.querySelectorAll(".main__product-btn");
    const checkboxes = section.querySelectorAll(".main__product-checkbox");

    btns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const symbol = btn.dataset.symbol;
        if (symbol === "+") product[id].amount++;
        if (symbol === "-")
          product[id].amount = Math.max(0, product[id].amount - 1);
        updateProductDisplay(id, section);
      });
    });

    checkboxes.forEach((ch) =>
      ch.addEventListener("change", () => updateProductDisplay(id, section))
    );

    updateProductDisplay(id, section);
  });
}

function calcExtras(section) {
  const extras = { price: 0, kcall: 0, list: [] };
  section.querySelectorAll(".main__product-checkbox:checked").forEach((ch) => {
    const key = ch.dataset.extra;
    extras.price += extraProduct[key].price;
    extras.kcall += extraProduct[key].kcall;
    extras.list.push(extraProduct[key].name);
  });
  return extras;
}

function updateProductDisplay(key, section) {
  const p = product[key];
  const numEl = section.querySelector(".main__product-num");
  const priceEl = section.querySelector(".main__product-price span");
  const kcallEl = section.querySelector(".main__product-kcall span");

  const extras = calcExtras(section);
  const totalPrice = (p.price + extras.price) * p.amount;
  const totalKcall = (p.kcall + extras.kcall) * p.amount;

  numEl.textContent = p.amount;
  priceEl.textContent = totalPrice;
  kcallEl.textContent = totalKcall;
}

function initOrder() {
  const orderBtn = document.querySelector(".addCart");
  const receipt = document.querySelector(".receipt");
  const itemsEl = document.getElementById("receipt__window-items");
  const payBtn = document.querySelector(".receipt__window-btn");

  if (!orderBtn || !receipt || !itemsEl) return;

  orderBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const burgers = [];
    let totalPrice = 0;
    const extrasSet = new Set();

    Object.keys(product).forEach((key) => {
      const p = product[key];
      if (p.amount > 0) {
        burgers.push(`${p.name} x${p.amount}`);
        const section = document.getElementById(key);
        const extras = section ? calcExtras(section) : { list: [], price: 0 };
        totalPrice += (p.price + extras.price) * p.amount;
        extras.list.forEach((ex) => extrasSet.add(ex));
      }
    });

    const burgersLine = burgers.length
      ? `Бургеры: ${burgers.join(", ")}`
      : "Бургеры: ";
    const extrasArray = Array.from(extrasSet);
    const extrasLine = extrasArray.length
      ? `Допы: ${extrasArray.join(", ")}`
      : "Допы: ";
    const totalLine = `Общая цена: ${totalPrice} сум`;

    itemsEl.innerHTML = `
      <div class="receipt__simple">
        ${burgersLine}<br>
        ${extrasLine}<br>
        ${totalLine}
      </div>
    `;

    receipt.classList.add("active");
  });

  if (payBtn) {
    payBtn.addEventListener("click", () => {
      Object.keys(product).forEach((key) => {
        product[key].amount = 0;
        const section = document.getElementById(key);
        if (section) {
          section
            .querySelectorAll(".main__product-checkbox")
            .forEach((ch) => (ch.checked = false));
          updateProductDisplay(key, section);
        }
      });
      receipt.classList.remove("active");
      itemsEl.innerHTML = "";
    });
  }
}
