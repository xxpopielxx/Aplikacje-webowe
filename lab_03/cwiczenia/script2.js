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
