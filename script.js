const initialProducts = [
  {
    id: 1,
    title: "Wireless Headphones",
    description: "Noise-canceling over-ear headphones with rich bass and 20-hour battery life.",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=640&q=80",
  },
  {
    id: 2,
    title: "Gaming Mouse",
    description: "Ergonomic RGB gaming mouse with adjustable DPI and six programmable buttons.",
    price: 39.5,
    image: "https://images.unsplash.com/photo-1527814050087-3793815479bd?auto=format&fit=crop&w=640&q=80",
  },
  {
    id: 3,
    title: "Mechanical Keyboard",
    description: "Compact mechanical keyboard with tactile switches and white backlighting.",
    price: 59.0,
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=640&q=80",
  },
];

let products = [...initialProducts];

const productGallery = document.getElementById("productGallery");
const productForm = document.getElementById("productForm");
const loadingAlert = document.getElementById("loadingAlert");
const loadSampleBtn = document.getElementById("loadSampleBtn");

const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const escapeHtml = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const cardTemplate = (product) => {
  const safeTitle = escapeHtml(product.title);
  const safeDescription = escapeHtml(product.description);
  // Swapped placeholder images for real Unsplash ones for a better modern look
  const imgUrl = product.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=640&q=80";

  return `
    <div class="col-12 col-md-6 col-xl-4">
      <article class="card h-100">
        <img src="${imgUrl}" class="card-img-top product-image" alt="Product Image" />
        <div class="card-body d-flex flex-column p-4">
          <div class="d-flex justify-content-between align-items-start mb-3">
            <h3 class="h5 card-title fw-bold mb-0">${safeTitle}</h3>
            <span class="badge price-badge">${usdFormatter.format(product.price)}</span>
          </div>
          <p class="card-text text-secondary">${safeDescription}</p>
          <div class="mt-auto d-flex gap-2 pt-3">
            <button type="button" class="btn btn-sm btn-primary flex-grow-1 py-2 fw-medium">View Details</button>
            <button type="button" class="btn btn-sm btn-outline-danger js-delete-product px-3" data-id="${product.id}">
              Delete
            </button>
          </div>
        </div>
      </article>
    </div>
  `;
};

const renderProducts = () => {
  if (products.length === 0) {
    productGallery.innerHTML = `
      <div class="col-12">
        <div class="alert custom-alert text-center py-5" role="alert">
          <p class="mb-0 text-muted">No products available. Add a product from the form below to get started.</p>
        </div>
      </div>
    `;
    return;
  }

  productGallery.innerHTML = products.map((product) => cardTemplate(product)).join("");
};

const toggleLoadingAlert = ({ visible, type = "info", message = "", spinner = false }) => {
  if (!visible) {
    loadingAlert.classList.add("d-none");
    loadingAlert.textContent = "";
    return;
  }

  // Updated to work better with the dark theme
  loadingAlert.className = `alert custom-alert border-${type}`;
  loadingAlert.classList.remove("d-none");

  const spinnerMarkup = spinner
    ? '<span class="spinner-border spinner-border-sm me-2 text-primary" role="status" aria-hidden="true"></span>'
    : "";

  loadingAlert.innerHTML = `${spinnerMarkup}${message}`;
};

productGallery.addEventListener("click", (event) => {
  const deleteButton = event.target.closest(".js-delete-product");
  if (!deleteButton) {
    return;
  }

  const idToDelete = deleteButton.dataset.id;
  products = products.filter((product) => String(product.id) !== idToDelete);
  renderProducts();
});

productForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!productForm.checkValidity()) {
    event.stopPropagation();
    productForm.classList.add("was-validated");
    return;
  }

  const nameInput = document.getElementById("productName");
  const priceInput = document.getElementById("productPrice");
  const descriptionInput = document.getElementById("productDescription");

  const newProduct = {
    id: Date.now(),
    title: nameInput.value.trim(),
    price: Number(priceInput.value),
    description: descriptionInput.value.trim(),
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=640&q=80",
  };

  const updatedProducts = [...products];
  updatedProducts.push(newProduct);
  products = updatedProducts;
  renderProducts();

  productForm.reset();
  productForm.classList.remove("was-validated");
});

const fetchSampleProducts = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: Date.now() + 1,
          title: "Smart Watch",
          description: "Fitness-focused smartwatch with heart-rate tracking and GPS support.",
          price: 99.99,
          image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=640&q=80",
        },
        {
          id: Date.now() + 2,
          title: "Portable Speaker",
          description: "Compact Bluetooth speaker with deep sound and splash-resistant body.",
          price: 49.99,
          image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=640&q=80",
        },
      ]);
    }, 1000);
  });

loadSampleBtn.addEventListener("click", async () => {
  loadSampleBtn.disabled = true;
  toggleLoadingAlert({
    visible: true,
    type: "primary",
    message: "Loading sample products...",
    spinner: true,
  });

  try {
    const sampleProducts = await fetchSampleProducts();
    const updatedProducts = [...products];
    updatedProducts.push(...sampleProducts);
    products = updatedProducts;
    renderProducts();
    toggleLoadingAlert({
      visible: true,
      type: "success",
      message: "Sample products loaded successfully.",
    });
  } catch (error) {
    console.error("Error while loading sample products:", error);
    toggleLoadingAlert({
      visible: true,
      type: "danger",
      message: "Something went wrong while loading sample products.",
    });
  } finally {
    setTimeout(() => {
      toggleLoadingAlert({ visible: false });
    }, 1500);

    loadSampleBtn.disabled = false;
  }
});

renderProducts();