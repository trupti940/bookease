let services = [];
let filteredServices = [];

const serviceGrid = document.getElementById("service-grid");
const servicesBtn = document.getElementById("services-btn");
const categoryDropdown = document.getElementById("category-dropdown");
const searchBar = document.getElementById("search-bar");
const searchSuggestions = document.getElementById("search-suggestions");

const categories = [
  "Health & Wellness",
  "Professional Services",
  "Education & Tutoring",
  "Fitness & Sports",
  "Home & Maintenance Services",
  "Creative & Arts",
  "Technology & IT Support",
  "Events & Entertainment",
  "Pet Care",
];

// Fetch services from the database
const fetchServices = () => {
  fetch("https://book-ease-73f27-default-rtdb.firebaseio.com/services.json")
    .then((response) => response.json())
    .then((data) => {
      services = data;
      filteredServices = data;
      displayServices(filteredServices);
      populateCategoryDropdown();
    })
    .catch((error) => console.error("Error fetching data: ", error));
};

// Render services as Bootstrap cards
const displayServices = (servicesToDisplay) => {
  serviceGrid.innerHTML = "";
  servicesToDisplay.forEach((service, index) => {
    const card = document.createElement("div");
    card.classList.add("col-lg-4", "col-md-6", "col-sm-12", "mb-4"); // Responsive columns

    card.innerHTML = `
      <div class="card h-100 service-card">
        <img src="${
          service.image || "https://via.placeholder.com/250"
        }" class="card-img-top" alt="${service.title}">
        <div class="card-body">
          <h5 class="card-title">${service.title}</h5>
          <p class="card-text">${service.description}</p>
          <p class="price">$${service.charges}</p>
          <div class="location">
            <span>📍</span>
            <span>${service.location}</span>
          </div>
        </div>
      </div>
    `;

    card.addEventListener("click", () => sendToServicePage(index));
    serviceGrid.appendChild(card);
  });
};

// Navigate to service page with encoded data
const sendToServicePage = (index) => {
  const service = services[index];
  const serviceData = {
    id: service.id,
    title: service.title,
    image: service.image || "https://via.placeholder.com/250", // Fallback image if none exists
    description: service.description,
    charges: service.charges,
    location: service.location,
    category: service.category
  };
  
  const encodedData = encodeURIComponent(JSON.stringify(serviceData));
  window.location.href = `serviceDetail.html?data=${encodedData}`;
};


// Filter services by selected category
const filterServicesByCategory = (category) => {
  filteredServices = services.filter(
    (service) => service.category === category
  );
  displayServices(filteredServices);
};

// Populate category dropdown
const populateCategoryDropdown = () => {
  categoryDropdown.innerHTML = "";

  const allServicesButton = document.createElement("button");
  allServicesButton.textContent = "All Services";
  allServicesButton.classList.add("dropdown-item");
  allServicesButton.onclick = () => {
    filteredServices = services;
    displayServices(filteredServices);
    categoryDropdown.style.display = "none";
  };
  categoryDropdown.appendChild(allServicesButton);

  categories.forEach((category) => {
    const button = document.createElement("button");
    button.textContent = category;
    button.classList.add("dropdown-item");
    button.onclick = () => {
      filterServicesByCategory(category);
      categoryDropdown.style.display = "none";
    };
    categoryDropdown.appendChild(button);
  });
};

// Toggle category dropdown
const toggleCategoryDropdown = () => {
  categoryDropdown.style.display =
    categoryDropdown.style.display === "block" ? "none" : "block";
};

servicesBtn.addEventListener("click", (e) => {
  toggleCategoryDropdown();
  e.stopPropagation();
});

// Close dropdown if clicked outside
document.addEventListener("click", (e) => {
  if (!categoryDropdown.contains(e.target) && e.target !== servicesBtn) {
    categoryDropdown.style.display = "none";
  }
});

// Debounce search input for suggestions
let debounceTimer;
searchBar.addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase();

  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    if (query) {
      const suggestions = services.filter(
        (service) =>
          service.title.toLowerCase().includes(query) ||
          service.description.toLowerCase().includes(query)
      );
      showSearchSuggestions(suggestions);
    } else {
      searchSuggestions.style.display = "none";
    }
  }, 300); // Delay to allow for debouncing
});



// Show search suggestions
const showSearchSuggestions = (suggestions) => {
  searchSuggestions.innerHTML = "";
  suggestions.forEach((suggestion) => {
    const suggestionItem = document.createElement("div");
    suggestionItem.classList.add("suggestion-item");
    suggestionItem.textContent = suggestion.title;
    suggestionItem.onclick = () => {
      displayServices([suggestion]);
      searchSuggestions.style.display = "none";
      searchBar.value = suggestion.title;
    };
    searchSuggestions.appendChild(suggestionItem);
  });
  searchSuggestions.style.display = "block"; // Show suggestions
};

// Initialize fetch on DOM load
document.addEventListener("DOMContentLoaded", fetchServices);
