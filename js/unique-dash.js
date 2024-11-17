// Fetch data from the API
fetch('https://book-ease-73f27-default-rtdb.firebaseio.com/confomebooking.json')
    .then(response => response.json())
    .then(data => {
        const appointments = Object.values(data);
        
        // Calculate Total Appointments, Total Income, and Pending Notifications
        const totalAppointments = appointments.length;
        let totalIncome = 0;
        let pendingNotifications = 0;

        appointments.forEach(appointment => {
            totalIncome += parseFloat(appointment.totalPrice);
            if (!appointment.date) {
                pendingNotifications++;
            }
        });

        // Update the Dashboard UI
        document.getElementById('totalAppointments').textContent = totalAppointments;
        document.getElementById('totalIncome').textContent = `$${totalIncome.toFixed(2)}`;
        document.getElementById('pendingNotifications').textContent = pendingNotifications;
        
        // Filter and display appointments for this month
        const currentMonth = new Date().getMonth() + 1; // 1-indexed
        const appointmentsThisMonth = appointments.filter(appointment => {
            const appointmentMonth = new Date(appointment.date).getMonth() + 1;
            return appointmentMonth === currentMonth;
        }).length;

        document.getElementById('appointmentsThisMonth').textContent = appointmentsThisMonth;

        // Display recent appointments in table
        const appointmentsList = document.getElementById('appointmentsList');
        appointments.slice(0, 5).forEach(appointment => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${appointment.title}</td>
                <td>${appointment.category}</td>
                <td>${appointment.location}</td>
                <td>$${appointment.charges}</td>
                <td>${appointment.date}</td>
            `;
            appointmentsList.appendChild(row);
        });
    })
    .catch(error => {
        console.error('Error fetching data:', error);
        alert('Failed to fetch data from API. Please try again later.');
    });
