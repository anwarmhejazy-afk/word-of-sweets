const db = window.db;

// Elements
const appLoader = document.getElementById("appLoader");
const adminShell = document.getElementById("adminShell");

const loginCard = document.getElementById("loginCard");
const dashboard = document.getElementById("dashboard");
const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");
const logoutBtn = document.getElementById("logoutBtn");

const productsList = document.getElementById("productsList");

// Helper
function showMessage(message, isError = false) {
  loginMessage.textContent = message;
  loginMessage.style.color = isError ? "red" : "green";
}

// 🔥 CHECK SESSION
async function checkSession() {
  try {
    const {
      data: { session },
      error,
    } = await db.auth.getSession();

    if (error) throw error;

    appLoader.classList.add("hidden");
    adminShell.classList.remove("hidden");

    if (session) {
      loginCard.classList.add("hidden");
      dashboard.classList.remove("hidden");
      await loadProducts();
    } else {
      loginCard.classList.remove("hidden");
      dashboard.classList.add("hidden");
    }
  } catch (error) {
    console.error("checkSession failed:", error);
    showMessage("Failed to load session", true);

    appLoader.classList.add("hidden");
    adminShell.classList.remove("hidden");
    loginCard.classList.remove("hidden");
  }
}

// 🔥 LOGIN
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const { error } = await db.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    showMessage("Login successful");
    loginCard.classList.add("hidden");
    dashboard.classList.remove("hidden");

    await loadProducts();
  } catch (error) {
    console.error("Login failed:", error);
    showMessage(error.message, true);
  }
});

// 🔥 LOGOUT
logoutBtn.addEventListener("click", async () => {
  try {
    const { error } = await db.auth.signOut();
    if (error) throw error;

    dashboard.classList.add("hidden");
    loginCard.classList.remove("hidden");
    showMessage("Logged out");
  } catch (error) {
    console.error("Logout failed:", error);
  }
});

// 🔥 LOAD PRODUCTS
async function loadProducts() {
  try {
    const { data, error } = await db
      .from("products")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) throw error;

    renderProducts(data);
  } catch (error) {
    console.error("Load products failed:", error);
  }
}

// 🔥 RENDER PRODUCTS
function renderProducts(products) {
  if (!productsList) return;

  productsList.innerHTML = "";

  products.forEach((product) => {
    const div = document.createElement("div");
    div.textContent = `${product.name_en} (${product.slug})`;
    productsList.appendChild(div);
  });
}

// INIT
checkSession();