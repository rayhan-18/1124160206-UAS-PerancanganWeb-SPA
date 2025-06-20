// ========== Element Referensi ==========
const toggleBtn = document.getElementById("darkModeToggle");
const htmlElement = document.documentElement;
const form = document.getElementById("paymentForm");
const productSelect = document.getElementById("productSelect");
const quantityInput = document.getElementById("quantity");
const promoInput = document.getElementById("promoCode");
const applyPromoBtn = document.getElementById("applyPromoBtn");
const promoMessage = document.getElementById("promoMessage");
const subtotalEl = document.getElementById("subtotal");
const discountRow = document.getElementById("discountRow");
const discountEl = document.getElementById("discount");
const totalAmountEl = document.getElementById("totalAmount");
const transactionList = document.getElementById("transactionList");
const emptyState = document.getElementById("emptyState");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");
const totalTransactionsEl = document.getElementById("totalTransactions");
const totalRevenueEl = document.getElementById("totalRevenue");
const avgTransactionEl = document.getElementById("avgTransaction");
const transactionTemplate = document.getElementById("transactionTemplate");
const submitBtn = document.getElementById("submitBtn");

// ========== Modal ==========
const successModal = document.getElementById("successModal");
const closeSuccessModal = document.getElementById("closeSuccessModal");
const progressBar = document.getElementById("progressBar");
const printInvoiceBtn = document.getElementById("printInvoiceBtn");

// ========== Audio Notifikasi ==========
const audioSuccess = new Audio("https://cdn.pixabay.com/audio/2022/03/15/audio_9ff8b75a89.mp3");

// ========== Promo Code ==========
let promoDiscount = 0;
const PROMO_CODES = {
  "HAUS10": 0.1,
  "MINUM20": 0.2
};

// ========== Toggle Dark Mode ==========
toggleBtn?.addEventListener("click", () => {
  htmlElement.classList.toggle("dark");
});

// ========== Format Rupiah ==========
function formatRupiah(angka) {
  return `Rp ${angka.toLocaleString("id-ID")}`;
}

// ========== Hitung Total ==========
function updateTotal() {
  const product = productSelect.options[productSelect.selectedIndex];
  const price = parseInt(product.dataset.price || 0);
  const qty = parseInt(quantityInput.value || 1);
  const subtotal = price * qty;
  const discount = subtotal * promoDiscount;
  const total = subtotal - discount;

  subtotalEl.textContent = formatRupiah(subtotal);
  discountEl.textContent = formatRupiah(discount);
  totalAmountEl.textContent = formatRupiah(total);
  discountRow.classList.toggle("hidden", promoDiscount === 0);

  return { subtotal, discount, total };
}

// ========== Validasi Form ==========
function validateFormFields() {
  const name = form.customerName.value.trim();
  const email = form.customerEmail.value.trim();
  const product = productSelect.value;
  const qty = parseInt(quantityInput.value || "0");
  const method = form.paymentMethod.value;
  const isValid = name && email.includes("@") && product && qty > 0 && method;

  if (submitBtn) {
    submitBtn.disabled = !isValid;
    submitBtn.classList.toggle("opacity-50", !isValid);
    submitBtn.classList.toggle("cursor-not-allowed", !isValid);
  }
}

// ========== Event: Update Harga & Validasi ==========
productSelect.addEventListener("change", () => {
  updateTotal();
  validateFormFields();
});
quantityInput.addEventListener("input", () => {
  updateTotal();
  validateFormFields();
});
form.customerName.addEventListener("input", validateFormFields);
form.customerEmail.addEventListener("input", validateFormFields);
document.querySelectorAll('input[name="paymentMethod"]').forEach(el =>
  el.addEventListener("change", validateFormFields)
);

// ========== Event: Terapkan Promo ==========
applyPromoBtn.addEventListener("click", () => {
  const code = promoInput.value.trim().toUpperCase();
  if (PROMO_CODES[code]) {
    promoDiscount = PROMO_CODES[code];
    promoMessage.className = "mt-2 text-sm text-green-600";
    promoMessage.textContent = `Kode promo berhasil! (-${promoDiscount * 100}%)`;
  } else {
    promoDiscount = 0;
    promoMessage.className = "mt-2 text-sm text-red-600";
    promoMessage.textContent = "Kode promo tidak valid.";
  }
  promoMessage.classList.remove("hidden");
  updateTotal();
  validateFormFields();
});

// ========== Event: Submit Form ==========
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = form.customerName.value.trim();
  const email = form.customerEmail.value.trim();
  if (!name || !email.includes("@")) {
    alert("Silakan masukkan nama dan email yang valid.");
    return;
  }

  const productText = productSelect.options[productSelect.selectedIndex].text;
  const paymentMethod = form.paymentMethod.value;
  const qty = parseInt(quantityInput.value);
  const { total } = updateTotal();
  const timestamp = new Date().toLocaleString("id-ID");

  const transaction = { name, email, productText, qty, paymentMethod, total, timestamp };
  saveTransaction(transaction);
  renderTransactions();

  showProgress(() => {
    showSuccessModal(transaction);
    audioSuccess.play();
  });

  form.reset();
  promoDiscount = 0;
  promoMessage.classList.add("hidden");
  updateTotal();
  validateFormFields();
});

// ========== Simpan Transaksi ==========
function saveTransaction(data) {
  const list = JSON.parse(localStorage.getItem("transactions") || "[]");
  list.push(data);
  localStorage.setItem("transactions", JSON.stringify(list));
}

// ========== Render Transaksi ==========
function renderTransactions() {
  const list = JSON.parse(localStorage.getItem("transactions") || "[]");
  transactionList.innerHTML = "";

  if (list.length === 0) {
    emptyState.classList.remove("hidden");
    clearHistoryBtn?.classList.add("hidden");
    totalTransactionsEl.textContent = 0;
    totalRevenueEl.textContent = "Rp 0";
    avgTransactionEl.textContent = "Rp 0";
    return;
  }

  emptyState.classList.add("hidden");
  clearHistoryBtn?.classList.remove("hidden");

  let totalRevenue = 0;

  list.slice().reverse().forEach(t => {
    const clone = transactionTemplate.content.cloneNode(true);
    clone.querySelector(".transaction-customer").textContent = t.name;
    clone.querySelector(".transaction-product").textContent = `${t.productText} x ${t.qty}`;
    clone.querySelector(".transaction-amount").textContent = formatRupiah(t.total);
    clone.querySelector(".transaction-time").textContent = t.timestamp;
    clone.querySelector(".transaction-method").textContent = t.paymentMethod;
    transactionList.appendChild(clone);
    totalRevenue += t.total;
  });

  totalTransactionsEl.textContent = list.length;
  totalRevenueEl.textContent = formatRupiah(totalRevenue);
  avgTransactionEl.textContent = formatRupiah(Math.round(totalRevenue / list.length));
}

// ========== Modal: Tampilkan Sukses ==========
function showSuccessModal(transaction) {
  document.getElementById("detailName").textContent = transaction.name;
  document.getElementById("detailProduct").textContent = transaction.productText;
  document.getElementById("detailQty").textContent = transaction.qty;
  document.getElementById("detailMethod").textContent = transaction.paymentMethod;
  document.getElementById("detailTotal").textContent = formatRupiah(transaction.total);
  document.getElementById("detailTime").textContent = transaction.timestamp;
  successModal.classList.remove("hidden");
}

// ========== Event: Tutup Modal ==========
closeSuccessModal?.addEventListener("click", () => {
  successModal.classList.add("hidden");
});

// ========== Event: Hapus Riwayat ==========
clearHistoryBtn?.addEventListener("click", () => {
  localStorage.removeItem("transactions");
  renderTransactions();
});

// ========== Event: Cetak Invoice ==========
printInvoiceBtn?.addEventListener("click", () => {
  window.print();
});

// ========== Simulasi Progress ==========
function showProgress(callback) {
  if (!progressBar) return callback();
  progressBar.classList.remove("hidden");
  progressBar.value = 0;

  let value = 0;
  const interval = setInterval(() => {
    value += 10;
    progressBar.value = value;
    if (value >= 100) {
      clearInterval(interval);
      progressBar.classList.add("hidden");
      callback();
    }
  }, 50);
}

// ========== Init ==========
renderTransactions();
updateTotal();
validateFormFields();
