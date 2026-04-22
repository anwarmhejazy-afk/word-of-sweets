const supabase = window.supabase;

const loginCard = document.getElementById("loginCard");
const dashboard = document.getElementById("dashboard");
const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");
const logoutBtn = document.getElementById("logoutBtn");
const productForm = document.getElementById("productForm");
const productsList = document.getElementById("productsList");

function showMessage(message = "", isError = false) {
  if (!loginMessage) return;
  loginMessage.textContent = message;
  loginMessage.style.color = isError ? "#b04b4b" : "#2f7a45";
}

async function checkSession() {
  try {
    if (!supabase) {
      showMessage("Supabase is not connected.", true);
      console.error("Supabase client missing");
      return;
    }

    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error("Session error:", error);
      showMessage(error.message, true);
      return;
    }

    if (data.session) {
      loginCard.classList.add("hidden");
      dashboard.classList.remove("hidden");
      await loadProducts();
    } else {
      loginCard.classList.remove("hidden");
      dashboard.classList.add("hidden");
    }
  } catch (err) {
    console.error("checkSession error:", err);
    showMessage(err.message || "Session check failed", true);
  }
}

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    if (!supabase) {
      alert("Supabase is not connected.");
      return;
    }

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    console.log("LOGIN RESPONSE:", data, error);

    if (error) {
      showMessage(error.message, true);
      alert(error.message);
      return;
    }

    showMessage("");
    alert("Login successful");
    await checkSession();
  } catch (err) {
    console.error("Login error:", err);
    showMessage(err.message || "Login failed", true);
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
    console.error("Logout error:", err);
    alert(err.message || "Logout failed");
  }
});

productForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    const payload = {
      slug: document.getElementById("slug").value.trim(),
      name_en: document.getElementById("nameEn").value.trim(),
      name_ar: document.getElementById("nameAr").value.trim(),
      desc_en: document.getElementById("descEn").value.trim(),
      desc_ar: document.getElementById("descAr").value.trim(),
      image_url: document.getElementById("imageUrl").value.trim(),
      sort_order: Number(document.getElementById("sortOrder").value || 0),
      is_active: document.getElementById("isActive").checked
    };

    const { error } = await supabase.from("products").insert([payload]);

    if (error) {
      alert(error.message);
      return;
    }

    productForm.reset();
    document.getElementById("isActive").checked = true;
    document.getElementById("sortOrder").value = 0;

    await loadProducts();
  } catch (err) {
    console.error("Save product error:", err);
    alert(err.message || "Could not save product");
  }
});

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

    productsList.innerHTML = "";

    data.forEach((product) => {
      const item = document.createElement("div");
      item.className = "product-admin-card";
      item.innerHTML = `
        <strong>${product.name_en}</strong><br>
        <small>${product.name_ar}</small><br>
        <small>Slug: ${product.slug}</small><br>
        <small>Active: ${product.is_active}</small><br>
        <small>Image: ${product.image_url || "-"}</small>
      `;
      productsList.appendChild(item);
    });
  } catch (err) {
    console.error("Load products error:", err);
    productsList.innerHTML = `<p>${err.message || "Could not load products"}</p>`;
  }
}

checkSession();