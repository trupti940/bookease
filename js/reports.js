const apiUrl = 'https://book-ease-73f27-default-rtdb.firebaseio.com/confomebooking.json';

const totalAppointmentsEl = document.getElementById('total-appointments');
const totalIncomeEl = document.getElementById('total-income');
const appointmentsListEl = document.getElementById('appointments-list');
const exportButton = document.getElementById('export-pdf');

// Fetch and render reports data
const fetchReports = async () => {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data) {
            renderReports(data);
        } else {
            appointmentsListEl.innerHTML = '<tr><td colspan="5" class="text-center">No appointments found.</td></tr>';
        }
    } catch (error) {
        console.error('Error fetching reports:', error);
        appointmentsListEl.innerHTML = '<tr><td colspan="5" class="text-center text-danger">Failed to load data.</td></tr>';
    }
};

const renderReports = (appointments) => {
    let totalAppointments = 0;
    let totalIncome = 0;
    let tableRows = '';

    Object.keys(appointments).forEach((key, index) => {
        const appointment = appointments[key];
        totalAppointments++;
        totalIncome += parseFloat(appointment.charges || 0);

        tableRows += `
            <tr>
                <td>${index + 1}</td>
                <td>${appointment.title}</td>
                <td>${appointment.date}</td>
                <td>${appointment.time}</td>
                <td>$${appointment.charges || '0'}</td>
            </tr>
        `;
    });

    totalAppointmentsEl.textContent = totalAppointments;
    totalIncomeEl.textContent = `$${totalIncome.toFixed(2)}`;
    appointmentsListEl.innerHTML = tableRows;
};

// Export to PDF
exportButton.addEventListener('click', () => {
    const element = document.getElementById('page-container');
    const opt = {
        margin: 0.5,
        filename: 'appointments-report.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
});

// Initialize
document.addEventListener('DOMContentLoaded', fetchReports);
