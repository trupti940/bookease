const apiUrl = 'https://book-ease-73f27-default-rtdb.firebaseio.com/confomebooking.json';
const appointmentsContainer = document.getElementById('appointments-container');
const calendarContainer = document.getElementById('calendar');

// Fetch and display appointments
const fetchAppointments = async () => {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data) {
            renderAppointments(data);
        } else {
            appointmentsContainer.innerHTML = '<p class="text-center">No appointments found.</p>';
        }
    } catch (error) {
        console.error('Error fetching appointments:', error);
        appointmentsContainer.innerHTML = '<p class="text-center text-danger">Failed to load appointments.</p>';
    }
};

// Render appointments in the left section
const renderAppointments = (appointments) => {
    appointmentsContainer.innerHTML = '';
    Object.keys(appointments).forEach((key) => {
        const appointment = appointments[key];
        const card = document.createElement('div');
        card.classList.add('border', 'p-2', 'mb-2', 'rounded');

        card.innerHTML = `
            <h6 class="mb-1">${appointment.title}</h6>
            <p class="mb-0">
                <strong>Date:</strong> ${appointment.date}<br>
                <strong>Time:</strong> ${appointment.time}<br>
                <strong>Location:</strong> ${appointment.location}
            </p>
        `;
        appointmentsContainer.appendChild(card);
    });
};

// Render the FullCalendar
const renderCalendar = () => {
    const now = new Date();
    
    // Initialize FullCalendar
    new FullCalendar.Calendar(calendarContainer, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,dayGridWeek'
        },
        events: async function(fetchInfo, successCallback, failureCallback) {
            try {
                const response = await fetch(apiUrl);
                const data = await response.json();
                const events = [];
                
                Object.keys(data).forEach((key) => {
                    const appointment = data[key];
                    events.push({
                        title: appointment.title,
                        start: `${appointment.date}T${appointment.time}:00`,
                        end: `${appointment.date}T${appointment.time}:00`,
                        description: appointment.description,
                        location: appointment.location
                    });
                });

                successCallback(events); // pass events to the calendar
            } catch (error) {
                console.error('Error fetching events for the calendar:', error);
                failureCallback(error);
            }
        },
        eventClick: function(info) {
            // Show appointment details in the modal
            const appointment = info.event;

            document.getElementById('appointmentTitle').textContent = appointment.title;
            document.getElementById('appointmentDate').textContent = appointment.start.toLocaleDateString();
            document.getElementById('appointmentTime').textContent = appointment.start.toLocaleTimeString();
            document.getElementById('appointmentLocation').textContent = appointment.extendedProps.location || 'N/A';
            document.getElementById('appointmentDescription').textContent = appointment.extendedProps.description || 'No description provided.';

            // Open the modal
            const modal = new bootstrap.Modal(document.getElementById('appointmentModal'));
            modal.show();
        },
        dateClick: function(info) {
            alert('You clicked on: ' + info.dateStr);
        }
    }).render();
};

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    fetchAppointments();
    renderCalendar();
});
