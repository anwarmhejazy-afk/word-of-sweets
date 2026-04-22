const db = window.db;

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

const productIdInput = document.getElementById("productId");
const slugInput = document.getElementById("slug");
const nameEnInput = document.getElementById("nameEn");
const nameArInput = document.getElementById("nameAr");
const descEnInput = document.getElementById("descEn");
const descArInput = document.getElementById("descAr");
const imageUrlInput = document.getElementById("imageUrl");
const sortOrderInput = document.getElementById("sortOrder");
const isActiveInput = document.getElementById("isActive");

function showMessage(message = "", isError = false) {
  if (!loginMessage) return;
  loginMessage.textContent = message;
  loginMessage.style.color = isError ? "#b04b4b" : "#2e7d32";
}

function hideLoader() {
  if (appLoader) appLoader.classList.add("hidden");
}

function showShell() {
  if (adminShell) adminShell.classList.remove("hidden");
}

function showLogin() {
  hideLoader();
  showShell();
  loginCard.classList.remove("hidden");
  dashboard.classList.add("hidden");
}

function showDashboard() {
  hideLoader();
  showShell();
  loginCard.classList.add("hidden");
  dashboard.classList.remove("hidden");
}

function resetForm() {
  productForm.reset();
  productIdInput.value = "";
  sortOrderInput.value = 0;
  isActiveInput.checked = true;
  formTitle.textContent = "Add Product";
  cancelEditBtn.classList.add("hidden");
}

function fillForm(product) {
  productIdInput.value = product.id || "";
  slugInput.value = product.slug || "";
  nameEnInput.value = product.name_en || "";
  nameArInput.value = product.name_ar || "";
  descEnInput.value = product.desc_en || "";
  descArInput.value = product.desc_ar || "";
  imageUrlInput.value = product.image_url || "";
  sortOrderInput.value = product.sort_order ?? 0;
  isActiveInput.checked = !!product.is_active;

  formTitle.textContent = "Edit Product";
  cancelEditBtn.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderProducts(products) {
  if (!productsList) return;

  if (!products || !products.length) {
    productsList.innerHTML = "<p>No products found.</p>";
    return;
  }

  productsList.innerHTML = products
    .map(
      (product) => `
        <div class="product-admin-card">
          <div class="product-admin-top">
            <div class="product-admin-main">
              <strong>${product.name_en || "No name"}</strong>
              <div class="product-admin-meta">Slug: ${product.slug || "-"}</div>
              <div class="product-admin-meta">Arabic: ${product.name_ar || "-"}</div>
              <div class="product-admin-meta">Image: ${product.image_url || "-"}</div>
              <div class="product-admin-meta">Sort Order: ${product.sort_order ?? 0}</div>
              <div class="product-admin-meta">Active: ${product.is_active ? "Yes" : "No"}</div>
            </div>
            <div class="product-admin-actions">
              <button type="button" class="small-btn edit-btn" data-id="${product.id}">Edit</button>
              <button type="button" class="small-btn delete-btn" data-id="${product.id}">Delete</button>
            </div>
          </div>
        </div>
      `
    )
    .join("");

  document.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      const { data, error } = await db
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Load single product failed:", error);
        return;
      }

      fillForm(data);
    });
  });

  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;

      const confirmed = window.confirm("Delete this product?");
      if (!confirmed) return;

      const { error } = await db.from("products").delete().eq("id", id);

      if (error) {
        console.error("Delete failed:", error);
        alert(error.message || "Delete failed.");
        return;
      }

      await loadProducts();
      resetForm();
    });
  });
}

async function loadProducts() {
  try {
    const { data, error } = await db
      .from("products")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) throw error;

    renderProducts(data || []);
  } catch (error) {
    console.error("Load products failed:", error);
    if (productsList) {
      productsList.innerHTML = "<p style='color:#b04b4b;'>Failed to load products.</p>";
    }
  }
}

async function checkSession() {
  try {
    const {
      data: { session },
      error,
    } = await db.auth.getSession();

    if (error) throw error;

    if (session) {
      showDashboard();
      await loadProducts();
    } else {
      showLogin();
    }
  } catch (error) {
    console.error("checkSession failed:", error);
    showLogin();
    showMessage("Failed to check session.", true);
  }
}

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email")?.value.trim();
    const password = document.getElementById("password")?.value;

    showMessage("");

    try {
      const { error } = await db.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      showDashboard();
      await loadProducts();
    } catch (error) {
      console.error("Login failed:", error);
      showLogin();
      showMessage(error.message || "Login failed.", true);
    }
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    try {
      const { error } = await db.auth.signOut();
      if (error) throw error;

      showLogin();
      resetForm();
      showMessage("Logged out.");
    } catch (error) {
      console.error("Logout failed:", error);
      showMessage(error.message || "Logout failed.", true);
    }
  });
}

if (cancelEditBtn) {
  cancelEditBtn.addEventListener("click", () => {
    resetForm();
  });
}

if (productForm) {
  productForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = productIdInput.value.trim();

    const payload = {
      slug: slugInput.value.trim(),
      name_en: nameEnInput.value.trim(),
      name_ar: nameArInput.value.trim(),
      desc_en: descEnInput.value.trim(),
      desc_ar: descArInput.value.trim(),
      image_url: imageUrlInput.value.trim(),
      sort_order: Number(sortOrderInput.value || 0),
      is_active: isActiveInput.checked,
    };

    try {
      let error = null;

      if (id) {
        ({ error } = await db.from("products").update(payload).eq("id", id));
      } else {
        ({ error } = await db.from("products").insert([payload]));
      }

      if (error) throw error;

      resetForm();
      await loadProducts();
    } catch (error) {
      console.error("Save failed:", error);
      alert(error.message || "Save failed.");
    }
  });
}

checkSession();