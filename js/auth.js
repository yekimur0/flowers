/* ==========================================================================
   FLEUR — auth.js
   Показ/скрытие пароля, демо-валидация регистрации, таймер повторной отправки кода.
   ========================================================================== */

(function () {
  "use strict";

  /* ---------- Показать/скрыть пароль ---------- */
  document.querySelectorAll(".field-eye").forEach((btn) => {
    btn.addEventListener("click", () => {
      const input = btn.previousElementSibling;
      const isVisible = btn.classList.toggle("is-visible");
      input.type = isVisible ? "text" : "password";
    });
  });

  /* ---------- Вставить код из буфера обмена ---------- */
  document.querySelectorAll(".field-paste").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const input = btn.previousElementSibling;
      try {
        const text = await navigator.clipboard.readText();
        if (text) input.value = text.trim();
      } catch (e) {
        input.focus();
      }
    });
  });

  /* ---------- Демо-валидация формы регистрации ---------- */
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    const TAKEN_EMAILS = ["test@example.com", "occupied@example.com"];
    const TAKEN_PHONES = ["+7 (900) 123-45-67"];

    const emailField = document.getElementById("regEmail");
    const phoneField = document.getElementById("regPhone");

    function setError(inputEl, hasError) {
      const wrap = inputEl.closest(".auth-field");
      wrap.classList.toggle("is-error", hasError);
    }

    function checkEmail() {
      setError(emailField, TAKEN_EMAILS.includes(emailField.value.trim().toLowerCase()));
    }

    function checkPhone() {
      setError(phoneField, TAKEN_PHONES.includes(phoneField.value.trim()));
    }

    if (emailField) emailField.addEventListener("blur", checkEmail);
    if (phoneField) phoneField.addEventListener("blur", checkPhone);

    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      checkEmail();
      checkPhone();
      const hasError = registerForm.querySelector(".auth-field.is-error");
      if (hasError) {
        hasError.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
      const email = emailField ? emailField.value.trim() : "user@example.com";
      window.location.href = "register-confirm.html?email=" + encodeURIComponent(email || "user@example.com");
    });
  }

  /* ---------- Подстановка email на странице подтверждения + таймер ---------- */
  const emailPlaceholder = document.getElementById("confirmEmail");
  if (emailPlaceholder) {
    const params = new URLSearchParams(window.location.search);
    emailPlaceholder.textContent = params.get("email") || "user@example.com";
  }

  function wireResendTimer(linkId, seconds) {
    const link = document.getElementById(linkId);
    if (!link) return;
    let remaining = seconds;
    const baseText = "Отправить код повторно";

    function tick() {
      if (remaining <= 0) {
        link.textContent = baseText;
        link.classList.remove("is-disabled");
        return;
      }
      const m = String(Math.floor(remaining / 60)).padStart(2, "0");
      const s = String(remaining % 60).padStart(2, "0");
      link.textContent = baseText + " (" + m + ":" + s + ")";
      link.classList.add("is-disabled");
      remaining -= 1;
      setTimeout(tick, 1000);
    }

    link.addEventListener("click", (e) => {
      if (link.classList.contains("is-disabled")) {
        e.preventDefault();
        return;
      }
      e.preventDefault();
      remaining = seconds;
      tick();
    });

    tick();
  }

  wireResendTimer("resendCode", 59);

  /* ---------- Подтверждение регистрации → переход в ЛК ---------- */
  const confirmForm = document.getElementById("confirmForm");
  if (confirmForm) {
    confirmForm.addEventListener("submit", (e) => {
      e.preventDefault();
      window.location.href = "account.html";
    });
  }

  /* ---------- Форма входа (демо) ---------- */
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      window.location.href = "account.html";
    });
  }

  /* ---------- Сброс пароля: переключение этапов ---------- */
  const resetStep1Form = document.getElementById("resetStep1Form");
  const resetStep2Form = document.getElementById("resetStep2Form");
  if (resetStep1Form && resetStep2Form) {
    const step1View = document.getElementById("resetView1");
    const step2View = document.getElementById("resetView2");
    const step1Indicator = document.getElementById("stepIndicator1");
    const step2Indicator = document.getElementById("stepIndicator2");
    const CHECK_ICON =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg>';

    resetStep1Form.addEventListener("submit", (e) => {
      e.preventDefault();
      step1View.classList.remove("is-active");
      step2View.classList.add("is-active");
      step1Indicator.classList.remove("is-active");
      step1Indicator.classList.add("is-done");
      step1Indicator.querySelector(".step__circle").innerHTML = CHECK_ICON;
      step2Indicator.classList.add("is-active");
      step2View.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    resetStep2Form.addEventListener("submit", (e) => {
      e.preventDefault();
      window.location.href = "account.html";
    });
  }

  wireResendTimer("resendResetCode", 59);
})();
