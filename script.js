const whatsappNumber = "971528112120";
const body = document.body;
const langButtons = document.querySelectorAll(".lang-btn");
const translatableElements = document.querySelectorAll("[data-en][data-ar]");
const revealItems = document.querySelectorAll(".reveal");

const modal = document.getElementById("productModal");
const modalClose = document.getElementById("modalClose");
const modalBackdrop = document.querySelector(".modal-backdrop");
const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");
const flavorOptions = document.getElementById("flavorOptions");
const giftOptions = document.getElementById("giftOptions");
const quantityValue = document.getElementById("quantityValue");
const decreaseQty = document.getElementById("decreaseQty");
const increaseQty = document.getElementById("increaseQty");
const sendOrderBtn = document.getElementById("sendOrderBtn");
const addToCartBtn = document.getElementById("addToCartBtn");

const summaryProduct = document.getElementById("summaryProduct");
const summaryFlavor = document.getElementById("summaryFlavor");
const summaryPrice = document.getElementById("summaryPrice");
const summaryGift = document.getElementById("summaryGift");
const summaryGiftPrice = document.getElementById("summaryGiftPrice");
const summaryQty = document.getElementById("summaryQty");
const summaryTotal = document.getElementById("summaryTotal");

const cartToggle = document.getElementById("cartToggle");
const cartClose = document.getElementById("cartClose");
const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const cartEmpty = document.getElementById("cartEmpty");
const cartCheckoutBtn = document.getElementById("cartCheckoutBtn");

const productData = {
  "cakes": {
    image: "images/cakes.jpg",
    flavors: [
      { en: "Chocolate", ar: "شوكولاتة", image: "images/Celebration Cakes Chocolate .jpg", priceEn: "260 AED", priceAr: "260 درهم", priceValue: 260 },
      { en: "Red Velvet", ar: "ريد فيلفت", image: "images/Celebration Cakes Red Velvet.jpg", priceEn: "280 AED", priceAr: "280 درهم", priceValue: 280 },
      { en: "Pistachio", ar: "فستق", image: "images/Celebration Cakes Pistachio.jpg", priceEn: "295 AED", priceAr: "295 درهم", priceValue: 295 }
    ],
    gifts: [
      { en: "Standard Cake Box", ar: "علبة كيك عادية", priceEn: "0 AED", priceAr: "0 درهم", priceValue: 0 },
      { en: "Gift Wrapping", ar: "تغليف هدية", priceEn: "20 AED", priceAr: "20 درهم", priceValue: 20 },
      { en: "Premium Presentation", ar: "تقديم فاخر", priceEn: "35 AED", priceAr: "35 درهم", priceValue: 35 }
    ]
  },

  "cookies": {
    image: "images/cookies.jpg",
    flavors: [
      { en: "Double Chocolate", ar: "دبل شوكولاتة", image: "images/Cookies Double Chocolate.jpg", priceEn: "55 AED", priceAr: "55 درهم", priceValue: 55 },
      { en: "Pistachio", ar: "فستق", image: "images/Cookies Pistachio.jpg", priceEn: "60 AED", priceAr: "60 درهم", priceValue: 60 },
      { en: "Lotus", ar: "لوتس", image: "images/Cookies Lotus.jpg", priceEn: "58 AED", priceAr: "58 درهم", priceValue: 58 }
    ],
    gifts: [
      { en: "Standard Box", ar: "علبة عادية", priceEn: "0 AED", priceAr: "0 درهم", priceValue: 0 },
      { en: "Gift Box", ar: "علبة هدية", priceEn: "12 AED", priceAr: "12 درهم", priceValue: 12 },
      { en: "Premium Cookie Box", ar: "بوكس كوكيز فاخر", priceEn: "20 AED", priceAr: "20 درهم", priceValue: 20 }
    ]
  },

  "swiss-roll": {
    image: "images/swiss roll.jpg",
    flavors: [
      { en: "Vanilla", ar: "فانيلا", image: "images/swiss roll vanilla.jpg", priceEn: "75 AED", priceAr: "75 درهم", priceValue: 75 },
      { en: "Pistachio", ar: "فستق", image: "images/swiss roll pistachio.jpg", priceEn: "88 AED", priceAr: "88 درهم", priceValue: 88 },
      { en: "Raspberry", ar: "توت العليق", image: "images/swiss roll raspberry.jpg", priceEn: "82 AED", priceAr: "82 درهم", priceValue: 82 }
    ],
    gifts: [
      { en: "Standard Box", ar: "علبة عادية", priceEn: "0 AED", priceAr: "0 درهم", priceValue: 0 },
      { en: "Gift Box", ar: "علبة هدية", priceEn: "15 AED", priceAr: "15 درهم", priceValue: 15 },
      { en: "Premium Roll Box", ar: "علبة سويس رول فاخرة", priceEn: "22 AED", priceAr: "22 درهم", priceValue: 22 }
    ]
  },

  "fruit-tarts": {
    image: "images/Small tart mix.jpg",
    flavors: [
      { en: "Mix", ar: "مشكل", image: "images/Small tart mix.jpg", priceEn: "76 AED", priceAr: "76 درهم", priceValue: 76 },
      { en: "Strawberry", ar: "فراولة", image: "images/Small tart Strawberry.jpg", priceEn: "70 AED", priceAr: "70 درهم", priceValue: 70 },
      { en: "Kiwi Berry", ar: "كيوي وتوت", image: "images/Small tart Kiwi Berry.jpg", priceEn: "74 AED", priceAr: "74 درهم", priceValue: 74 }
    ],
    gifts: [
      { en: "Standard Tray", ar: "صينية عادية", priceEn: "0 AED", priceAr: "0 درهم", priceValue: 0 },
      { en: "Gift Box", ar: "علبة هدية", priceEn: "14 AED", priceAr: "14 درهم", priceValue: 14 },
      { en: "Premium Tart Box", ar: "بوكس تارت فاخر", priceEn: "22 AED", priceAr: "22 درهم", priceValue: 22 }
    ]
  },

  "cinnamon-rolls": {
    image: "images/cinnamon rolls.jpg",
    flavors: [
      { en: "Classic Cinnamon", ar: "سينامون كلاسيك", image: "images/cinnamon rolls.jpg", priceEn: "65 AED", priceAr: "65 درهم", priceValue: 65 }
    ],
    gifts: [
      { en: "Standard Box", ar: "علبة عادية", priceEn: "0 AED", priceAr: "0 درهم", priceValue: 0 },
      { en: "Gift Box", ar: "علبة هدية", priceEn: "12 AED", priceAr: "12 درهم", priceValue: 12 },
      { en: "Premium Cinnamon Box", ar: "بوكس سينامون فاخر", priceEn: "18 AED", priceAr: "18 درهم", priceValue: 18 }
    ]
  },

  "mini-cheesecakes": {
    image: "images/Small cheesecake.jpg",
    flavors: [
      { en: "Strawberry", ar: "فراولة", image: "images/Small cheesecake Strawberry.jpg", priceEn: "85 AED", priceAr: "85 درهم", priceValue: 85 },
      { en: "Blueberry", ar: "توت أزرق", image: "images/Small cheesecake Blueberry.jpg", priceEn: "88 AED", priceAr: "88 درهم", priceValue: 88 },
      { en: "Chocolate", ar: "شوكولاتة", image: "images/Small cheesecake chocolate.jpg", priceEn: "90 AED", priceAr: "90 درهم", priceValue: 90 },
      { en: "Pistachio", ar: "فستق", image: "images/Small cheesecake Pistachio.jpg", priceEn: "95 AED", priceAr: "95 درهم", priceValue: 95 },
      { en: "Lotus", ar: "لوتس", image: "images/Small cheesecake Lotus.jpg", priceEn: "92 AED", priceAr: "92 درهم", priceValue: 92 }
    ],
    gifts: [
      { en: "Standard Box", ar: "علبة عادية", priceEn: "0 AED", priceAr: "0 درهم", priceValue: 0 },
      { en: "Gift Box", ar: "علبة هدية", priceEn: "14 AED", priceAr: "14 درهم", priceValue: 14 },
      { en: "Premium Cheesecake Box", ar: "بوكس تشيزكيك فاخر", priceEn: "24 AED", priceAr: "24 درهم", priceValue: 24 }
    ]
  },

  "dessert-cups": {
    image: "images/cups.jpg",
    flavors: [
      { en: "Berry Cheesecake", ar: "تشيزكيك التوت", image: "images/cups berry.jpg", priceEn: "78 AED", priceAr: "78 درهم", priceValue: 78 },
      { en: "Tiramisu", ar: "تيراميسو", image: "images/cups tiramisu.jpg", priceEn: "82 AED", priceAr: "82 درهم", priceValue: 82 },
      { en: "Lotus", ar: "لوتس", image: "images/cups Lotus.jpg", priceEn: "80 AED", priceAr: "80 درهم", priceValue: 80 },
      { en: "Pistachio", ar: "فستق", image: "images/cups Pistachio.jpg", priceEn: "86 AED", priceAr: "86 درهم", priceValue: 86 }
    ],
    gifts: [
      { en: "Standard Tray", ar: "صينية عادية", priceEn: "0 AED", priceAr: "0 درهم", priceValue: 0 },
      { en: "Gift Box", ar: "علبة هدية", priceEn: "14 AED", priceAr: "14 درهم", priceValue: 14 },
      { en: "Premium Cup Box", ar: "بوكس أكواب فاخر", priceEn: "22 AED", priceAr: "22 درهم", priceValue: 22 }
    ]
  },

  "tiramisu-cubes": {
    image: "images/cube tiramisu.jpg",
    flavors: [
      { en: "Classic Tiramisu", ar: "تيراميسو كلاسيك", image: "images/cube tiramisu.jpg", priceEn: "88 AED", priceAr: "88 درهم", priceValue: 88 }
    ],
    gifts: [
      { en: "Standard Box", ar: "علبة عادية", priceEn: "0 AED", priceAr: "0 درهم", priceValue: 0 },
      { en: "Gift Box", ar: "علبة هدية", priceEn: "16 AED", priceAr: "16 درهم", priceValue: 16 },
      { en: "Premium Tiramisu Box", ar: "بوكس تيراميسو فاخر", priceEn: "25 AED", priceAr: "25 درهم", priceValue: 25 }
    ]
  }
};

let currentLang = "en";
let selectedProductKey = "";
let selectedProductCard = null;
let selectedFlavor = null;
let selectedGift = null;
let quantity = 1;
let cart = JSON.parse(localStorage.getItem("wordOfSweetsCart")) || [];

function getLangText(item) {
  return currentLang === "ar" ? item.ar : item.en;
}

function getPriceText(item) {
  return currentLang === "ar" ? item.priceAr : item.priceEn;
}

function getCurrencyLabel() {
  return currentLang === "ar" ? "درهم" : "AED";
}

function setLanguage(lang) {
  currentLang = lang;

  langButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.lang === lang);
  });

  body.classList.toggle("lang-ar", lang === "ar");

  document.documentElement.lang = lang;
  document.documentElement.dir = "ltr";

  translatableElements.forEach((el) => {
    const value = lang === "ar" ? el.dataset.ar : el.dataset.en;
    if (value) el.textContent = value;
  });

  if (cartEmpty) {
    cartEmpty.textContent = currentLang === "ar" ? cartEmpty.dataset.ar : cartEmpty.dataset.en;
  }

  if (cartCheckoutBtn) {
    cartCheckoutBtn.textContent = currentLang === "ar" ? cartCheckoutBtn.dataset.ar : cartCheckoutBtn.dataset.en;
  }

  if (addToCartBtn) {
    addToCartBtn.textContent = currentLang === "ar" ? addToCartBtn.dataset.ar : addToCartBtn.dataset.en;
  }

  if (selectedProductCard) {
    modalTitle.textContent = currentLang === "ar"
      ? selectedProductCard.dataset.nameAr
      : selectedProductCard.dataset.nameEn;

    modalDescription.textContent = currentLang === "ar"
      ? selectedProductCard.dataset.descAr
      : selectedProductCard.dataset.descEn;

    const productConfig = productData[selectedProductKey];

    createFlavorButtons(flavorOptions, productConfig.flavors, (item, button) => {
      selectedFlavor = item;
      modalImage.src = item.image;
      modalImage.alt = currentLang === "ar" ? item.ar : item.en;
      [...flavorOptions.children].forEach((child) => child.classList.remove("active"));
      button.classList.add("active");
      updateSummary();
    });

    createGiftButtons(giftOptions, productConfig.gifts, (item, button) => {
      selectedGift = item;
      [...giftOptions.children].forEach((child) => child.classList.remove("active"));
      button.classList.add("active");
      updateSummary();
    });
  }

  updateSummary();
  renderCart();
}

langButtons.forEach((btn) => {
  btn.addEventListener("click", () => setLanguage(btn.dataset.lang));
});

function revealOnScroll() {
  const triggerBottom = window.innerHeight * 0.9;
  revealItems.forEach((item) => {
    if (item.getBoundingClientRect().top < triggerBottom) {
      item.classList.add("show");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);

function resetSelections(productKey) {
  const product = productData[productKey];
  selectedFlavor = product.flavors[0] || null;
  selectedGift = product.gifts[0] || null;
  quantity = 1;
}

function createGiftButtons(container, items, clickHandler) {
  if (!container) return;
  container.innerHTML = "";

  items.forEach((item, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "gift-btn" + (index === 0 ? " active" : "");
    button.innerHTML = `
      <span class="option-name">${getLangText(item)}</span>
      <span class="option-price">${getPriceText(item)}</span>
    `;

    button.addEventListener("click", () => clickHandler(item, button));
    container.appendChild(button);
  });
}

function createFlavorButtons(container, items, clickHandler) {
  if (!container) return;
  container.innerHTML = "";

  items.forEach((item, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "flavor-btn" + (index === 0 ? " active" : "");
    button.innerHTML = `
      <img src="${item.image}" alt="${item.en}">
      <span class="flavor-name">${getLangText(item)}</span>
      <span class="flavor-price">${getPriceText(item)}</span>
    `;

    button.addEventListener("click", () => clickHandler(item, button));
    container.appendChild(button);
  });
}

function updateSummary() {
  if (!selectedProductCard) return;

  const name = currentLang === "ar"
    ? selectedProductCard.dataset.nameAr
    : selectedProductCard.dataset.nameEn;

  const flavorPrice = selectedFlavor ? selectedFlavor.priceValue : 0;
  const giftPrice = selectedGift ? selectedGift.priceValue : 0;
  const totalPrice = (flavorPrice + giftPrice) * quantity;

  summaryProduct.textContent = name;
  summaryFlavor.textContent = selectedFlavor ? getLangText(selectedFlavor) : "-";
  summaryPrice.textContent = selectedFlavor ? getPriceText(selectedFlavor) : "-";
  summaryGift.textContent = selectedGift ? getLangText(selectedGift) : "-";
  summaryGiftPrice.textContent = selectedGift ? getPriceText(selectedGift) : "-";
  summaryQty.textContent = quantity;
  quantityValue.textContent = quantity;
  summaryTotal.textContent = `${totalPrice} ${getCurrencyLabel()}`;

  document.querySelectorAll(".option-title[data-en][data-ar]").forEach((el) => {
    el.textContent = currentLang === "ar" ? el.dataset.ar : el.dataset.en;
  });

  document.querySelectorAll(".summary-row span[data-en][data-ar]").forEach((el) => {
    el.textContent = currentLang === "ar" ? el.dataset.ar : el.dataset.en;
  });

  if (sendOrderBtn) {
    sendOrderBtn.textContent = currentLang === "ar"
      ? sendOrderBtn.dataset.ar
      : sendOrderBtn.dataset.en;
  }
}

function openModal(productCard) {
  selectedProductCard = productCard;
  selectedProductKey = productCard.dataset.product;

  const productConfig = productData[selectedProductKey];
  resetSelections(selectedProductKey);

  modalImage.src = selectedFlavor.image;
  modalImage.alt = currentLang === "ar" ? selectedFlavor.ar : selectedFlavor.en;

  modalTitle.textContent = currentLang === "ar"
    ? productCard.dataset.nameAr
    : productCard.dataset.nameEn;

  modalDescription.textContent = currentLang === "ar"
    ? productCard.dataset.descAr
    : productCard.dataset.descEn;

  createFlavorButtons(flavorOptions, productConfig.flavors, (item, button) => {
    selectedFlavor = item;
    modalImage.src = item.image;
    modalImage.alt = currentLang === "ar" ? item.ar : item.en;
    [...flavorOptions.children].forEach((child) => child.classList.remove("active"));
    button.classList.add("active");
    updateSummary();
  });

  createGiftButtons(giftOptions, productConfig.gifts, (item, button) => {
    selectedGift = item;
    [...giftOptions.children].forEach((child) => child.classList.remove("active"));
    button.classList.add("active");
    updateSummary();
  });

  updateSummary();

  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");
  body.style.overflow = "hidden";
}

function closeModal() {
  modal.classList.remove("active");
  modal.setAttribute("aria-hidden", "true");
  body.style.overflow = "";
}

document.querySelectorAll(".btn-view-options").forEach((button) => {
  button.addEventListener("click", () => {
    openModal(button.closest(".product-card"));
  });
});

document.querySelectorAll(".quick-order").forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest(".product-card");
    const productName = currentLang === "ar" ? card.dataset.nameAr : card.dataset.nameEn;
    const text = currentLang === "ar"
      ? `مرحباً، أرغب في طلب ${productName}.`
      : `Hello, I would like to order ${productName}.`;

    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, "_blank");
  });
});

if (modalClose) modalClose.addEventListener("click", closeModal);
if (modalBackdrop) modalBackdrop.addEventListener("click", closeModal);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.classList.contains("active")) {
    closeModal();
  }
});

if (decreaseQty) {
  decreaseQty.addEventListener("click", () => {
    if (quantity > 1) {
      quantity -= 1;
      updateSummary();
    }
  });
}

if (increaseQty) {
  increaseQty.addEventListener("click", () => {
    quantity += 1;
    updateSummary();
  });
}

function saveCart() {
  localStorage.setItem("wordOfSweetsCart", JSON.stringify(cart));
}

function updateCartCount() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (cartCount) cartCount.textContent = totalItems;
}

function renderCart() {
  if (!cartItems) return;

  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartEmpty.style.display = "block";
  } else {
    cartEmpty.style.display = "none";
  }

  let total = 0;

  cart.forEach((item, index) => {
    total += item.totalValue;

    const itemEl = document.createElement("div");
    itemEl.className = "cart-item";

    const productName = currentLang === "ar" ? item.productAr : item.productEn;
    const flavorName = currentLang === "ar" ? item.flavorAr : item.flavorEn;
    const giftName = currentLang === "ar" ? item.giftAr : item.giftEn;
    const totalText = currentLang === "ar" ? `${item.totalValue} درهم` : `${item.totalValue} AED`;

    itemEl.innerHTML = `
      <h4>${productName}</h4>
      <div class="cart-meta">${currentLang === "ar" ? "النكهة" : "Flavor"}: ${flavorName}</div>
      <div class="cart-meta">${currentLang === "ar" ? "الهدية" : "Gift"}: ${giftName}</div>
      <div class="cart-meta">${currentLang === "ar" ? "الكمية" : "Qty"}: ${item.quantity}</div>
      <div class="cart-item-row">
        <div class="cart-item-price">${totalText}</div>
        <button class="cart-remove" type="button" data-index="${index}">
          ${currentLang === "ar" ? "حذف" : "Remove"}
        </button>
      </div>
    `;

    cartItems.appendChild(itemEl);
  });

  if (cartTotal) {
    cartTotal.textContent = currentLang === "ar" ? `${total} درهم` : `${total} AED`;
  }

  cartItems.querySelectorAll(".cart-remove").forEach((btn) => {
    btn.addEventListener("click", () => {
      cart.splice(Number(btn.dataset.index), 1);
      saveCart();
      updateCartCount();
      renderCart();
    });
  });

  updateCartCount();
}

function openCart() {
  if (!cartDrawer || !cartOverlay) return;
  cartDrawer.classList.add("active");
  cartOverlay.classList.add("active");
  cartDrawer.setAttribute("aria-hidden", "false");
}

function closeCart() {
  if (!cartDrawer || !cartOverlay) return;
  cartDrawer.classList.remove("active");
  cartOverlay.classList.remove("active");
  cartDrawer.setAttribute("aria-hidden", "true");
}

if (cartToggle) cartToggle.addEventListener("click", openCart);
if (cartClose) cartClose.addEventListener("click", closeCart);
if (cartOverlay) cartOverlay.addEventListener("click", closeCart);

if (addToCartBtn) {
  addToCartBtn.addEventListener("click", () => {
    if (!selectedProductCard || !selectedFlavor || !selectedGift) return;

    const totalValue = ((selectedFlavor.priceValue || 0) + (selectedGift.priceValue || 0)) * quantity;

    cart.push({
      productEn: selectedProductCard.dataset.nameEn,
      productAr: selectedProductCard.dataset.nameAr,
      flavorEn: selectedFlavor.en,
      flavorAr: selectedFlavor.ar,
      giftEn: selectedGift.en,
      giftAr: selectedGift.ar,
      quantity,
      totalValue
    });

    saveCart();
    renderCart();
    closeModal();
    openCart();
  });
}

if (cartCheckoutBtn) {
  cartCheckoutBtn.addEventListener("click", () => {
    if (!cart.length) return;

    let total = 0;
    const lines = cart.map((item, index) => {
      total += item.totalValue;

      if (currentLang === "ar") {
        return `${index + 1}) ${item.productAr}
النكهة: ${item.flavorAr}
الهدية: ${item.giftAr}
الكمية: ${item.quantity}
السعر: ${item.totalValue} درهم`;
      }

      return `${index + 1}) ${item.productEn}
Flavor: ${item.flavorEn}
Gift: ${item.giftEn}
Qty: ${item.quantity}
Price: ${item.totalValue} AED`;
    });

    const message = currentLang === "ar"
      ? `مرحباً، أرغب في طلب العناصر التالية:\n\n${lines.join("\n\n")}\n\nالإجمالي: ${total} درهم`
      : `Hello, I would like to order the following items:\n\n${lines.join("\n\n")}\n\nTotal: ${total} AED`;

    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank");
  });
}

if (sendOrderBtn) {
  sendOrderBtn.addEventListener("click", () => {
    if (!selectedProductCard) return;

    const productName = currentLang === "ar" ? selectedProductCard.dataset.nameAr : selectedProductCard.dataset.nameEn;
    const flavorName = selectedFlavor ? getLangText(selectedFlavor) : "-";
    const flavorPrice = selectedFlavor ? getPriceText(selectedFlavor) : "-";
    const giftName = selectedGift ? getLangText(selectedGift) : "-";
    const giftPrice = selectedGift ? getPriceText(selectedGift) : "-";
    const totalPrice = ((selectedFlavor ? selectedFlavor.priceValue : 0) + (selectedGift ? selectedGift.priceValue : 0)) * quantity;

    const message = currentLang === "ar"
      ? `مرحباً، أرغب في طلب:
الصنف: ${productName}
النكهة: ${flavorName}
سعر النكهة: ${flavorPrice}
خيار الهدية: ${giftName}
سعر الهدية: ${giftPrice}
الكمية: ${quantity}
الإجمالي التقريبي: ${totalPrice} ${getCurrencyLabel()}`
      : `Hello, I would like to place an order:
Item: ${productName}
Flavor: ${flavorName}
Flavor Price: ${flavorPrice}
Gift Option: ${giftName}
Gift Price: ${giftPrice}
Quantity: ${quantity}
Estimated Total: ${totalPrice} ${getCurrencyLabel()}`;

    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank");
  });
}

renderCart();
setLanguage("en");