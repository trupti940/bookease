document.addEventListener("DOMContentLoaded", () => {
  const serviceContainer = document.getElementById("service-container");

  const params = new URLSearchParams(window.location.search);
  const service = JSON.parse(decodeURIComponent(params.get("data")));
  console.log(service);
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

  const currentDate = new Date();
  let selectedDate = new Date();
  let currentMonth = currentDate.getMonth();
  let currentYear = currentDate.getFullYear();

  const monthYearDisplay = document.getElementById("month-year");
  const calendarBody = document.getElementById("calendar-body");
  const prevButton = document.getElementById("prev");
  const nextButton = document.getElementById("next");

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  function updateCalendar() {
    calendarBody.innerHTML = "";
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    monthYearDisplay.textContent = `${months[currentMonth]} ${currentYear}`;
    let row = document.createElement("tr");

    for (let i = 0; i < firstDay; i++) {
      const emptyCell = document.createElement("td");
      row.appendChild(emptyCell);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const cell = document.createElement("td");
      cell.textContent = day;

      if (
        day === selectedDate.getDate() &&
        currentMonth === selectedDate.getMonth() &&
        currentYear === selectedDate.getFullYear()
      ) {
        cell.classList.add("selected-date");
      }

      cell.addEventListener("click", () => {
        selectedDate = new Date(currentYear, currentMonth, day);
        updateCalendar();
      });

      row.appendChild(cell);

      if ((firstDay + day) % 7 === 0) {
        calendarBody.appendChild(row);
        row = document.createElement("tr");
      }
    }

    if (row.children.length > 0) {
      calendarBody.appendChild(row);
    }
  }

  prevButton.addEventListener("click", () => {
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    updateCalendar();
  });

  nextButton.addEventListener("click", () => {
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    updateCalendar();
  });

  updateCalendar();

  const price = parseFloat(service.charges);
  const taxRate = 0.02;
  const taxAmount = price * taxRate;
  const totalPrice = price + taxAmount;

  document.querySelector(
    ".right-section .price"
  ).textContent = `Price - $${service.charges}`;
  document.querySelector(".su h5").textContent = `$ ${service.charges}`;
  document.querySelector(
    ".summary .su:nth-child(1) p:nth-child(2)"
  ).textContent = `$${taxAmount.toFixed(2)}`;
  document.querySelector(".total").textContent = `$${totalPrice.toFixed(2)}`;

  const timeButtons = document.querySelectorAll(".timeslots button");
  let selectedTimeButton = null;

  timeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (selectedTimeButton) {
        selectedTimeButton.style.backgroundColor = "";
        selectedTimeButton.textContent =
          selectedTimeButton.getAttribute("data-time");
      }
      selectedTimeButton = button;
      button.textContent = ` ${button.getAttribute("data-time")}`;
      button.style.backgroundColor = "red";
    });
  });

  const reserveButton = document.querySelector(".reserve-btn");
  const paymentPopup = document.getElementById("paymentPopup");
  const closePopupButton = document.querySelector(".close-popup");
  const userEmail = localStorage.getItem("userEmail");

  reserveButton.addEventListener("click", () => {
    // if (!userEmail) {
    //     window.location.href = '../aniketcode/signin.html'; // Redirect to your login page
    //     return;
    // }

    if (selectedTimeButton) {
      paymentPopup.style.display = "flex";
    } else {
      alert("Please select a time slot.");
    }
  });

  closePopupButton.addEventListener("click", () => {
    paymentPopup.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target === paymentPopup) {
      paymentPopup.style.display = "none";
    }
  });

  const submitPaymentButton = document.querySelector(".submit-payment-btn");

  submitPaymentButton.addEventListener("click", async () => {
    const cardNumber = document.getElementById("cardNumber").value;
    const expiryDate = document.getElementById("expiryDate").value;
    const cvv = document.getElementById("cvv").value;

    if (cardNumber && expiryDate && cvv) {
      const bookingDetails = {
        id: service.id,
        image: service.image,
        title: service.title,
        description: service.description,
        charges: service.charges,
        location: service.location,
        category: service.category,
        date: selectedDate.toISOString().split("T")[0],
        time: selectedTimeButton.getAttribute("data-time"),
        totalPrice: totalPrice.toFixed(2),
        cardNumber,
        expiryDate,
        cvv,
      };

      try {
        const response = await fetch(
          "https://book-ease-73f27-default-rtdb.firebaseio.com/confomebooking.json",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(bookingDetails),
          }
        );

        if (response.ok) {
          alert("Payment successful! Your booking is confirmed.");
          paymentPopup.style.display = "none";
          document.getElementById("cardNumber").value = "";
          document.getElementById("expiryDate").value = "";
          document.getElementById("cvv").value = "";
          selectedTimeButton.style.backgroundColor = "";
          window.location.href = "book-appointment.html";
        } else {
          alert("Error saving booking. Please try again.");
        }
      } catch (error) {
        console.error("Error:", error);
        alert(
          "An error occurred while processing your request. Please try again later."
        );
      }
    } else {
      alert("Please fill in all payment details.");
    }
  });
});
