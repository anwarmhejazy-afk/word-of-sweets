const db = window.db;

const appLoader = document.getElementById("appLoader");
const adminShell = document.getElementById("adminShell");
const loginCard = document.getElementById("loginCard");
const dashboard = document.getElementById("dashboard");
const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");
const logoutBtn = document.getElementById("logoutBtn");
const productsList = document.getElementById("productsList");

function showMessage(message, isError = false) {
  if (!loginMessage) return;
  loginMessage.textContent = message;
  loginMessage.style.color = isError ? "#c0392b" : "#2e7d32";
}

function showLogin() {
  if (appLoader) appLoader.classList.add("hidden");
  if (adminShell) adminShell.classList.remove("hidden");
  if (loginCard) loginCard.classList.remove("hidden");
  if (dashboard) dashboard.classList.add("hidden");
}

function showDashboard() {
  if (appLoader) appLoader.classList.add("hidden");
  if (adminShell) adminShell.classList.remove("hidden");
  if (loginCard) loginCard.classList.add("hidden");
  if (dashboard) dashboard.classList.remove("hidden");
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
      productsList.innerHTML = `<p style="color:#c0392b;">Failed to load products.</p>`;
    }
  }
}

function renderProducts(products) {
  if (!productsList) return;

  if (!products.length) {
    productsList.innerHTML = `<p>No products found.</p>`;
    return;
  }

  productsList.innerHTML = products
    .map(
      (product) => `
        <div class="panel" style="margin-bottom:12px;">
          <strong>${product.name_en || "No name"}</strong><br />
          <small>Slug: ${product.slug || "-"}</small>
        </div>
      `
    )
    .join("");
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

    try {
      const { error } = await db.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      showMessage("");
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
      showMessage("Logged out.");
    } catch (error) {
      console.error("Logout failed:", error);
      showMessage(error.message || "Logout failed.", true);
    }
  });
}

checkSession();