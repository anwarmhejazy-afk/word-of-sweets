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
let selectedFlavor = null;
let selectedGift = null;
let quantity = 1;
let cart = JSON.parse(localStorage.getItem("wordOfSweetsCart")) || [];
let productsFromDB = [];

function getRevealItems() {
  return document.querySelectorAll(".reveal");
}

function getLangText(item) {
  if (!item) return "-";
  return currentLang === "ar"
    ? item.name_ar || item.name_en || "-"
    : item.name_en || item.name_ar || "-";
}

function getPriceText(item) {
  const value = Number(item?.price_value || 0);
  return currentLang === "ar" ? `${value} درهم` : `${value} AED`;
}

function getCurrencyLabel() {
  return currentLang === "ar" ? "درهم" : "AED";
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
    cartEmpty.textContent = currentLang === "ar" ? cartEmpty.dataset.ar : cartEmpty.dataset.en;
  }

  if (cartCheckoutBtn) {
    cartCheckoutBtn.textContent = currentLang === "ar" ? cartCheckoutBtn.dataset.ar : cartCheckoutBtn.dataset.en;
  }

  if (addToCartBtn) {
    addToCartBtn.textContent = currentLang === "ar" ? addToCartBtn.dataset.ar : addToCartBtn.dataset.en;
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
      const text = currentLang === "ar"
        ? `مرحباً، أرغب في طلب ${productName}.`
        : `Hello, I would like to order ${productName}.`;

      window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, "_blank");
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
      ),
      product_gifts (
        id,
        product_id,
        name_en,
        name_ar,
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
    product_flavors: sortByOrder(product.product_flavors),
    product_gifts: sortByOrder(product.product_gifts)
  }));

  renderProductsFromDB();
}

function resetSelections(product) {
  selectedProduct = product;
  selectedFlavor = product?.product_flavors?.[0] || null;
  selectedGift = { name_en: "No extra", name_ar: "بدون إضافة", price_value: 0 };
  quantity = 1;
  if (orderNote) orderNote.value = "";
}

function createGiftButtons(container, items, clickHandler) {
  if (!container) return;
  container.innerHTML = "";

  const noExtraItem = {
    name_en: "No extra",
    name_ar: "بدون إضافة",
    price_value: 0
  };

  const allItems = [noExtraItem, ...(items || [])];

  allItems.forEach((item, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "gift-btn" + (index === 0 ? " active" : "");
    button.innerHTML = `
      <span class="option-name">${getLangText(item)}</span>
      <span class="option-price">${getPriceText(item)}</span>
    `;

    button.addEventListener("click", () => {
      clickHandler(item, button);

      [...container.children].forEach((child) => child.classList.remove("active"));
      button.classList.add("active");
    });

    container.appendChild(button);
  });
}

function createFlavorButtons(container, items, clickHandler) {
  if (!container) return;
  container.innerHTML = "";

  if (!items || !items.length) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "flavor-btn active";
    button.innerHTML = `
      <img src="${getSafeImage(selectedProduct?.image_url)}" alt="Standard">
      <span class="flavor-name">${currentLang === "ar" ? "الخيار الأساسي" : "Standard option"}</span>
      <span class="flavor-price">0 ${getCurrencyLabel()}</span>
    `;
    button.addEventListener("click", () => {
      selectedFlavor = {
        name_en: "Standard option",
        name_ar: "الخيار الأساسي",
        image_url: selectedProduct?.image_url || "",
        price_value: 0
      };
      modalImage.src = getSafeImage(selectedFlavor.image_url, getSafeImage(selectedProduct?.image_url));

      [...container.children].forEach((child) => child.classList.remove("active"));
      button.classList.add("active");
      updateSummary();
    });
    container.appendChild(button);
    return;
  }

  items.forEach((item, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "flavor-btn" + (index === 0 ? " active" : "");
    button.innerHTML = `
      <img src="${getSafeImage(item.image_url, getSafeImage(selectedProduct?.image_url))}" alt="${item.name_en || "Flavor"}">
      <span class="flavor-name">${getLangText(item)}</span>
      <span class="flavor-price">${getPriceText(item)}</span>
    `;

    button.addEventListener("click", () => clickHandler(item, button));
    container.appendChild(button);
  });
}

function updateSummary() {
  if (!selectedProduct) return;

  const productName = getProductName(selectedProduct);
  const flavorPrice = Number(selectedFlavor?.price_value || 0);
  const giftPrice = Number(selectedGift?.price_value || 0);
  const totalPrice = (flavorPrice + giftPrice) * quantity;

  summaryProduct.textContent = productName;
  summaryFlavor.textContent = selectedFlavor ? getLangText(selectedFlavor) : "-";
  summaryPrice.textContent = selectedFlavor ? getPriceText(selectedFlavor) : `0 ${getCurrencyLabel()}`;
  summaryGift.textContent = selectedGift ? getLangText(selectedGift) : (currentLang === "ar" ? "بدون إضافة" : "No extra");
  summaryGiftPrice.textContent = selectedGift ? getPriceText(selectedGift) : `0 ${getCurrencyLabel()}`;
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

function renderModalContent() {
  if (!selectedProduct) return;

  modalTitle.textContent = getProductName(selectedProduct);
  modalDescription.textContent = getProductDescription(selectedProduct);

  const flavorImage = selectedFlavor?.image_url || selectedProduct.image_url;
  modalImage.src = getSafeImage(flavorImage, getSafeImage(selectedProduct.image_url));
  modalImage.alt = getProductName(selectedProduct);

  createFlavorButtons(flavorOptions, selectedProduct.product_flavors, (item, button) => {
    selectedFlavor = item;
    modalImage.src = getSafeImage(item.image_url, getSafeImage(selectedProduct.image_url));
    modalImage.alt = getLangText(item);

    [...flavorOptions.children].forEach((child) => child.classList.remove("active"));
    button.classList.add("active");
    updateSummary();
  });

  createGiftButtons(giftOptions, selectedProduct.product_gifts, (item) => {
    selectedGift = item;
    updateSummary();
  });

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
  orderNote.addEventListener("input", () => {
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
    const noteText = currentLang === "ar" ? item.noteAr || "" : item.noteEn || "";

    itemEl.innerHTML = `
      <h4>${productName}</h4>
      <div class="cart-meta">${currentLang === "ar" ? "النكهة" : "Flavor"}: ${flavorName}</div>
      <div class="cart-meta">${currentLang === "ar" ? "الهدية" : "Gift"}: ${giftName}</div>
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
      (Number(selectedFlavor?.price_value || 0) + Number(selectedGift?.price_value || 0)) * quantity;

    cart.push({
      productEn: selectedProduct.name_en || "",
      productAr: selectedProduct.name_ar || selectedProduct.name_en || "",
      flavorEn: selectedFlavor?.name_en || "Standard option",
      flavorAr: selectedFlavor?.name_ar || "الخيار الأساسي",
      giftEn: selectedGift?.name_en || "No extra",
      giftAr: selectedGift?.name_ar || "بدون إضافة",
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
      const noteBlock = item.noteEn || item.noteAr
        ? currentLang === "ar"
          ? `ملاحظات: ${item.noteAr || item.noteEn}`
          : `Notes: ${item.noteEn || item.noteAr}`
        : "";

      if (currentLang === "ar") {
        return `${index + 1}) ${item.productAr}
النكهة: ${item.flavorAr}
الهدية: ${item.giftAr}
الكمية: ${item.quantity}
${noteBlock ? noteBlock + "\n" : ""}السعر: ${item.totalValue} درهم`;
      }

      return `${index + 1}) ${item.productEn}
Flavor: ${item.flavorEn}
Gift: ${item.giftEn}
Qty: ${item.quantity}
${noteBlock ? noteBlock + "\n" : ""}Price: ${item.totalValue} AED`;
    });

    const message = currentLang === "ar"
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

    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank");
  });
}

if (sendOrderBtn) {
  sendOrderBtn.addEventListener("click", () => {
    if (!selectedProduct) return;

    const productName = getProductName(selectedProduct);
    const flavorName = selectedFlavor ? getLangText(selectedFlavor) : "-";
    const flavorPrice = selectedFlavor ? getPriceText(selectedFlavor) : `0 ${getCurrencyLabel()}`;
    const giftName = selectedGift ? getLangText(selectedGift) : (currentLang === "ar" ? "بدون إضافة" : "No extra");
    const giftPrice = selectedGift ? getPriceText(selectedGift) : `0 ${getCurrencyLabel()}`;
    const noteValue = orderNote?.value?.trim() || "";
    const totalPrice =
      (Number(selectedFlavor?.price_value || 0) + Number(selectedGift?.price_value || 0)) * quantity;

    const message = currentLang === "ar"
      ? `مرحباً 👋

أرغب في طلب:

الصنف: ${productName}
النكهة: ${flavorName}
سعر النكهة: ${flavorPrice}
خيار الهدية: ${giftName}
سعر الهدية: ${giftPrice}
الكمية: ${quantity}
${noteValue ? `ملاحظات: ${noteValue}\n` : ""}الإجمالي التقريبي: ${totalPrice} ${getCurrencyLabel()}

شكراً`
      : `Hello 👋

I would like to place an order:

Item: ${productName}
Flavor: ${flavorName}
Flavor Price: ${flavorPrice}
Gift Option: ${giftName}
Gift Price: ${giftPrice}
Quantity: ${quantity}
${noteValue ? `Notes: ${noteValue}\n` : ""}Estimated Total: ${totalPrice} ${getCurrencyLabel()}

Thank you`;

    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank");
  });
}

renderCart();
setLanguage("en");
loadProductsFromDB();