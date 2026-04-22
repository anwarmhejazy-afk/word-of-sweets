const supabase = window.supabaseClient;

const appLoader = document.getElementById("appLoader");
const adminShell = document.getElementById("adminShell");

const loginCard = document.getElementById("loginCard");
const dashboard = document.getElementById("dashboard");
const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");
const logoutBtn = document.getElementById("logoutBtn");

const productForm = document.getElementById("productForm");
const productsList = document.getElementById("productsList");

const formTitle = document.getElementById("formTitle");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const saveProductBtn = document.getElementById("saveProductBtn");

const productIdInput = document.getElementById("productId");
const slugInput = document.getElementById("slug");
const nameEnInput = document.getElementById("nameEn");
const nameArInput = document.getElementById("nameAr");
const descEnInput = document.getElementById("descEn");
const descArInput = document.getElementById("descAr");
const imageUrlInput = document.getElementById("imageUrl");
const sortOrderInput = document.getElementById("sortOrder");
const isActiveInput = document.getElementById("isActive");

let productsCache = [];

function showApp() {
  adminShell.style.display = "block";
  appLoader.style.display = "none";
}

function showMessage(message = "", isError = false) {
  if (!loginMessage) return;
  loginMessage.textContent = message;
  loginMessage.style.color = isError ? "#b04b4b" : "#2f7a45";
}

function resetForm() {
  productForm.reset();
  productIdInput.value = "";
  sortOrderInput.value = 0;
  isActiveInput.checked = true;
  formTitle.textContent = "Add Product";
  saveProductBtn.textContent = "Save Product";
  cancelEditBtn.classList.add("hidden");
  slugInput.disabled = false;
}

function fillForm(product) {
  productIdInput.value = product.id;
  slugInput.value = product.slug || "";
  nameEnInput.value = product.name_en || "";
  nameArInput.value = product.name_ar || "";
  descEnInput.value = product.desc_en || "";
  descArInput.value = product.desc_ar || "";
  imageUrlInput.value = product.image_url || "";
  sortOrderInput.value = product.sort_order ?? 0;
  isActiveInput.checked = !!product.is_active;

  formTitle.textContent = "Edit Product";
  saveProductBtn.textContent = "Update Product";
  cancelEditBtn.classList.remove("hidden");
  slugInput.disabled = true;

  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function checkSession() {
  try {
    if (!supabase) {
      console.error("Supabase client not found");
      showMessage("Supabase client not loaded.", true);
      loginCard.style.display = "block";
      dashboard.style.display = "none";
      showApp();
      return;
    }

    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error("Session error:", error);
      showMessage(error.message, true);
      loginCard.style.display = "block";
      dashboard.style.display = "none";
      showApp();
      return;
    }

    if (data.session) {
      loginCard.style.display = "none";
      dashboard.style.display = "block";
      await loadProducts();
    } else {
      loginCard.style.display = "block";
      dashboard.style.display = "none";
    }

    showApp();
  } catch (err) {
    console.error("checkSession failed:", err);
    showMessage(err.message || "Failed to load session", true);
    loginCard.style.display = "block";
    dashboard.style.display = "none";
    showApp();
  }
}

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      showMessage(error.message, true);
      alert(error.message);
      return;
    }

    showMessage("");
    await checkSession();
  } catch (err) {
    console.error("Login failed:", err);
    alert(err.message || "Login failed");
  }
});

logoutBtn.addEventListener("click", async () => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      alert(error.message);
      return;
    }

    await checkSession();
  } catch (err) {
    console.error("Logout failed:", err);
    alert(err.message || "Logout failed");
  }
});

cancelEditBtn.addEventListener("click", () => {
  resetForm();
});

productForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    const payload = {
      name_en: nameEnInput.value.trim(),
      name_ar: nameArInput.value.trim(),
      desc_en: descEnInput.value.trim(),
      desc_ar: descArInput.value.trim(),
      image_url: imageUrlInput.value.trim(),
      sort_order: Number(sortOrderInput.value || 0),
      is_active: isActiveInput.checked
    };

    const productId = productIdInput.value.trim();

    if (!productId) {
      payload.slug = slugInput.value.trim();
    }

    let response;

    if (productId) {
      response = await supabase
        .from("products")
        .update(payload)
        .eq("id", productId);
    } else {
      response = await supabase
        .from("products")
        .insert([payload]);
    }

    if (response.error) {
      alert(response.error.message);
      return;
    }

    resetForm();
    await loadProducts();
  } catch (err) {
    console.error("Save product failed:", err);
    alert(err.message || "Could not save product");
  }
});

async function deleteProduct(productId, productName) {
  const confirmed = window.confirm(`Delete "${productName}"?`);
  if (!confirmed) return;

  try {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", productId);

    if (error) {
      alert(error.message);
      return;
    }

    if (productIdInput.value === String(productId)) {
      resetForm();
    }

    await loadProducts();
  } catch (err) {
    console.error("Delete failed:", err);
    alert(err.message || "Could not delete product");
  }
}

function renderProducts(products) {
  productsList.innerHTML = "";

  if (!products.length) {
    productsList.innerHTML = "<p>No products found.</p>";
    return;
  }

  products.forEach((product) => {
    const item = document.createElement("div");
    item.className = "product-admin-card";

    item.innerHTML = `
      <div class="product-admin-top">
        <div>
          <strong>${product.name_en}</strong><br>
          <small>${product.name_ar}</small>
        </div>
        <div class="product-admin-actions">
          <button class="small-btn edit-btn" type="button" data-id="${product.id}">Edit</button>
          <button class="small-btn delete-btn" type="button" data-id="${product.id}">Delete</button>
        </div>
      </div>

      <div class="product-admin-meta"><b>Slug:</b> ${product.slug}</div>
      <div class="product-admin-meta"><b>Active:</b> ${product.is_active}</div>
      <div class="product-admin-meta"><b>Sort Order:</b> ${product.sort_order ?? 0}</div>
      <div class="product-admin-meta"><b>Image:</b> ${product.image_url || "-"}</div>
      <div class="product-admin-meta"><b>Description EN:</b> ${product.desc_en || "-"}</div>
      <div class="product-admin-meta"><b>Description AR:</b> ${product.desc_ar || "-"}</div>
    `;

    productsList.appendChild(item);
  });

  productsList.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const product = productsCache.find((item) => item.id === Number(btn.dataset.id));
      if (product) fillForm(product);
    });
  });

  productsList.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const product = productsCache.find((item) => item.id === Number(btn.dataset.id));
      if (product) deleteProduct(product.id, product.name_en);
    });
  });
}

async function loadProducts() {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      productsList.innerHTML = `<p>${error.message}</p>`;
      return;
    }

    productsCache = data || [];
    renderProducts(productsCache);
  } catch (err) {
    console.error("Load products failed:", err);
    productsList.innerHTML = `<p>${err.message || "Could not load products"}</p>`;
  }
}

resetForm();
checkSession();