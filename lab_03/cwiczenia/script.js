//Ćwiczenie 1: Stoper

let timerInterval = null;
let timeInSeconds = 0;

const display = document.getElementById("stopwatch-display");
const btnStart = document.getElementById("btn-start");
const btnStop = document.getElementById("btn-stop");
const btnReset = document.getElementById("btn-reset");

function formatTime(seconds) {
  if (seconds < 60) {
    return `${seconds}s`;
  } else {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  }
}

function updateDisplay() {
  display.textContent = formatTime(timeInSeconds);
}

btnStart.addEventListener("click", () => {
  if (!timerInterval) {
    timerInterval = setInterval(() => {
      timeInSeconds++;
      updateDisplay();
    }, 1000);
  }
});

btnStop.addEventListener("click", () => {
  clearInterval(timerInterval);
  timerInterval = null;
});

btnReset.addEventListener("click", () => {
  clearInterval(timerInterval);
  timerInterval = null;
  timeInSeconds = 0;
  updateDisplay();
});

//Ćwiczenie 2: generator haseł

const inputMin = document.getElementById("pass-min");
const inputMax = document.getElementById("pass-max");
const checkUpper = document.getElementById("pass-upper");
const checkSpecial = document.getElementById("pass-special");
const btnGenerate = document.getElementById("btn-generate");

btnGenerate.addEventListener("click", () => {
  const min = parseInt(inputMin.value);
  const max = parseInt(inputMax.value);

  if (min > max) {
    alert("Minimalna długość nie może być większa niż maksymalna.");
    return;
  }

  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const special = "!@#$%^&*()_+-=[]{}|;:',.<>/?";

  let allowedChars = lowercase;
  if (checkUpper.checked) allowedChars += uppercase;
  if (checkSpecial.checked) allowedChars += special;

  const passwordLength = Math.floor(Math.random() * (max - min + 1)) + min;
  let password = "";
  for (let i = 0; i < passwordLength; i++) {
    const randomIndex = Math.floor(Math.random() * allowedChars.length);
    password += allowedChars[randomIndex];
  }
  alert(`Wygenerowane hasło: ${password}`);
});

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
