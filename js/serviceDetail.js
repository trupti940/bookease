let service;
const serviceContainer = document.getElementById("service-container");
const loadingSpinner = document.getElementById("loading-spinner");

// extract id param
const params = new URLSearchParams(window.location.search);
let id = JSON.parse(decodeURIComponent(params.get("id")));
const serviceUrl = `https://book-ease-73f27-default-rtdb.firebaseio.com/services/${id}.json`;

// fetch service using id
const fetchService = () => {
  fetch(serviceUrl)
    .then((response) => response.json())
    .then((data) => {
      service = data;
      displayService();
      loadingSpinner.style.display = "none"; // Hide spinner after loading data
    })
    .catch((error) => {
      console.error("Error fetching data: ", error);
      loadingSpinner.innerHTML =
        "<p class='text-danger'>Error loading service details</p>";
    });
};

// render service card with image on the left and details on the right
const displayService = () => {
  serviceContainer.innerHTML = `
    <div class="col-12 mb-4">
        <div class="row g-4 align-items-center">
            <div class="col-md-6">
                <img src="${service.image}" class="img-fluid rounded" alt="${service.title}">
            </div>
            <div class="col-md-6">
                <div class="card-body">
                    <h2 class="card-title">${service.title}</h2>
                    <p class="card-text fs-5">${service.description}</p>
                    <p class="text-muted"><strong>Category:</strong> ${service.category}</p>
                    <p class="text-muted"><strong>Location:</strong> ${service.location}</p>
                    <p class="text-muted"><strong>Charges:</strong> $${service.charges}</p>
                </div>
            </div>
        </div>
    </div>
  `;
};

document.addEventListener("DOMContentLoaded", fetchService);
