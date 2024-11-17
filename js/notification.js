// Function to fetch notifications (appointments in this case) from the API
const fetchNotifications = async () => {
    try {
        const response = await fetch('https://book-ease-73f27-default-rtdb.firebaseio.com/confomebooking.json');
        const data = await response.json();
        const notifications = processNotifications(data);
        renderNotifications(notifications);
    } catch (error) {
        console.error("Error fetching notifications:", error);
    }
};

// Function to process the raw API data into notifications format
const processNotifications = (data) => {
    if (!data) return []; // Handle case where no data is returned

    const notifications = [];
    for (const key in data) {
        const appointment = data[key];
        notifications.push({
            id: key,
            title: appointment.title,
            date: appointment.date,
            message: `Your appointment for "${appointment.title}" is scheduled at ${appointment.time} on ${appointment.date}.`,
            status: "new", // Define the status logic if needed
            location: appointment.location
        });
    }
    return notifications;
};

// Function to render notifications into the table
const renderNotifications = (notifications) => {
    const tableBody = document.getElementById('notifications-table-body');
    const noNotificationsMessage = document.getElementById('no-notifications-message');

    tableBody.innerHTML = ''; // Clear existing notifications

    if (notifications.length === 0) {
        noNotificationsMessage.textContent = "No notifications available."; // Show message
        noNotificationsMessage.style.display = "block";
        document.querySelector("table").style.display="none"
        return;
    }

    noNotificationsMessage.style.display = "none"; // Hide message

    notifications.forEach((notification, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <th scope="row">${index + 1}</th>
            <td>${notification.title}</td>
            <td>${notification.date}</td>
            <td>${notification.message}</td>
            <td>
                <span class="badge ${notification.status === 'new' ? 'bg-success' : (notification.status === 'unread' ? 'bg-warning' : 'bg-secondary')}">
                    ${notification.status.charAt(0).toUpperCase() + notification.status.slice(1)}
                </span>
            </td>
            <td class="d-flex justify-content-around">
                <button class="btn btn-primary btn-sm" onclick="viewNotification('${notification.id}')">View</button>
                <button class="btn btn-danger btn-sm" onclick="dismissNotification('${notification.id}')">Dismiss</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
};

// Function to handle the "View" action
const viewNotification = (id) => {
    alert(`Viewing notification with ID: ${id}`);
    // Update notification status and re-render (if tracking status)
    const notification = notificationsData.find(n => n.id === id);
    if (notification) {
        notification.status = "read";
        renderNotifications(notificationsData);
    }
};

// Function to handle the "Dismiss" action
const dismissNotification = (id) => {
    const notificationIndex = notificationsData.findIndex(n => n.id === id);
    if (notificationIndex !== -1) {
        notificationsData.splice(notificationIndex, 1); // Remove the notification
        renderNotifications(notificationsData); // Re-render the table
    }
};

// Initialize notifications when the page is loaded
document.addEventListener('DOMContentLoaded', fetchNotifications);
