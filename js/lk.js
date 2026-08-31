/* ==========================================================================
   FLEUR — lk.js
   Личный кабинет: копирование промокода, "Повторить заказ", смена профиля/почты.
   ========================================================================== */

(function () {
  "use strict";

  /* ---------- Копировать промокод ---------- */
  document.querySelectorAll(".promo-card__copy").forEach((btn) => {
    const defaultLabel = btn.querySelector("span").textContent;
    btn.addEventListener("click", async () => {
      const code = btn.closest(".promo-card").querySelector(".promo-card__code").textContent.trim();
      try {
        await navigator.clipboard.writeText(code);
      } catch (e) {
        /* буфер обмена недоступен — молча игнорируем в демо */
      }
      btn.querySelector("span").textContent = "Скопировано!";
      setTimeout(() => {
        btn.querySelector("span").textContent = defaultLabel;
      }, 1800);
    });
  });

  /* ---------- Повторить заказ → сразу в корзину ---------- */
  document.querySelectorAll(".js-repeat-order").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      window.location.href = "cart.html";
    });
  });

  /* ---------- Редактировать профиль: смена данных / подтверждение почты ---------- */
  const profileForm = document.getElementById("profileForm");
  if (profileForm) {
    const emailField = document.getElementById("profileEmail");
    const passwordField = document.getElementById("profileNewPassword");
    const originalEmail = emailField.value.trim();
    const originalPassword = passwordField.value;

    const editView = document.getElementById("profileEditView");
    const confirmView = document.getElementById("profileConfirmView");
    const confirmEmailTarget = document.getElementById("profileConfirmEmailTarget");
    const notice = document.getElementById("profileNotice");

    profileForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const emailChanged = emailField.value.trim() !== originalEmail;
      const passwordChanged = passwordField.value !== originalPassword;

      if (emailChanged) {
        confirmEmailTarget.textContent = emailField.value.trim();
        editView.classList.remove("is-active");
        confirmView.classList.add("is-active");
        confirmView.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }

      if (notice) {
        notice.style.display = "flex";
        notice.textContent = passwordChanged
          ? "Изменения сохранены. Уведомление об изменении пароля отправлено на вашу почту."
          : "Изменения сохранены.";
        notice.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  }

  const profileConfirmForm = document.getElementById("profileConfirmForm");
  if (profileConfirmForm) {
    profileConfirmForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const newEmail = document.getElementById("profileConfirmEmailTarget").textContent;
      document.getElementById("profileEmail").value = newEmail;

      document.getElementById("profileConfirmView").classList.remove("is-active");
      document.getElementById("profileEditView").classList.add("is-active");

      const notice = document.getElementById("profileNotice");
      if (notice) {
        notice.style.display = "flex";
        notice.textContent = "Почта успешно изменена.";
        notice.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  }
})();
