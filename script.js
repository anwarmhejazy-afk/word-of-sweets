const db = window.db;

const whatsappNumber = "971528112120";
const body = document.body;
const langButtons = document.querySelectorAll(".lang-btn");
const translatableElements = document.querySelectorAll("[data-en][data-ar]");

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
const orderNote = document.getElementById("orderNote");

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

const productsContainer = document.getElementById("productsContainer");

let currentLang = "en";
let selectedProduct = null;
let selectedFlavors = [];
let selectedGifts = [];
let quantity = 1;
let cart = JSON.parse(localStorage.getItem("wordOfSweetsCart")) || [];
let productsFromDB = [];

const baseGiftOptions = [
  {
    id: "gift-packaging",
    name_en: "Gift Packaging",
    name_ar: "تغليف هدية",
    price_value: 10,
    sort_order: 1
  },
  {
    id: "greeting-card",
    name_en: "Greeting Card",
    name_ar: "بطاقة تهنئة",
    price_value: 5,
    sort_order: 2
  },
  {
    id: "mixed-selection",
    name_en: "Mixed Selection",
    name_ar: "تشكيلة مشكلة",
    price_value: 15,
    sort_order: 3
  }
];

function getRevealItems() {
  return document.querySelectorAll(".reveal");
}

function getLangText(item) {
  if (!item) return "-";
  return currentLang === "ar"
    ? item.name_ar || item.name_en || "-"
    : item.name_en || item.name_ar || "-";
}

function getCurrencyLabel() {
  return currentLang === "ar" ? "درهم" : "AED";
}

function getPriceText(item) {
  const value = Number(item?.price_value || 0);
  return currentLang === "ar" ? `${value} درهم` : `${value} AED`;
}

function getGiftLabel(item) {
  const value = Number(item?.price_value || 0);

  if (currentLang === "ar") {
    return `${getLangText(item)} (+${value} درهم)`;
  }

  return `${getLangText(item)} (+${value} AED)`;
}

function getProductName(product) {
  if (!product) return "-";
  return currentLang === "ar"
    ? product.name_ar || product.name_en || "-"
    : product.name_en || product.name_ar || "-";
}

function getProductDescription(product) {
  if (!product) return "";
  return currentLang === "ar"
    ? product.desc_ar || product.desc_en || ""
    : product.desc_en || product.desc_ar || "";
}

function getShortDescription(product) {
  const fullText = getProductDescription(product).trim();
  if (!fullText) return "";

  const maxLength = currentLang === "ar" ? 55 : 58;

  if (fullText.length <= maxLength) return fullText;

  return fullText.slice(0, maxLength).trim() + "...";
}

function getSafeImage(url, fallback = "images/cakes.jpg") {
  return url && String(url).trim() ? url : fallback;
}

function sortByOrder(items) {
  return [...(items || [])].sort(
    (a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0)
  );
}

function getGiftOptionsForProduct(product) {
  const flavorsCount = product?.product_flavors?.length || 0;

  if (flavorsCount <= 1) {
    return baseGiftOptions.filter((gift) => gift.id !== "mixed-selection");
  }

  return baseGiftOptions;
}

function getTotalFlavorPrice() {
  return selectedFlavors.reduce((sum, item) => sum + Number(item.price_value || 0), 0);
}

function getTotalGiftPrice() {
  return selectedGifts.reduce((sum, item) => sum + Number(item.price_value || 0), 0);
}

function getNamesList(items) {
  if (!items || !items.length) {
    return currentLang === "ar" ? "بدون" : "None";
  }

  return items.map((item) => getLangText(item)).join(", ");
}

function getPricesList(items) {
  if (!items || !items.length) {
    return `0 ${getCurrencyLabel()}`;
  }

  return items.map((item) => `${getLangText(item)}: ${getPriceText(item)}`).join(" | ");
}

function updateNotePlaceholder() {
  if (!orderNote) return;

  orderNote.placeholder =
    currentLang === "ar"
      ? orderNote.dataset.arPlaceholder
      : orderNote.dataset.enPlaceholder;
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
    cartEmpty.textContent =
      currentLang === "ar" ? cartEmpty.dataset.ar : cartEmpty.dataset.en;
  }

  if (cartCheckoutBtn) {
    cartCheckoutBtn.textContent =
      currentLang === "ar" ? cartCheckoutBtn.dataset.ar : cartCheckoutBtn.dataset.en;
  }

  if (addToCartBtn) {
    addToCartBtn.textContent =
      currentLang === "ar" ? addToCartBtn.dataset.ar : addToCartBtn.dataset.en;
  }

  updateNotePlaceholder();

  if (productsFromDB.length) {
    renderProductsFromDB();
  }

  if (selectedProduct) {
    renderModalContent();
  }

  updateSummary();
  renderCart();
}

langButtons.forEach((btn) => {
  btn.addEventListener("click", () => setLanguage(btn.dataset.lang));
});

function revealOnScroll() {
  const triggerBottom = window.innerHeight * 0.9;

  getRevealItems().forEach((item) => {
    if (item.getBoundingClientRect().top < triggerBottom) {
      item.classList.add("show");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);

function createProductCardMarkup(product) {
  const viewLabel = currentLang === "ar" ? "عرض الخيارات" : "View Options";
  const whatsappLabel = currentLang === "ar" ? "اطلب عبر واتساب" : "Order via WhatsApp";

  return `
    <article class="product-card reveal show" data-product-id="${product.id}">
      <div class="product-image-wrap">
        <img
          src="${getSafeImage(product.image_url)}"
          alt="${product.name_en || "Product"}"
          class="product-image"
        />
      </div>

      <div class="product-body">
        <h3>${getProductName(product)}</h3>

        <p class="product-text">
          ${getShortDescription(product)}
        </p>

        <div class="card-actions">
          <button class="btn btn-card btn-view-options" type="button">${viewLabel}</button>
          <button class="btn btn-card btn-card-whatsapp quick-order" type="button">${whatsappLabel}</button>
        </div>
      </div>
    </article>
  `;
}

function attachProductEvents() {
  document.querySelectorAll(".btn-view-options").forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest(".product-card");
      const productId = Number(card?.dataset.productId);
      const product = productsFromDB.find((item) => item.id === productId);
      if (product) openModal(product);
    });
  });

  document.querySelectorAll(".quick-order").forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest(".product-card");
      const productId = Number(card?.dataset.productId);
      const product = productsFromDB.find((item) => item.id === productId);
      if (!product) return;

      const productName = getProductName(product);
      const text =
        currentLang === "ar"
          ? `مرحباً، أرغب في طلب ${productName}.`
          : `Hello, I would like to order ${productName}.`;

      window.open(
        `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`,
        "_blank"
      );
    });
  });
}

function renderProductsFromDB() {
  if (!productsContainer) return;

  productsContainer.innerHTML = productsFromDB
    .map((product) => createProductCardMarkup(product))
    .join("");

  attachProductEvents();
  revealOnScroll();
}

async function loadProductsFromDB() {
  if (!db || !productsContainer) return;

  const { data, error } = await db
    .from("products")
    .select(`
      *,
      product_flavors (
        id,
        product_id,
        name_en,
        name_ar,
        image_url,
        price_value,
        sort_order,
        created_at
      )
    `)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error loading products:", error);
    return;
  }

  productsFromDB = (data || []).map((product) => ({
    ...product,
    product_flavors: sortByOrder(product.product_flavors)
  }));

  renderProductsFromDB();
}

function resetSelections(product) {
  selectedProduct = product;
  selectedFlavors = product?.product_flavors?.length ? [product.product_flavors[0]] : [];
  selectedGifts = [];
  quantity = 1;

  if (orderNote) orderNote.value = "";
}

function toggleFlavor(item, button) {
  const exists = selectedFlavors.some((flavor) => flavor.id === item.id);

  if (exists) {
    if (selectedFlavors.length === 1) return;
    selectedFlavors = selectedFlavors.filter((flavor) => flavor.id !== item.id);
    button.classList.remove("active");
  } else {
    selectedFlavors.push(item);
    button.classList.add("active");
    modalImage.src = getSafeImage(item.image_url, getSafeImage(selectedProduct.image_url));
    modalImage.alt = getLangText(item);
  }

  updateSummary();
}

function toggleGift(item, button) {
  const exists = selectedGifts.some((gift) => gift.id === item.id);

  if (exists) {
    selectedGifts = selectedGifts.filter((gift) => gift.id !== item.id);
    button.classList.remove("active");
  } else {
    selectedGifts.push(item);
    button.classList.add("active");
  }

  updateSummary();
}

function createFlavorButtons(container, items) {
  if (!container) return;
  container.innerHTML = "";

  if (!items || !items.length) {
    const standardOption = {
      id: "standard-option",
      name_en: "Standard option",
      name_ar: "الخيار الأساسي",
      image_url: selectedProduct?.image_url || "",
      price_value: 0
    };

    selectedFlavors = [standardOption];

    const button = document.createElement("button");
    button.type = "button";
    button.className = "flavor-btn active";
    button.innerHTML = `
      <img src="${getSafeImage(selectedProduct?.image_url)}" alt="Standard">
      <span class="flavor-name">${getLangText(standardOption)}</span>
      <span class="flavor-price">${getPriceText(standardOption)}</span>
    `;

    container.appendChild(button);
    return;
  }

  items.forEach((item) => {
    const isActive = selectedFlavors.some((flavor) => flavor.id === item.id);

    const button = document.createElement("button");
    button.type = "button";
    button.className = "flavor-btn" + (isActive ? " active" : "");
    button.innerHTML = `
      <img src="${getSafeImage(item.image_url, getSafeImage(selectedProduct?.image_url))}" alt="${item.name_en || "Flavor"}">
      <span class="flavor-name">${getLangText(item)}</span>
      <span class="flavor-price">${getPriceText(item)}</span>
    `;

    button.addEventListener("click", () => toggleFlavor(item, button));
    container.appendChild(button);
  });
}

function createGiftButtons(container, items) {
  if (!container) return;
  container.innerHTML = "";

  items.forEach((item) => {
    const isActive = selectedGifts.some((gift) => gift.id === item.id);

    const button = document.createElement("button");
    button.type = "button";
    button.className = "gift-btn" + (isActive ? " active" : "");
    button.innerHTML = `
      <span class="option-name">${getGiftLabel(item)}</span>
    `;

    button.addEventListener("click", () => toggleGift(item, button));
    container.appendChild(button);
  });
}

function updateSummary() {
  if (!selectedProduct) return;

  const flavorTotal = getTotalFlavorPrice();
  const giftTotal = getTotalGiftPrice();
  const totalPrice = (flavorTotal + giftTotal) * quantity;

  summaryProduct.textContent = getProductName(selectedProduct);
  summaryFlavor.textContent = getNamesList(selectedFlavors);
  summaryPrice.textContent = getPricesList(selectedFlavors);
  summaryGift.textContent = getNamesList(selectedGifts);
  summaryGiftPrice.textContent = getPricesList(selectedGifts);
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
    sendOrderBtn.textContent =
      currentLang === "ar" ? sendOrderBtn.dataset.ar : sendOrderBtn.dataset.en;
  }
}

function renderModalContent() {
  if (!selectedProduct) return;

  modalTitle.textContent = getProductName(selectedProduct);
  modalDescription.textContent = getProductDescription(selectedProduct);

  const mainImage =
    selectedFlavors?.[0]?.image_url || selectedProduct.image_url || "images/cakes.jpg";

  modalImage.src = getSafeImage(mainImage, getSafeImage(selectedProduct.image_url));
  modalImage.alt = getProductName(selectedProduct);

  createFlavorButtons(flavorOptions, selectedProduct.product_flavors);

  const gifts = getGiftOptionsForProduct(selectedProduct);
  createGiftButtons(giftOptions, gifts);

  updateSummary();
}

function openModal(product) {
  resetSelections(product);
  renderModalContent();

  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");
  body.classList.add("modal-open");
}

function closeModal() {
  modal.classList.remove("active");
  modal.setAttribute("aria-hidden", "true");
  body.classList.remove("modal-open");
}

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

if (orderNote) {
  orderNote.addEventListener("input", () => updateSummary());
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

  cartEmpty.style.display = cart.length === 0 ? "block" : "none";

  let total = 0;

  cart.forEach((item, index) => {
    total += item.totalValue;

    const itemEl = document.createElement("div");
    itemEl.className = "cart-item";

    const productName = currentLang === "ar" ? item.productAr : item.productEn;
    const flavorName = currentLang === "ar" ? item.flavorsAr : item.flavorsEn;
    const giftName = currentLang === "ar" ? item.giftsAr : item.giftsEn;
    const totalText =
      currentLang === "ar" ? `${item.totalValue} درهم` : `${item.totalValue} AED`;
    const noteText = currentLang === "ar" ? item.noteAr || "" : item.noteEn || "";

    itemEl.innerHTML = `
      <h4>${productName}</h4>
      <div class="cart-meta">${currentLang === "ar" ? "النكهات" : "Flavors"}: ${flavorName}</div>
      <div class="cart-meta">${currentLang === "ar" ? "الإضافات" : "Gift Options"}: ${giftName}</div>
      <div class="cart-meta">${currentLang === "ar" ? "الكمية" : "Qty"}: ${item.quantity}</div>
      ${noteText ? `<div class="cart-meta">${currentLang === "ar" ? "ملاحظات" : "Notes"}: ${noteText}</div>` : ""}
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
    if (!selectedProduct) return;

    const totalValue =
      (getTotalFlavorPrice() + getTotalGiftPrice()) * quantity;

    cart.push({
      productEn: selectedProduct.name_en || "",
      productAr: selectedProduct.name_ar || selectedProduct.name_en || "",
      flavorsEn: selectedFlavors.map((item) => item.name_en).join(", "),
      flavorsAr: selectedFlavors.map((item) => item.name_ar || item.name_en).join(", "),
      giftsEn: selectedGifts.length ? selectedGifts.map((item) => item.name_en).join(", ") : "None",
      giftsAr: selectedGifts.length ? selectedGifts.map((item) => item.name_ar || item.name_en).join(", ") : "بدون",
      noteEn: orderNote?.value?.trim() || "",
      noteAr: orderNote?.value?.trim() || "",
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

      const noteBlock =
        item.noteEn || item.noteAr
          ? currentLang === "ar"
            ? `ملاحظات: ${item.noteAr || item.noteEn}`
            : `Notes: ${item.noteEn || item.noteAr}`
          : "";

      if (currentLang === "ar") {
        return `${index + 1}) ${item.productAr}
النكهات: ${item.flavorsAr}
الإضافات: ${item.giftsAr}
الكمية: ${item.quantity}
${noteBlock ? noteBlock + "\n" : ""}السعر: ${item.totalValue} درهم`;
      }

      return `${index + 1}) ${item.productEn}
Flavors: ${item.flavorsEn}
Gift Options: ${item.giftsEn}
Qty: ${item.quantity}
${noteBlock ? noteBlock + "\n" : ""}Price: ${item.totalValue} AED`;
    });

    const message =
      currentLang === "ar"
        ? `مرحباً 👋

أرغب في طلب العناصر التالية:

${lines.join("\n\n")}

الإجمالي: ${total} درهم

شكراً`
        : `Hello 👋

I would like to place the following order:

${lines.join("\n\n")}

Total: ${total} AED

Thank you`;

    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  });
}

if (sendOrderBtn) {
  sendOrderBtn.addEventListener("click", () => {
    if (!selectedProduct) return;

    const productName = getProductName(selectedProduct);
    const noteValue = orderNote?.value?.trim() || "";
    const totalPrice =
      (getTotalFlavorPrice() + getTotalGiftPrice()) * quantity;

    const message =
      currentLang === "ar"
        ? `مرحباً 👋

أرغب في طلب:

الصنف: ${productName}
النكهات: ${getNamesList(selectedFlavors)}
أسعار النكهات: ${getPricesList(selectedFlavors)}
الإضافات: ${getNamesList(selectedGifts)}
أسعار الإضافات: ${getPricesList(selectedGifts)}
الكمية: ${quantity}
${noteValue ? `ملاحظات: ${noteValue}\n` : ""}الإجمالي التقريبي: ${totalPrice} ${getCurrencyLabel()}

شكراً`
        : `Hello 👋

I would like to place an order:

Item: ${productName}
Flavors: ${getNamesList(selectedFlavors)}
Flavor Prices: ${getPricesList(selectedFlavors)}
Gift Options: ${getNamesList(selectedGifts)}
Gift Prices: ${getPricesList(selectedGifts)}
Quantity: ${quantity}
${noteValue ? `Notes: ${noteValue}\n` : ""}Estimated Total: ${totalPrice} ${getCurrencyLabel()}

Thank you`;

    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  });
}

renderCart();
setLanguage("en");
loadProductsFromDB();