const loginCard = document.getElementById("loginCard");
const dashboard = document.getElementById("dashboard");
const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");
const logoutBtn = document.getElementById("logoutBtn");
const productForm = document.getElementById("productForm");
const productsList = document.getElementById("productsList");

async function checkSession() {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    console.error(error);
    loginMessage.textContent = error.message;
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
}

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    loginMessage.textContent = error.message;
    return;
  }

  loginMessage.textContent = "";
  await checkSession();
});

logoutBtn.addEventListener("click", async () => {
  await supabase.auth.signOut();
  await checkSession();
});

productForm.addEventListener("submit", async (e) => {
  e.preventDefault();

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
});

async function loadProducts() {
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
}

checkSession();