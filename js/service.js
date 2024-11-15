let service;
const serviceContainer = document.getElementById("service-container");

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
    })
    .catch((error) => console.error("Error fetching data: ", error));
};


// render service card
const displayService = () => {
  serviceContainer.innerHTML = `
        <h1>${service.title}</h1>
        <h3>${service.description}</h3>
        <p>${service.category}</p>
        <p>${service.location}</p>
        <p>${service.charges}</p>
        <img width='500' src="${service.image}" alt="${service.title}"/>
`;
};

document.addEventListener("load", fetchService());