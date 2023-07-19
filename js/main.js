// Cache DOM elements
const submitBtn = document.querySelector(".form-fotter button");
const daysInput = document.querySelector("#day");
const monthsInput = document.querySelector("#month");
const yearsInput = document.querySelector("#year");
const formInputs = document.querySelectorAll("form input");
const formLabels = document.querySelectorAll("form label");
const ageSection = document.querySelector("section");

const date = new Date();

// Event listener setup
submitBtn.addEventListener("click", handleFormSubmit);

function handleFormSubmit() {
  removeError();
  formInputs.forEach((input) => {
    if (input.value === "") {
      showEmptyInputError(input);
    }
  });

  const day = parseInt(daysInput.value) || "";
  const month = parseInt(monthsInput.value) || "";
  const year = parseInt(yearsInput.value) || "";

  if (day > getMonthDays(year, month) || day <= 0) {
    if (month !== "" && year !== "") {
      showInvalidError(daysInput, "invalid-day", "Must be a valid day");
    }
  } else if (month > 12 || month <= 0) {
    showInvalidError(monthsInput, "invalid-month", "Must be a valid month");
  } else if (year > date.getFullYear() || year <= 0) {
    showInvalidError(yearsInput, "invalid-year", "Must be in the past");
  } else if (year === date.getFullYear() && month > date.getMonth() + 1) {
    showInvalidError(monthsInput, "invalid-month", "Must be in the past");
  } else if (year === date.getFullYear() && day > date.getDate()) {
    showInvalidError(daysInput, "invalid-day", "Must be in the past");
  } else {
    if (month !== "" && year !== "" && day !== "") {
      displayColors("hsl(0, 0%, 86%)", "hsl(0, 1%, 44%)");
      calculateAndDisplayAge();
    }
  }
}

function displayColors(borderColor, labelColor) {
  formInputs.forEach((input) => {
    input.style.borderColor = borderColor;
  });
  formLabels.forEach((label) => {
    label.style.color = labelColor;
  });
}

function showEmptyInputError(input) {
  const error = createError("error-empty");
  error.textContent = "This field is required";
  displayColors("hsl(0, 100%, 67%)", "hsl(0, 100%, 67%)");
  input.parentElement.appendChild(error);
}

function showInvalidError(input, errorName, errorContent) {
  if (input.value !== "") {
    const error = createError(errorName);
    displayColors("hsl(0, 100%, 67%)", "hsl(0, 100%, 67%)");
    error.textContent = errorContent;
    input.parentElement.appendChild(error);
  }
}

function removeError() {
  document.querySelectorAll(".error").forEach((error) => {
    error.remove();
  });
}

function createError(errorName) {
  const errorContainer = document.createElement("p");
  errorContainer.className = `error ${errorName}`;
  return errorContainer;
}

function getMonthDays(year, month) {
  const nextMonth = new Date(year, month, 1);
  nextMonth.setDate(nextMonth.getDate() - 1);
  return nextMonth.getDate();
}

function calculateAndDisplayAge() {
  const years = calculateYears();
  const months = calculateMonths();
  const days = calculateDays();

  const monthsEndWith30 = [4, 6, 9, 11];
  const monthsEndWith31 = [1, 3, 5, 7, 8, 10, 12];

  let adjustedMonths = months;
  let adjustedDays = days;

  if (monthsEndWith30.includes(parseInt(monthsInput.value)) && days >= 30) {
    adjustedMonths++;
    adjustedDays -= 30;
  } else if (parseInt(monthsInput.value) === 2 && days >= 28) {
    adjustedMonths++;
    adjustedDays -= 28;
  } else if (
    monthsEndWith31.includes(parseInt(monthsInput.value)) &&
    days >= 31
  ) {
    adjustedMonths++;
    adjustedDays -= 31;
  }

  const adjustedYears = years + Math.floor(adjustedMonths / 12);
  const finalMonths = adjustedMonths % 12;

  ageSection.querySelector("span#years").textContent = adjustedYears;
  ageSection.querySelector("span#months").textContent = finalMonths;
  ageSection.querySelector("span#days").textContent = adjustedDays;
}

function calculateYears() {
  if (date.getFullYear() === parseInt(yearsInput.value)) {
    return 0;
  } else {
    return date.getFullYear() - parseInt(yearsInput.value) - 1;
  }
}

function calculateMonths() {
  if (date.getFullYear() === parseInt(yearsInput.value)) {
    return date.getMonth() + 1 - parseInt(monthsInput.value);
  } else {
    return 12 - parseInt(monthsInput.value) + date.getMonth();
  }
}

function calculateDays() {
  let day =
    getMonthDays(parseInt(yearsInput.value), parseInt(monthsInput.value)) -
    parseInt(daysInput.value) +
    date.getDate();
  if (
    date.getFullYear() === parseInt(yearsInput.value) &&
    date.getMonth() + 1 === parseInt(monthsInput.value)
  ) {
    day = date.getDate() - parseInt(daysInput.value);
  }
  return day;
}