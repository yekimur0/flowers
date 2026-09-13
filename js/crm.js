/* ==========================================================================
   FLEUR CRM — crm.js
   Переключение карточек-вариантов, текстовый редактор, удаление строк таблиц.
   ========================================================================== */

(function () {
  "use strict";

  /* ---------- Радио-карточки с доп. полями ---------- */
  document.querySelectorAll(".option-cards").forEach((group) => {
    const inputs = group.querySelectorAll("input[type='radio']");
    inputs.forEach((input) => {
      input.addEventListener("change", () => {
        const targetId = input.dataset.target;
        document.querySelectorAll(".option-extra[data-for='" + group.dataset.group + "']").forEach((el) => {
          el.classList.toggle("is-active", targetId && el.id === targetId);
        });
      });
    });
  });

  /* ---------- Текстовый редактор письма ---------- */
  const editorBody = document.querySelector(".editor-body");
  if (editorBody) {
    document.querySelectorAll(".editor-toolbar [data-cmd]").forEach((btn) => {
      btn.addEventListener("click", () => {
        editorBody.focus();
        const cmd = btn.dataset.cmd;
        const val = btn.dataset.value || null;
        document.execCommand(cmd, false, val);
        btn.classList.toggle("is-active");
      });
    });

    const fontSizeSelect = document.querySelector(".editor-toolbar select");
    if (fontSizeSelect) {
      fontSizeSelect.addEventListener("change", () => {
        editorBody.focus();
        const map = { "12": "2", "14": "3", "16": "4", "18": "5", "24": "6" };
        document.execCommand("fontSize", false, map[fontSizeSelect.value] || "3");
      });
    }
  }

  /* ---------- Бессрочный промокод — отключает поле даты ---------- */
  const foreverCheckbox = document.getElementById("promoForever");
  const promoDateField = document.getElementById("promoDate");
  if (foreverCheckbox && promoDateField) {
    foreverCheckbox.addEventListener("change", () => {
      promoDateField.disabled = foreverCheckbox.checked;
      if (foreverCheckbox.checked) promoDateField.value = "";
    });
  }

  /* ---------- Удаление строк таблиц (демо) ---------- */
  document.querySelectorAll(".table-actions .is-danger").forEach((btn) => {
    btn.addEventListener("click", () => {
      const row = btn.closest("tr");
      if (row) row.remove();
    });
  });

  /* ---------- Деактивация/активация сотрудника (демо) ---------- */
  document.querySelectorAll(".js-toggle-status").forEach((btn) => {
    btn.addEventListener("click", () => {
      const badge = btn.closest("tr").querySelector(".status-badge");
      if (!badge) return;
      const isActive = badge.classList.contains("status-badge");
      if (isActive && !badge.classList.contains("status-badge--processing")) {
        badge.textContent = "Деактивирован";
        badge.className = "status-badge status-badge--processing";
      } else {
        badge.textContent = "Активен";
        badge.className = "status-badge";
      }
    });
  });

  /* ---------- Попап карточки заказа (Канбан / Архив) ---------- */
  const orderModal = document.getElementById("orderModal");
  if (orderModal) {
    const setText = (sel, value) => {
      const el = orderModal.querySelector(sel);
      if (el) el.textContent = value;
    };

    const fillOrderModal = (data) => {
      setText(".js-order-id", "Заказ #" + data.id);
      const statusEl = orderModal.querySelector(".js-order-status");
      if (statusEl) {
        statusEl.textContent = data.statusLabel;
        statusEl.className = "status-badge" + (data.statusClass ? " " + data.statusClass : "");
      }
      const mediaEl = orderModal.querySelector(".js-order-media");
      if (mediaEl) mediaEl.className = "order-modal__media ph " + (data.phClass || "ph--1");
      setText(".js-order-name", data.name);
      setText(".js-order-price", data.price);
      setText(".js-payment-status-text", data.paymentStatus);
      setText(".js-payment-method", data.paymentMethod);
      setText(".js-delivery-method", data.deliveryMethod);
      setText(".js-address-label", data.addressLabel);
      setText(".js-address-value", data.address);
      setText(".js-order-date", data.date);
      setText(".js-bonus", "+" + data.bonus + " бонусов");
      setText(".js-promo", data.promo);
      setText(".js-total", data.total);
      setText(".js-client-name", data.clientName);
      setText(".js-client-phone", data.clientPhone);
      setText(".js-client-contact", data.clientContact);
      setText(".js-client-email", data.clientEmail);
      setText(".js-client-status-text", data.registered ? "Зарегистрирован на сайте" : "Гость (не зарегистрирован)");
    };

    document.querySelectorAll(".js-view-order").forEach((btn) => {
      btn.addEventListener("click", () => {
        let data;
        try {
          data = JSON.parse(btn.dataset.order);
        } catch (e) {
          return;
        }
        fillOrderModal(data);
        orderModal.classList.add("is-open");
        document.body.style.overflow = "hidden";
      });
    });

    const closeOrderModal = () => {
      orderModal.classList.remove("is-open");
      document.body.style.overflow = "";
    };

    orderModal.querySelectorAll(".js-modal-close").forEach((btn) => {
      btn.addEventListener("click", closeOrderModal);
    });
    orderModal.addEventListener("click", (e) => {
      if (e.target === orderModal) closeOrderModal();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeOrderModal();
    });
  }

  /* ---------- Шаблоны писем (Супер администратор) ---------- */
  const templateSubject = document.getElementById("templateSubject");
  const templateBody = document.querySelector(".js-template-editor-body");
  if (templateSubject && templateBody) {
    let lastRange = null;
    templateBody.addEventListener("keyup", saveRange);
    templateBody.addEventListener("mouseup", saveRange);
    function saveRange() {
      const sel = window.getSelection();
      if (sel.rangeCount && templateBody.contains(sel.anchorNode)) {
        lastRange = sel.getRangeAt(0);
      }
    }

    document.querySelectorAll(".js-template-edit").forEach((btn) => {
      btn.addEventListener("click", () => {
        const row = btn.closest(".template-row");
        if (!row) return;
        document.querySelectorAll(".template-row").forEach((r) => r.classList.remove("is-active"));
        row.classList.add("is-active");
        templateSubject.value = row.dataset.subject || "";
        templateBody.innerHTML = row.dataset.body || "";
        lastRange = null;
      });
    });

    document.querySelectorAll(".js-template-duplicate").forEach((btn) => {
      btn.addEventListener("click", () => {
        const row = btn.closest(".template-row");
        if (!row) return;
        const clone = row.cloneNode(true);
        const nameEl = clone.querySelector(".template-row__name");
        if (nameEl) nameEl.textContent = nameEl.textContent + " (копия)";
        clone.classList.remove("is-active");
        row.after(clone);
      });
    });

    document.querySelectorAll(".js-variable").forEach((btn) => {
      btn.addEventListener("click", () => {
        const code = btn.dataset.code;
        if (!code) return;
        templateBody.focus();
        const sel = window.getSelection();
        if (lastRange) {
          sel.removeAllRanges();
          sel.addRange(lastRange);
        }
        document.execCommand("insertText", false, code);
        saveRange();
      });
    });
  }

  /* ---------- Создание сотрудника (демо, добавляет строку в таблицу) ---------- */
  const createEmployeeForm = document.getElementById("createEmployeeForm");
  if (createEmployeeForm) {
    createEmployeeForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const first = document.getElementById("empFirstName").value.trim();
      const last = document.getElementById("empLastName").value.trim();
      const login = document.getElementById("empLogin").value.trim();
      if (!first || !last || !login) return;

      const tbody = document.getElementById("employeesTableBody");
      const row = document.createElement("tr");
      row.innerHTML =
        "<td>" + first + " " + last + "</td>" +
        "<td>" + login + "</td>" +
        '<td><span class="status-badge">Активен</span></td>' +
        '<td><div class="table-actions">' +
        '<button type="button" class="js-toggle-status" aria-label="Изменить статус"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20l4-1 11-11-3-3L5 16l-1 4Z"/></svg></button>' +
        '<button type="button" class="is-danger" aria-label="Удалить"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2m2 0-1 13a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 7"/></svg></button>' +
        "</div></td>";
      tbody.prepend(row);
      createEmployeeForm.reset();
    });
  }
})();
