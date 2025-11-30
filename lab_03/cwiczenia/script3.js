//Cwiczenie 3: Pobranie i wyświetlenie danych z API

const productsTableBody = document.getElementById("products-table-body");
const searchInput = document.getElementById("search-input");
const sortSelect = document.getElementById("sort-select");

let allProducts = [];

async function fetchProducts() {
  try {
    const response = await fetch("https://dummyjson.com/products");
    const data = await response.json();
    allProducts = data.products.slice(0, 30);
    renderTable(allProducts);
  } catch (error) {
    console.error("Błąd pobierania danych:", error);
  }
}

//renderowanie tabeli
function renderTable(products) {
  //wyczysc tabelę przed ponownym renderowaniem
  productsTableBody.innerHTML = "";
  products.forEach((product) => {
    const tr = document.createElement("tr");
    //zdjęcie
    const tdImg = document.createElement("td");
    const img = document.createElement("img");
    img.src = product.thumbnail;
    img.alt = product.title;
    img.classList.add("product-image");
    tdImg.appendChild(img);

    //tytuł
    const tdTitle = document.createElement("td");
    tdTitle.textContent = product.title;

    //opis
    const tdDesc = document.createElement("td");
    tdDesc.textContent = product.description;

    tr.appendChild(tdImg);
    tr.appendChild(tdTitle);
    tr.appendChild(tdDesc);
    productsTableBody.appendChild(tr);
  });
}

//filtrowanie i sortowanie
function filterAndSortProducts() {
  const searchTerm = searchInput.value.toLowerCase();
  const sortValue = sortSelect.value;

  //filtrowanie
  let filtered = allProducts.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm) ||
      p.description.toLowerCase().includes(searchTerm)
  );

  //sortowanie
  if (sortValue === "asc") {
    filtered.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortValue === "desc") {
    filtered.sort((a, b) => b.title.localeCompare(a.title));
  } else {
    filtered.sort((a, b) => a.id - b.id);
  }

  renderTable(filtered);
}

//event listenery

searchInput.addEventListener("input", filterAndSortProducts);
sortSelect.addEventListener("change", filterAndSortProducts);

fetchProducts();
