let contacts = [];
let currentContactId = null;
let isEditing = false;

const contactsContainer = document.getElementById("contactsContainer");
const emptyState = document.getElementById("emptyState");
const searchInput = document.getElementById("searchInput");
const addContactBtn = document.getElementById("addContactBtn");
const addFirstContactBtn = document.getElementById("addFirstContactBtn");
const contactModal = document.getElementById("contactModal");
const deleteModal = document.getElementById("deleteModal");
const contactForm = document.getElementById("contactForm");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const addressInput = document.getElementById("address");
const notesInput = document.getElementById("notes");
const notification = document.getElementById("notification");

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  loadContacts();
  setupEventListeners();
  renderContacts();
  if (contacts.length === 0)
    showNotification("Welcome to the Address Book!", "info");
});

function setupEventListeners() {
  addContactBtn.addEventListener("click", openAddContactModal);
  addFirstContactBtn.addEventListener("click", openAddContactModal);
  searchInput.addEventListener("input", filterContacts);
  contactForm.addEventListener("submit", handleFormSubmit);
  document.querySelectorAll(".close").forEach((btn) => {
    btn.addEventListener("click", () => {
      contactModal.classList.add("hidden");
      deleteModal.classList.add("hidden");
    });
  });
  [contactModal, deleteModal].forEach((modal) => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.add("hidden");
      }
    });
  });
  document
    .getElementById("cancelBtn")
    .addEventListener("click", () => contactModal.classList.add("hidden"));
  document
    .getElementById("cancelDeleteBtn")
    .addEventListener("click", () => deleteModal.classList.add("hidden"));
  document
    .getElementById("confirmDeleteBtn")
    .addEventListener("click", deleteContact);
}

function loadContacts() {
  try {
    contacts = JSON.parse(localStorage.getItem("contacts") || "[]");
  } catch (e) {
    contacts = [];
  }
}

function saveContacts() {
  localStorage.setItem("contacts", JSON.stringify(contacts));
}

function renderContacts() {
  contactsContainer.innerHTML = "";
  const term = searchInput.value.toLowerCase().trim();
  const filtered = term
    ? contacts.filter(
        (c) =>
          c.name.toLowerCase().includes(term) ||
          c.email.toLowerCase().includes(term)
      )
    : contacts;

  if (filtered.length === 0) {
    emptyState.classList.remove("hidden");
    return;
  }
  emptyState.classList.add("hidden");

  filtered.forEach((contact) => {
    const card = createContactCard(contact);
    contactsContainer.appendChild(card);
  });
}

function createContactCard(contact) {
  const card = document.createElement("div");
  card.className = "contact-card glass fade-in";
  card.dataset.id = contact.id;
  const first = contact.name.charAt(0).toUpperCase();

  // Build info lines
  let infoHTML = `<h3 class="contact-name">${contact.name}</h3>`;

  if (contact.email) {
    infoHTML += `<p class="contact-info-item"><i class="fas fa-envelope"></i>${contact.email}</p>`;
  }
  if (contact.phone) {
    infoHTML += `<p class="contact-info-item"><i class="fas fa-phone"></i>${contact.phone}</p>`;
  }
  if (contact.address) {
    infoHTML += `<p class="contact-info-item"><i class="fas fa-map-marker-alt"></i>${
      contact.address.split("\n")[0]
    }</p>`;
  }
  if (contact.notes) {
    infoHTML += `<p class="contact-info-item"><i class="fas fa-sticky-note"></i>${
      contact.notes.split("\n")[0]
    }</p>`;
  }

  const cardContent = document.createElement("div");
  cardContent.className = "contact-card-content";
  cardContent.innerHTML = `
            <div class="contact-avatar">
                ${first}
            </div>
            <div class="contact-details">
                ${infoHTML}
                <div class="contact-meta">
                    <span>Added: ${new Date(
                      contact.createdAt
                    ).toLocaleDateString()}</span>
                </div>
            </div>
        `;

  const actionButtons = document.createElement("div");
  actionButtons.className = "contact-actions";
  actionButtons.innerHTML = `
            <button class="contact-btn contact-btn-edit" data-id="${contact.id}">
                <i class="fas fa-edit"></i>Edit
            </button>
            <button class="contact-btn contact-btn-delete" data-id="${contact.id}">
                <i class="fas fa-trash-alt"></i>Delete
            </button>
        `;

  card.appendChild(cardContent);
  card.appendChild(actionButtons);

  // Interactivity
  card.addEventListener("mouseenter", (e) => {
    card.classList.add("active");
    card.addEventListener("mousemove", moveLight);
  });
  card.addEventListener("mouseleave", () => {
    card.classList.remove("active");
    card.removeEventListener("mousemove", moveLight);
  });

  function moveLight(e) {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  }

  // Event listeners for edit and delete buttons
  const editBtn = card.querySelector(".contact-btn-edit");
  const deleteBtn = card.querySelector(".contact-btn-delete");

  editBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    openEditContactModal(contact.id, false);
  });

  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    currentContactId = contact.id;
    document.getElementById(
      "deleteMessage"
    ).textContent = `Are you sure you want to delete ${contact.name}?`;
    deleteModal.classList.remove("hidden");
  });

  return card;
}

// Apply effect to header
const header = document.getElementById("header");
header.addEventListener("mouseenter", () => header.classList.add("active"));
header.addEventListener("mouseleave", () => header.classList.remove("active"));
header.addEventListener("mousemove", (e) => {
  const rect = header.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  header.style.setProperty("--mouse-x", `${x}px`);
  header.style.setProperty("--mouse-y", `${y}px`);
});

// Modal functions with animations
function openAddContactModal() {
  isEditing = false;
  contactForm.reset();
  document.getElementById("modalTitle").textContent = "Add New Contact";
  contactModal.classList.remove("hidden");
  contactModal.querySelector(".modal-content").classList.add("slide-in");
}

function openEditContactModal(id, readOnly = false) {
  const contact = contacts.find((c) => c.id === id);
  if (!contact) return;
  isEditing = !readOnly;
  currentContactId = id;
  nameInput.value = contact.name;
  emailInput.value = contact.email;
  phoneInput.value = contact.phone || "";
  addressInput.value = contact.address || "";
  notesInput.value = contact.notes || "";
  document.getElementById("modalTitle").textContent = readOnly
    ? "Contact Details"
    : "Edit Contact";
  contactModal.classList.remove("hidden");
  contactModal.querySelector(".modal-content").classList.add("slide-in");
}

function handleFormSubmit(e) {
  e.preventDefault();
  if (!nameInput.value.trim() || !emailInput.value.trim()) {
    showNotification("Name and email are required.", "error");
    return;
  }
  if (isEditing) {
    contacts = contacts.map((c) =>
      c.id === currentContactId
        ? {
            ...c,
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            phone: phoneInput.value.trim(),
            address: addressInput.value.trim(),
            notes: notesInput.value.trim(),
            updatedAt: new Date().toISOString(),
          }
        : c
    );
  } else {
    contacts.push({
      id: Date.now().toString(),
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      phone: phoneInput.value.trim(),
      address: addressInput.value.trim(),
      notes: notesInput.value.trim(),
      createdAt: new Date().toISOString(),
    });
  }
  saveContacts();
  renderContacts();
  contactModal.querySelector(".modal-content").classList.remove("slide-in");
  contactModal.querySelector(".modal-content").classList.add("slide-out");
  setTimeout(() => {
    contactModal.classList.add("hidden");
    contactModal.querySelector(".modal-content").classList.remove("slide-out");
  }, 500);
  showNotification(
    isEditing ? "Contact updated!" : "Contact added!",
    "success"
  );
}

function deleteContact() {
  contacts = contacts.filter((c) => c.id !== currentContactId);
  saveContacts();
  renderContacts();
  deleteModal.querySelector(".modal-content").classList.remove("slide-in");
  deleteModal.querySelector(".modal-content").classList.add("slide-out");
  setTimeout(() => {
    deleteModal.classList.add("hidden");
    deleteModal.querySelector(".modal-content").classList.remove("slide-out");
  }, 500);
  showNotification("Contact deleted!", "success");
}

function filterContacts() {
  renderContacts();
}

function showNotification(msg, type = "info") {
  notification.textContent = msg;
  notification.className = `notification fixed top-6 right-6 p-4 rounded-xl text-white font-medium z-50 ${
    type === "error"
      ? "bg-red-900/80"
      : type === "success"
      ? "bg-green-900/80"
      : "bg-blue-900/80"
  } fade-in`;
  notification.classList.remove("hidden");
  setTimeout(() => notification.classList.add("hidden"), 3000);
}
