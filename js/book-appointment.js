let services = [];
let filteredServices = [];

const serviceGrid = document.getElementById("service-grid");
const servicesBtn = document.getElementById("services-btn");
const categoryDropdown = document.getElementById("category-dropdown");
const searchBar = document.getElementById("search-bar");
const searchSuggestions = document.getElementById("search-suggestions");

const categories = [
  "Health & Wellness", "Professional Services", "Education & Tutoring", 
  "Fitness & Sports", "Home & Maintenance Services", "Creative & Arts", 
  "Technology & IT Support", "Events & Entertainment", "Pet Care"
];

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

const displayServices = (servicesToDisplay) => {
  serviceGrid.innerHTML = "";
  servicesToDisplay.forEach((service) => {
    serviceGrid.innerHTML += `
      <div class="service-card">
        <img src="${service.image}" alt="${service.title}" />
        <div class="service-details">
          <h3>${service.title}</h3>
          <p>${service.description}</p>
          <div class="location">
            <span>📍</span>
            <span>${service.location}</span>
          </div>
          <p class="price">$${service.charges}</p>
        </div>
      </div>
    `;
  });
};

const filterServicesByCategory = (category) => {
  filteredServices = services.filter(service => service.category === category);
  displayServices(filteredServices);
};

const populateCategoryDropdown = () => {
  const allServicesButton = document.createElement("button");
  allServicesButton.textContent = "All Services";
  allServicesButton.onclick = () => {
    filteredServices = services;
    displayServices(filteredServices);
    categoryDropdown.style.display = "none"; 
    document.getElementById("service-grid").style.marginTop = "0"; 
  };
  categoryDropdown.appendChild(allServicesButton);

  // Add categories to the dropdown
  categories.forEach((category) => {
    const button = document.createElement("button");
    button.textContent = category;
    button.onclick = () => {
      filterServicesByCategory(category);
      categoryDropdown.style.display = "none"; 
      document.getElementById("service-grid").style.marginTop = "200px"; 
    };
    categoryDropdown.appendChild(button);
  });
};

const toggleCategoryDropdown = () => {
  categoryDropdown.style.display = categoryDropdown.style.display === "block" ? "none" : "block";

  if (categoryDropdown.style.display === "block") {
    document.getElementById("service-grid").style.marginTop = "200px"; 
  } else {
    document.getElementById("service-grid").style.marginTop = "0"; 
  }
};

servicesBtn.addEventListener("click", (e) => {
  toggleCategoryDropdown();
  e.stopPropagation(); 
});

const hideCategoryDropdown = () => {
  categoryDropdown.style.display = "none";
};


document.addEventListener("click", (e) => {
  if (!categoryDropdown.contains(e.target) && e.target !== servicesBtn) {
    hideCategoryDropdown();
    document.getElementById("service-grid").style.marginTop = "0"; 
  }
});

let debounceTimer;
searchBar.addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase();

  // Debouncing search input
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    if (query) {
      const suggestions = services.filter(service =>
        service.title.toLowerCase().includes(query) || service.description.toLowerCase().includes(query)
      );
      showSearchSuggestions(suggestions);
    } else {
      searchSuggestions.style.display = "none";
    }
  }, 300);
});

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
  searchSuggestions.style.display = "block";
};

document.addEventListener("DOMContentLoaded", fetchServices);
