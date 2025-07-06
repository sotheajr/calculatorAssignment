let current = "";
let previous = "";
let operator = "";
let isKhrToUsd = true;
let language = "kh";

const langText = {
  kh: {
    basic: "✴️ មូលដ្ឋាន",
    sci: "𝑓(x) វិទ្យាសាស្ត្រ",
    note: "📝 កំណត់សម្គាល់គណិត",
    convert: "ប្តូរប្រាក់",
    lang: "🌐 ភាសា (ខ្មែរ)",
    khr2usd: "ប្តូរពី KHR ⇄ USD",
    usd2khr: "ប្តូរពី USD ⇄ KHR",
    clear: "សម្អាត",
  },
  en: {
    basic: "✴️ Basic",
    sci: "𝑓(x) Scientific",
    note: "📝 Notes",
    convert: "Currency",
    lang: "🌐 Language (English)",
    khr2usd: "From KHR ⇄ USD",
    usd2khr: "From USD ⇄ KHR",
    clear: "AC",
  },
};

function updateDisplay(value) {
  $("#result").text(value);
  if ($("#currency-panel").is(":visible")) {
    convertCurrency(value);
  }
}

function calculate() {
  const prev = parseFloat(previous);
  const curr = parseFloat(current);
  if (isNaN(prev) || isNaN(curr)) return;

  let result;
  switch (operator) {
    case "+":
      result = prev + curr;
      break;
    case "−":
      result = prev - curr;
      break;
    case "×":
      result = prev * curr;
      break;
    case "÷":
      result = curr !== 0 ? prev / curr : "កំហុស";
      break;
    case "%":
      result = prev % curr;
      break;
  }

  current = result.toString();
  operator = "";
  previous = "";
  $("#operation-hint").text("");
  updateDisplay(current);
}

function convertCurrency(value) {
  const rate = 4000;
  const num = parseFloat(value);
  if (!isNaN(num)) {
    const converted = isKhrToUsd
      ? (num / rate).toFixed(2) + " USD"
      : (num * rate).toLocaleString() + " ៛";
    $("#converted-currency").val(converted);
  } else {
    $("#converted-currency").val("");
  }
}

function updateLanguageUI() {
  const text = langText[language];
  $("#basic-mode").text(text.basic);
  $("#sci-mode").text(text.sci);
  $("#note-mode").text(text.note);
  $("#convert-label").text(text.convert);
  $("#toggle-language").text(text.lang);
  $("#currency-text").text(isKhrToUsd ? text.khr2usd : text.usd2khr);
  $("#btn-clear").text(text.clear);
}

$(document).ready(function () {
  $(".btn").on("click", function () {
    const btn = $(this).text().trim();

    if (btn === "សម្អាត" || btn === "AC") {
      current = "";
      previous = "";
      operator = "";
      updateDisplay("0");
      $("#operation-hint").text("");
    } else if (btn === "+/-") {
      if (current) {
        current = (-parseFloat(current)).toString();
        updateDisplay(current);
      }
    } else if (["+", "−", "×", "÷", "%"].includes(btn)) {
      if (current) {
        previous = current;
        operator = btn;
        current = "";
        $("#operation-hint").text(`${previous} ${operator}`);
      }
    } else if (btn === "=") {
      calculate();
    } else {
      current += btn;
      updateDisplay(current);
    }
  });

  $("#toggle-convert").on("change", function () {
    if ($(this).is(":checked")) {
      $("#currency-panel").slideDown();
      convertCurrency(current || "0");
    } else {
      $("#currency-panel").slideUp();
    }
  });

  $("#switch-currency").on("click", function () {
    isKhrToUsd = !isKhrToUsd;
    convertCurrency(current || "0");
    updateLanguageUI();
  });

  $("#toggle-language").on("click", function () {
    language = language === "kh" ? "en" : "kh";
    updateLanguageUI();
  });

  // បន្ទាប់ពីទំព័រត្រូវបាន loaded អាប់ដេត UI ភាសា និង ប្តូរប្រាក់
  updateLanguageUI();
});
