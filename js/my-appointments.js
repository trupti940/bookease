const apiUrl =
  "https://book-ease-73f27-default-rtdb.firebaseio.com/confomebooking.json";
const container = document.getElementById("page-container");

// Fetch and render appointments
const fetchAppointments = async () => {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data) {
      renderAppointments(data);
    } else {
      container.innerHTML = '<p class="text-center">No appointments found.</p>';
    }
  } catch (error) {
    console.error("Error fetching appointments:", error);
    container.innerHTML =
      '<p class="text-center text-danger">Failed to fetch appointments. Try again later.</p>';
  }
};

// Render appointments as Bootstrap cards
const renderAppointments = (appointments) => {
  container.innerHTML = "";

  Object.keys(appointments).forEach((key) => {
    const appointment = appointments[key];

    const card = document.createElement("div");
    card.classList.add("card", "mb-4", "shadow-sm");
    card.innerHTML = `
      <div class="row g-0">
        <div class="col-md-4">
          <img src="${appointment.image}" class="img-fluid rounded-start" alt="${appointment.title}">
        </div>
        <div class="col-md-8">
          <div class="card-body">
            <h5 class="card-title">${appointment.title}</h5>
            <p class="card-text">${appointment.description}</p>
            <p><strong>Category:</strong> ${appointment.category}</p>
            <p><strong>Location:</strong> ${appointment.location}</p>
            <p><strong>Date:</strong> ${appointment.date} <strong>Time:</strong> ${appointment.time}</p>
            <p><strong>Charges:</strong> $${appointment.charges}</p>
            <button class="btn btn-danger cancel-btn" data-id="${key}">Cancel</button>
          </div>
        </div>
      </div>
    `;

    container.appendChild(card);
  });

  attachDeleteListeners();
};

// Attach delete event listeners
const attachDeleteListeners = () => {
  const cancelButtons = document.querySelectorAll(".cancel-btn");

  cancelButtons.forEach((button) => {
    button.addEventListener("click", async (e) => {
      const appointmentId = e.target.dataset.id;

      const confirmDelete = confirm(
        "Are you sure you want to cancel this appointment?"
      );
      if (confirmDelete) {
        await deleteAppointment(appointmentId);
      }
    });
  });
};

// Delete appointment
const deleteAppointment = async (id) => {
  try {
    const response = await fetch(`${apiUrl.replace(".json", `/${id}.json`)}`, {
      method: "DELETE",
    });

    if (response.ok) {
      alert("Appointment cancelled successfully.");
      fetchAppointments(); // Refresh the list
    } else {
      alert("Failed to cancel the appointment. Try again later.");
    }
  } catch (error) {
    console.error("Error deleting appointment:", error);
    alert("An error occurred. Please try again.");
  }
};

// Fetch appointments on page load
document.addEventListener("DOMContentLoaded", fetchAppointments);
