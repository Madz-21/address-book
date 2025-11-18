/* ==================== STATE VARIABLES ==================== */
let contacts = JSON.parse(localStorage.getItem("contacts")) || [];
let chatMessages = JSON.parse(localStorage.getItem("chatMessages")) || {};
let profile = JSON.parse(localStorage.getItem("profile")) || {
  name: "Ahmad Sahl Pahlevi",
  email: "sampleemail123@gmail.com",
  phone: "12345678910",
  address: "New York Street III",
  birthday: "01-01-2000",
};
let currentContactId = null;
let isEditing = false;
let isSortedAsc = true;
let currentTab = "contact";
let currentChatContact = null;

/* ==================== DOM ELEMENTS ==================== */
const contactList = document.getElementById("contactList");
const searchInput = document.getElementById("searchInput");
const addContactButton = document.getElementById("addContactButton");
const contactModal = document.getElementById("contactModal");
const contactForm = document.getElementById("contactForm");
const closeModal = document.getElementById("closeModal");
const cancelButton = document.getElementById("cancelButton");
const modalTitle = document.getElementById("modalTitle");
const nameInput = document.getElementById("nameInput");
const titleInput = document.getElementById("titleInput");
const phoneInput = document.getElementById("phoneInput");
const emailInput = document.getElementById("emailInput");
const chatInput = document.getElementById("chatInput");
const contactDetailPanel = document.getElementById("contactDetailPanel");
const detailAvatar = document.getElementById("detailAvatar");
const detailName = document.getElementById("detailName");
const detailTitle = document.getElementById("detailTitle");
const detailPhone = document.getElementById("detailPhone");
const detailEmail = document.getElementById("detailEmail");
const detailChat = document.getElementById("detailChat");
const editContactButton = document.getElementById("editContactButton");
const deleteContactButton = document.getElementById("deleteContactButton");
const deleteModal = document.getElementById("deleteModal");
const closeDeleteModal = document.getElementById("closeDeleteModal");
const cancelDeleteButton = document.getElementById("cancelDeleteButton");
const confirmDeleteButton = document.getElementById("confirmDeleteButton");
const sortButton = document.getElementById("sortButton");
const sidebar = document.getElementById("sidebar");
const sidebarToggle = document.getElementById("sidebarToggle");
const sidebarTitle = document.getElementById("sidebarTitle");
const editProfileButton = document.getElementById("editProfileButton");
const profileModal = document.getElementById("profileModal");
const closeProfileModal = document.getElementById("closeProfileModal");
const cancelProfileButton = document.getElementById("cancelProfileButton");
const profileForm = document.getElementById("profileForm");
const profileNameInput = document.getElementById("profileNameInput");
const profileEmailInput = document.getElementById("profileEmailInput");
const profileBirthdayInput = document.getElementById("profileBirthdayInput");
const profilePhoneInput = document.getElementById("profilePhoneInput");
const profileAddressInput = document.getElementById("profileAddressInput");
const companyInput = document.getElementById("companyInput");
const positionInput = document.getElementById("positionInput");
const departmentInput = document.getElementById("departmentInput");
const birthdayInput = document.getElementById("birthdayInput");
const addressInput = document.getElementById("addressInput");
const notesInput = document.getElementById("notesInput");
const chatButton = document.getElementById("chatButton");
const chatWindow = document.getElementById("chatWindow");
const closeChatButton = document.getElementById("closeChatButton");
const chatMessagesContainer = document.getElementById("chatMessages");
const chatInputField = document.getElementById("chatInputField");
const sendChatButton = document.getElementById("sendChatButton");
const chatContactName = document.getElementById("chatContactName");
const tabButtons = document.querySelectorAll(".tab-button");
const contactTab = document.getElementById("contactTab");
const workTab = document.getElementById("workTab");
const aboutTab = document.getElementById("aboutTab");

/* ==================== UTILITY FUNCTIONS ==================== */
function getAvatarColor(name) {
  const colors = [
    "3b82f6",
    "f59e0b",
    "10b981",
    "8b5cf6",
    "ec4899",
    "0ea5e9",
    "f97316",
    "06b6d4",
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

function getInitials(name) {
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return (
      parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
    ).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

function formatTime(date) {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

function saveContactsToStorage() {
  localStorage.setItem("contacts", JSON.stringify(contacts));
}

function saveChatMessagesToStorage() {
  localStorage.setItem("chatMessages", JSON.stringify(chatMessages));
}

function saveProfileToStorage() {
  localStorage.setItem("profile", JSON.stringify(profile));
}

function showNotification(message, type = "success") {
  const notification = document.createElement("div");
  const bgColor = type === "success" ? "bg-green-500" : "bg-red-500";
  const icon = type === "success" ? "fa-check-circle" : "fa-exclamation-circle";
  notification.className = `fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-[100] flex items-center space-x-3 animate-fadeIn`;
  notification.innerHTML = `
                <i class="fas ${icon}"></i>
                <span>${message}</span>
            `;
  document.body.appendChild(notification);
  setTimeout(() => {
    notification.style.opacity = "0";
    notification.style.transform = "translateY(-20px)";
    notification.style.transition = "all 0.3s ease";
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

/* ==================== CONTACT FUNCTIONS ==================== */
function renderContacts(filter = "") {
  contactList.innerHTML = "";
  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(filter.toLowerCase()) ||
      contact.email.toLowerCase().includes(filter.toLowerCase())
  );

  if (filteredContacts.length === 0) {
    if (filter) {
      contactList.innerHTML = `
                        <div class="text-center py-12 text-gray-500">
                            <i class="fas fa-search text-4xl mb-4 text-gray-300"></i>
                            <p class="text-lg mb-2">No contacts found</p>
                            <p class="text-sm mb-4">Try a different search term</p>
                            <button class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors" onclick="resetSearch()">
                                <i class="fas fa-times mr-2"></i>Clear Search
                            </button>
                        </div>
                    `;
    } else {
      contactList.innerHTML = `
                        <div class="text-center py-12 text-gray-400">
                            <i class="fas fa-address-book text-6xl mb-4"></i>
                            <p class="text-lg mb-2">No contacts yet</p>
                            <p class="text-sm mb-4">Click "New contact" to add your first contact</p>
                        </div>
                    `;
    }
    return;
  }

  filteredContacts.forEach((contact) => {
    const contactElement = document.createElement("div");
    contactElement.className =
      "contact-card bg-white rounded-lg p-4 mb-3 shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-all";
    contactElement.innerHTML = `
                    <div class="flex items-center space-x-4">
                        <img src="${contact.avatar}" alt="${
      contact.name
    }" class="w-12 h-12 rounded-full contact-avatar border-2 border-gray-100">
                        <div class="flex-1 min-w-0">
                            <h4 class="font-semibold text-gray-800 truncate">${
                              contact.name
                            }</h4>
                            <p class="text-sm text-gray-500 truncate">${
                              contact.title || "No title"
                            }</p>
                        </div>
                        <div class="text-right min-w-0">
                            <p class="font-medium text-gray-800 text-sm">${
                              contact.phone
                            }</p>
                            <p class="text-xs text-gray-500 truncate max-w-[150px]">${
                              contact.email
                            }</p>
                        </div>
                    </div>
                `;
    contactElement.addEventListener("click", () => showContactDetails(contact));
    contactList.appendChild(contactElement);
  });
}

function showContactDetails(contact) {
  currentContactId = contact.id;
  currentTab = "contact";
  detailAvatar.src = contact.avatar;
  detailName.textContent = contact.name;
  detailTitle.textContent = contact.title || "No title";
  detailPhone.textContent = contact.phone;
  detailEmail.textContent = contact.email;
  detailChat.textContent = contact.chat || "-";

  document.getElementById("detailCompany").textContent = contact.company || "-";
  document.getElementById("detailPosition").textContent =
    contact.position || "-";
  document.getElementById("detailDepartment").textContent =
    contact.department || "-";

  document.getElementById("detailBirthday").textContent =
    contact.birthday || "-";
  document.getElementById("detailAddress").textContent = contact.address || "-";
  document.getElementById("detailNotes").textContent = contact.notes || "-";

  switchTab("contact");
  contactDetailPanel.classList.remove("hidden");
  setTimeout(() => {
    contactDetailPanel.classList.add("fade-in");
  }, 10);
}

function switchTab(tabName) {
  currentTab = tabName;
  tabButtons.forEach((btn) => {
    if (btn.dataset.tab === tabName) {
      btn.classList.add("active");
      btn.classList.remove("text-gray-500");
    } else {
      btn.classList.remove("active");
      btn.classList.add("text-gray-500");
    }
  });
  document.querySelectorAll(".tab-content").forEach((content) => {
    content.classList.remove("active");
  });
  if (tabName === "contact") {
    contactTab.classList.add("active");
  } else if (tabName === "work") {
    workTab.classList.add("active");
  } else if (tabName === "about") {
    aboutTab.classList.add("active");
  }
}

function resetSearch() {
  searchInput.value = "";
  renderContacts();
}

function openAddContactModal() {
  isEditing = false;
  currentContactId = null;
  modalTitle.textContent = "Add New Contact";
  contactForm.reset();
  companyInput.value = "";
  positionInput.value = "";
  departmentInput.value = "";
  birthdayInput.value = "";
  addressInput.value = "";
  notesInput.value = "";
  contactModal.classList.remove("hidden");
  setTimeout(() => {
    nameInput.focus();
  }, 100);
}

function openEditContactModal(contact) {
  isEditing = true;
  currentContactId = contact.id;
  modalTitle.textContent = "Edit Contact";
  nameInput.value = contact.name;
  titleInput.value = contact.title || "";
  phoneInput.value = contact.phone;
  emailInput.value = contact.email;
  chatInput.value = contact.chat || "";

  companyInput.value = contact.company || "";
  positionInput.value = contact.position || "";
  departmentInput.value = contact.department || "";

  birthdayInput.value = contact.birthday || "";
  addressInput.value = contact.address || "";
  notesInput.value = contact.notes || "";

  contactModal.classList.remove("hidden");
  setTimeout(() => {
    nameInput.focus();
  }, 100);
}

function closeContactModal() {
  contactModal.classList.add("hidden");
  contactForm.reset();
}

function closeDeleteModalFunc() {
  deleteModal.classList.add("hidden");
}

function showDeleteConfirmation() {
  deleteModal.classList.remove("hidden");
}

function deleteContact() {
  contacts = contacts.filter((contact) => contact.id !== currentContactId);
  if (chatMessages[currentContactId]) {
    delete chatMessages[currentContactId];
    saveChatMessagesToStorage();
  }
  saveContactsToStorage();
  contactDetailPanel.classList.add("hidden");
  renderContacts(searchInput.value);
  closeDeleteModalFunc();
  showNotification("Contact deleted successfully", "success");
}

function saveContact(e) {
  e.preventDefault();
  const name = nameInput.value.trim();
  const title = titleInput.value.trim();
  const phone = phoneInput.value.trim();
  const email = emailInput.value.trim();
  const chat = chatInput.value.trim();

  const company = companyInput.value.trim();
  const position = positionInput.value.trim();
  const department = departmentInput.value.trim();

  const birthday = birthdayInput.value.trim();
  const address = addressInput.value.trim();
  const notes = notesInput.value.trim();

  if (!name || !phone || !email) {
    showNotification("Please fill in all required fields", "error");
    return;
  }

  const initials = getInitials(name);
  const color = getAvatarColor(name);
  const avatar = `https://placehold.co/40x40/${color}/ffffff?text=${initials}`;

  const contactData = {
    name,
    title,
    phone,
    email,
    chat,
    avatar,
    company,
    position,
    department,
    birthday,
    address,
    notes,
  };

  if (isEditing) {
    const index = contacts.findIndex(
      (contact) => contact.id === currentContactId
    );
    if (index !== -1) {
      contacts[index] = { ...contacts[index], ...contactData };
      showNotification("Contact updated successfully", "success");
    }
  } else {
    contactData.id = Date.now();
    contacts.push(contactData);
    showNotification("Contact added successfully", "success");
  }

  if (isSortedAsc) {
    contacts.sort((a, b) => a.name.localeCompare(b.name));
  }

  saveContactsToStorage();
  renderContacts(searchInput.value);
  closeContactModal();

  if (isEditing && currentContactId) {
    const updatedContact = contacts.find((c) => c.id === currentContactId);
    if (updatedContact) {
      showContactDetails(updatedContact);
    }
  }
}

function sortContacts() {
  if (contacts.length === 0) {
    showNotification("No contacts to sort", "error");
    return;
  }
  if (isSortedAsc) {
    contacts.sort((a, b) => b.name.localeCompare(a.name));
    sortButton.innerHTML = '<i class="fas fa-sort-alpha-up text-gray-600"></i>';
    sortButton.title = "Sort Z to A";
    isSortedAsc = false;
  } else {
    contacts.sort((a, b) => a.name.localeCompare(b.name));
    sortButton.innerHTML =
      '<i class="fas fa-sort-alpha-down text-gray-600"></i>';
    sortButton.title = "Sort A to Z";
    isSortedAsc = true;
  }
  renderContacts(searchInput.value);
}

/* ==================== SIDEBAR FUNCTIONS ==================== */
function toggleSidebar() {
  sidebar.classList.toggle("sidebar-collapsed");
  const toggleIcon = sidebarToggle.querySelector("i");
  if (sidebar.classList.contains("sidebar-collapsed")) {
    toggleIcon.className = "fas fa-chevron-right text-gray-600";
  } else {
    toggleIcon.className = "fas fa-chevron-left text-gray-600";
  }
}

/* ==================== PROFILE FUNCTIONS ==================== */
function openProfileModal() {
  profileNameInput.value = profile.name;
  profileEmailInput.value = profile.email;
  profileBirthdayInput.value = profile.birthday;
  profilePhoneInput.value = profile.phone;
  profileAddressInput.value = profile.address;
  profileModal.classList.remove("hidden");
  setTimeout(() => {
    profileNameInput.focus();
  }, 100);
}

function closeProfileModalFunc() {
  profileModal.classList.add("hidden");
}

function saveProfile(e) {
  e.preventDefault();
  profile.name = profileNameInput.value.trim();
  profile.email = profileEmailInput.value.trim();
  profile.birthday = profileBirthdayInput.value.trim();
  profile.phone = profilePhoneInput.value.trim();
  profile.address = profileAddressInput.value.trim();

  document.querySelector(".sidebar-content h2").textContent = profile.name;
  document.querySelector(".sidebar-content p").textContent = profile.email;
  document.querySelectorAll(".sidebar-content .space-y-4 span")[0].textContent =
    profile.birthday;
  document.querySelectorAll(".sidebar-content .space-y-4 span")[1].textContent =
    profile.phone;
  document.querySelectorAll(".sidebar-content .space-y-4 span")[2].textContent =
    profile.address;

  saveProfileToStorage();
  closeProfileModalFunc();
  showNotification("Profile updated successfully", "success");
}

/* ==================== CHAT FUNCTIONS ==================== */
function openChatWindow(contact) {
  currentChatContact = contact;
  chatContactName.textContent = contact.name;

  chatWindow.classList.remove("hide");
  setTimeout(() => {
    chatWindow.classList.add("show");
  }, 10);

  loadChatMessages(contact.id);

  setTimeout(() => {
    chatInputField.focus();
  }, 300);
}

function closeChatWindow() {
  chatWindow.classList.remove("show");
  chatWindow.classList.add("hide");

  setTimeout(() => {
    currentChatContact = null;
    chatWindow.classList.remove("hide");
  }, 300);
}

function loadChatMessages(contactId) {
  chatMessagesContainer.innerHTML = "";

  const messages = chatMessages[contactId] || [];

  if (messages.length === 0) {
    chatMessagesContainer.innerHTML = `
                    <div class="empty-chat">
                        <i class="fas fa-comments"></i>
                        <p class="text-sm">No messages yet</p>
                        <p class="text-xs">Start a conversation!</p>
                    </div>
                `;
    return;
  }

  messages.forEach((msg) => {
    addMessageToUI(msg.text, msg.sender, msg.time);
  });

  chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
}

function addMessageToUI(text, sender, time) {
  const messageElement = document.createElement("div");
  messageElement.className = `message ${sender}`;
  messageElement.innerHTML = `
                <div>${text}</div>
                <div class="message-time">${time}</div>
            `;
  chatMessagesContainer.appendChild(messageElement);
}

async function sendMessage() {
  const message = chatInputField.value.trim();
  if (!message || !currentChatContact) return;

  const now = new Date();
  const time = formatTime(now);

  if (!chatMessages[currentChatContact.id]) {
    chatMessages[currentChatContact.id] = [];
  }

  chatMessages[currentChatContact.id].push({
    text: message,
    sender: "sent",
    time: time,
  });

  saveChatMessagesToStorage();

  addMessageToUI(message, "sent", time);

  chatInputField.value = "";

  chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;

  chatInputField.disabled = true;
  sendChatButton.disabled = true;

  setTimeout(() => {
    showTypingIndicator();

    // Get AI response
    getAIResponse(message)
      .then((aiResponse) => {
        removeTypingIndicator();

        const responseTime = formatTime(new Date());

        chatMessages[currentChatContact.id].push({
          text: aiResponse,
          sender: "received",
          time: responseTime,
        });

        saveChatMessagesToStorage();

        addMessageToUI(aiResponse, "received", responseTime);

        chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;

        // Re-enable input
        chatInputField.disabled = false;
        sendChatButton.disabled = false;
        chatInputField.focus();
      })
      .catch((error) => {
        removeTypingIndicator();
        console.error("AI Response Error:", error);

        // Fallback response if AI fails
        const fallbackResponse = "Maaf, koneksi lagi bermasalah. Coba lagi ya!";
        const responseTime = formatTime(new Date());

        chatMessages[currentChatContact.id].push({
          text: fallbackResponse,
          sender: "received",
          time: responseTime,
        });

        saveChatMessagesToStorage();
        addMessageToUI(fallbackResponse, "received", responseTime);

        chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;

        // Re-enable input
        chatInputField.disabled = false;
        sendChatButton.disabled = false;
        chatInputField.focus();
      });
  }, 1000);
}

async function getAIResponse(userMessage) {
  try {
    const conversationHistory = chatMessages[currentChatContact.id] || [];
    const recentMessages = conversationHistory.slice(0, -1).slice(-10);

    let conversationContext = "";
    if (recentMessages.length > 0) {
      conversationContext =
        "\n\nPercakapan sebelumnya:\n" +
        recentMessages
          .map((msg) => {
            const sender =
              msg.sender === "sent" ? "Saya" : currentChatContact.name;
            return `${sender}: "${msg.text}"`;
          })
          .join("\n");
    }

    const systemPrompt = `Kamu adalah ${currentChatContact.name}, teman chat yang sedang mengobrol casual lewat WhatsApp.

ATURAN PENTING:
1. Baca SELURUH konteks percakapan dengan teliti
2. Pahami apa yang ditanyakan atau diminta
3. Jawab SESUAI dengan pertanyaan/permintaan yang spesifik
4. Gunakan bahasa Indonesia casual (boleh campur bahasa gaul)
5. Singkat tapi relevan (1-2 kalimat maksimal)
6. Jangan ngawur atau asal jawab

Contoh bagaimana cara menjawab yang benar:
- Kalau ditanya "Lagi dimana?" → Jawab lokasi spesifik seperti "Di rumah nih" atau "Masih di kantor"
- Kalau diajak "Sini lah" atau "Kesini dong" → Jawab seperti "Bentar lagi nyampe" atau "Sekarang gabisa, besok ya"
- Kalau ditanya "Ngapain?" → Jawab aktivitas seperti "Lagi kerja" atau "Nonton netflix"
- Kalau disapa "Hi" → Balas "Hi! Ada apa?" atau "Halo!"

JANGAN jawab dengan hal umum yang tidak nyambung!${conversationContext}

Saya baru saja bilang: "${userMessage}"

Sekarang balas dengan natural dan PASTI NYAMBUNG dengan apa yang saya bilang!`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 200,
        temperature: 0.8,
        messages: [
          {
            role: "user",
            content: systemPrompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error:", errorData);
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();

    if (data.content && data.content[0] && data.content[0].text) {
      let aiResponse = data.content[0].text.trim();

      // Remove quotes, asterisks, and other formatting
      aiResponse = aiResponse.replace(/^["'*]+|["'*]+$/g, "").trim();
      aiResponse = aiResponse.replace(/^\*\*|\*\*$/g, "").trim();

      // Remove "Nama:" prefix if AI adds it
      aiResponse = aiResponse.replace(
        new RegExp(`^${currentChatContact.name}:\\s*`, "i"),
        ""
      );

      // Prevent duplicate responses
      if (
        aiResponse === userMessage ||
        aiResponse.toLowerCase() === userMessage.toLowerCase()
      ) {
        return getContextualFallback(userMessage);
      }

      return aiResponse;
    } else {
      console.error("Invalid response structure:", data);
      throw new Error("Invalid AI response structure");
    }
  } catch (error) {
    console.error("Error getting AI response:", error);
    return getContextualFallback(userMessage);
  }
}

function getContextualFallback(userMessage) {
  const lowerMsg = userMessage.toLowerCase();

  // Location questions
  if (
    lowerMsg.includes("dimana") ||
    lowerMsg.includes("mana") ||
    lowerMsg.includes("dmn")
  ) {
    const locations = [
      "Di rumah, naon?",
      "Lg di jalan, nape cuy?",
      "Lagi mancing",
      "Di kampus",
    ];
    return locations[Math.floor(Math.random() * locations.length)];
  }

  // Invitation
  if (
    lowerMsg.includes("sini") ||
    lowerMsg.includes("kesini") ||
    lowerMsg.includes("sokin") ||
    lowerMsg.includes("Nongki") ||
    lowerMsg.includes("kemari")
  ) {
    const inviteResponses = ["Kmna?", "Ngapain?"];
    return inviteResponses[Math.floor(Math.random() * inviteResponses.length)];
  }

  // Activity questions
  if (
    lowerMsg.includes("Nongki") ||
    lowerMsg.includes("Kerkom") ||
    lowerMsg.includes("Tmpt biasa") ||
    lowerMsg.includes("Cafe")
  ) {
    const activities = ["Yauds ntar gua kesitu", "Ada siapa aja emg?"];
    return activities[Math.floor(Math.random() * activities.length)];
  }

  // Greetings
  if (lowerMsg.match(/^(hi|hai|halo|hello|hey|p)$/)) {
    return "Oyy, knp?";
  }

  // Default smart responses
  const activityResponse = ["Ada siapa aja emg?", "Yauds ntar gua kesitu"];
  return activityResponse[Math.floor(Math.random() * activityResponse.length)];
}

function getRandomFallbackResponse() {
  const fallbacks = [
    "Ada siapa aja emg",
    "Bentar ya, lagi sibuk dikit wkwkwk",
    "Wkwk iya",
  ];
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}

function showTypingIndicator() {
  const typingElement = document.createElement("div");
  typingElement.className = "typing-indicator";
  typingElement.id = "typingIndicator";
  typingElement.innerHTML = `
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            `;
  chatMessagesContainer.appendChild(typingElement);
  chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
}

function removeTypingIndicator() {
  const typingElement = document.getElementById("typingIndicator");
  if (typingElement) {
    typingElement.remove();
  }
}

/* ==================== EVENT LISTENERS ==================== */
addContactButton.addEventListener("click", function (e) {
  e.preventDefault();
  e.stopPropagation();
  openAddContactModal();
});

searchInput.addEventListener("input", () => renderContacts(searchInput.value));
closeModal.addEventListener("click", closeContactModal);
cancelButton.addEventListener("click", closeContactModal);
contactForm.addEventListener("submit", saveContact);

editContactButton.addEventListener("click", () => {
  const contact = contacts.find((c) => c.id === currentContactId);
  if (contact) openEditContactModal(contact);
});

deleteContactButton.addEventListener("click", showDeleteConfirmation);
closeDeleteModal.addEventListener("click", closeDeleteModalFunc);
cancelDeleteButton.addEventListener("click", closeDeleteModalFunc);
confirmDeleteButton.addEventListener("click", deleteContact);
sortButton.addEventListener("click", sortContacts);

sidebarToggle.addEventListener("click", function (e) {
  e.preventDefault();
  e.stopPropagation();
  toggleSidebar();
});

editProfileButton.addEventListener("click", function (e) {
  e.preventDefault();
  e.stopPropagation();
  openProfileModal();
});

closeProfileModal.addEventListener("click", closeProfileModalFunc);
cancelProfileButton.addEventListener("click", closeProfileModalFunc);
profileForm.addEventListener("submit", saveProfile);

chatButton.addEventListener("click", () => {
  const contact = contacts.find((c) => c.id === currentContactId);
  if (contact) openChatWindow(contact);
});

closeChatButton.addEventListener("click", closeChatWindow);
sendChatButton.addEventListener("click", sendMessage);

chatInputField.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    switchTab(btn.dataset.tab);
  });
});

contactModal.addEventListener("click", (e) => {
  if (e.target === contactModal) {
    closeContactModal();
  }
});

deleteModal.addEventListener("click", (e) => {
  if (e.target === deleteModal) {
    closeDeleteModalFunc();
  }
});

profileModal.addEventListener("click", (e) => {
  if (e.target === profileModal) {
    closeProfileModalFunc();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (!contactModal.classList.contains("hidden")) {
      closeContactModal();
    }
    if (!deleteModal.classList.contains("hidden")) {
      closeDeleteModalFunc();
    }
    if (!profileModal.classList.contains("hidden")) {
      closeProfileModalFunc();
    }
    if (chatWindow.classList.contains("show")) {
      closeChatWindow();
    }
  }
});

/* ==================== INITIALIZATION ==================== */
renderContacts();
