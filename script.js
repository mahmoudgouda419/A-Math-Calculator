class Calculator {
  constructor(previousOperandText, currentOperandText) {
    this.previousOperandText = previousOperandText;
    this.currentOperandText = currentOperandText;
    this.clear();
  }

  clear() {
    this.currentOperand = "";
    this.previousOperand = "";
    this.operation = undefined;
  }

  percent() {
    this.currentOperand = this.currentOperand / 100;
  }

  appendNumber(num) {
    if (num === "." && this.currentOperand.includes(".")) return;
    this.currentOperand = this.currentOperand + num;
  }

  selectOperator(operation) {
    if (this.currentOperand === "") return;
    if (this.previousOperand !== "") {
      this.calculate();
    }

    this.operation = operation;
    this.previousOperand = this.currentOperand;
    this.currentOperand = "";
  }

  calculate() {
    let compute;
    let previous = parseFloat(this.previousOperand);
    let current = parseFloat(this.currentOperand);
    if (isNaN(previous) || isNaN(current)) return;
    switch (this.operation) {
      case "+":
        compute = previous + current;
        break;
      case "-":
        compute = previous - current;
        break;
      case "×":
        compute = previous * current;
        break;
      case "÷":
        compute = previous / current;
        break;
      default:
        return;
    }
    this.currentOperand = compute;
    this.operation = undefined;
    this.previousOperand = "";
  }

  updateScreen() {
    this.currentOperandText.innerText = this.currentOperand;
    if (this.operation !== undefined) {
      this.previousOperandText.innerText = `${this.previousOperand} ${this.operation}`;
    } else {
      this.previousOperandText.innerText = "";
    }
  }
}

const numberBtns = document.querySelectorAll("[data-number]");
const operatorBtns = document.querySelectorAll("[data-operator]");
const equalsBtn = document.querySelector("[data-equals]");
const percentBtn = document.querySelector("[data-percent]");
const clearBtn = document.querySelector("[data-clear]");
const previousOperandText = document.querySelector("[data-previous-operand]");
const currentOperandText = document.querySelector("[data-current-operand]");

const calc = new Calculator(previousOperandText, currentOperandText);
numberBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    calc.appendNumber(btn.innerText);
    calc.updateScreen();
  });
});
operatorBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    calc.selectOperator(btn.innerText);
    calc.updateScreen();
  });
});
equalsBtn.addEventListener("click", () => {
  calc.calculate();
  calc.updateScreen();
});
clearBtn.addEventListener("click", () => {
  calc.clear();
  calc.updateScreen();
});
percentBtn.addEventListener("click", () => {
  calc.percent();
  calc.updateScreen();
});


const modeBtns = document.querySelectorAll(".mode-btn");
const calculatorPage = document.querySelector(".calculator-page");
const tipPage = document.querySelector(".tip-page");
const currencyPage = document.querySelector(".currency-page");

modeBtns.forEach(btn=>{
  btn.addEventListener("click",()=>{
    modeBtns.forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    calculatorPage.classList.add("hidden");
    tipPage.classList.add("hidden");
    currencyPage.classList.add("hidden");
    switch(btn.dataset.mode){
      case "calculator":
        calculatorPage.classList.remove("hidden");
        break;
      case "tip":
        tipPage.classList.remove("hidden");
        break;
      case "currency":
        currencyPage.classList.remove("hidden");
        break;
    }
  });
});

const billInput = document.getElementById("bill");
const tipInput = document.getElementById("tip");
const calcTipBtn = document.getElementById("calcTip");
const tipAmount = document.getElementById("tipAmount");
const totalAmount = document.getElementById("totalAmount");

calcTipBtn.addEventListener("click", () => {
  const bill = Number(billInput.value);
  const tip = Number(tipInput.value);
  if (isNaN(bill) || isNaN(tip) || bill < 0 || tip < 0)  {
    tipAmount.textContent = "0$";
    totalAmount.textContent = "0$";
    return;
  }
  const tipValue = bill * tip/100;
  const total = bill + tipValue;
  tipAmount.textContent = `$${tipValue.toFixed(2)}`;
  totalAmount.textContent = `$${total.toFixed(2)}`;
})

const amount = document.getElementById("amount");
const fromCurrency = document.getElementById("fromCurrency");
const toCurrency = document.getElementById("toCurrency");
const convertBtn = document.getElementById("convertBtn");
const currencyResult = document.getElementById("currencyResult");
const swapBtn = document.getElementById("swapCurrencies");

swapBtn.addEventListener("click", () => {
  [fromCurrency.value, toCurrency.value] =
      [toCurrency.value, fromCurrency.value];
});
convertBtn.addEventListener("click", async () => {
  if (!amount.value) return;
  try {
    const response = await fetch(
        `https://api.frankfurter.dev/v2/rate/${fromCurrency.value}/${toCurrency.value}`
    );
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
    const result = (Number(amount.value) * data.rate).toFixed(2);
    currencyResult.textContent =
        `${amount.value} ${fromCurrency.value} = ${result} ${toCurrency.value}`;
  } catch (error) {
    console.error(error);
    currencyResult.textContent = "Conversion failed";
  }
});


async function loadCurrencies() {
  try {
    const response = await fetch("https://api.frankfurter.dev/v2/currencies");
    const currencies = await response.json();
    const optionsHTML = currencies
        .map((c) => `<option value="${c.iso_code}">${c.iso_code} — ${c.name}</option>`)
        .join("");
    fromCurrency.innerHTML = optionsHTML;
    toCurrency.innerHTML = optionsHTML;
    fromCurrency.value = "USD";
    toCurrency.value = "EGP";
  } catch (error) {
    console.error("Failed to load currencies:", error);
  }
}

loadCurrencies();