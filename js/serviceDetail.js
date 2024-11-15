document.addEventListener('DOMContentLoaded', () => {
  const currentDate = new Date();
  let selectedDate = new Date();
  let currentMonth = currentDate.getMonth();
  let currentYear = currentDate.getFullYear();

  const monthYearDisplay = document.getElementById('month-year');
  const calendarBody = document.getElementById('calendar-body');
  const prevButton = document.getElementById('prev');
  const nextButton = document.getElementById('next');

  const months = [
      'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
  ];

  function updateCalendar() {
      calendarBody.innerHTML = '';
      const firstDay = new Date(currentYear, currentMonth, 1).getDay();
      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

      monthYearDisplay.textContent = `${months[currentMonth]} ${currentYear}`;
      let row = document.createElement('tr');

      for (let i = 0; i < firstDay; i++) {
          const emptyCell = document.createElement('td');
          row.appendChild(emptyCell);
      }

      for (let day = 1; day <= daysInMonth; day++) {
          const cell = document.createElement('td');
          cell.textContent = day;

          if (day === selectedDate.getDate() && currentMonth === selectedDate.getMonth() && currentYear === selectedDate.getFullYear()) {
              cell.classList.add('selected-date');
          }

          cell.addEventListener('click', () => {
              selectedDate = new Date(currentYear, currentMonth, day);
              updateCalendar();
          });

          row.appendChild(cell);

          if ((firstDay + day) % 7 === 0) {
              calendarBody.appendChild(row);
              row = document.createElement('tr');
          }
      }

      if (row.children.length > 0) {
          calendarBody.appendChild(row);
      }
  }

  prevButton.addEventListener('click', () => {
      currentMonth--;
      if (currentMonth < 0) {
          currentMonth = 11;
          currentYear--;
      }
      updateCalendar();
  });

  nextButton.addEventListener('click', () => {
      currentMonth++;
      if (currentMonth > 11) {
          currentMonth = 0;
          currentYear++;
      }
      updateCalendar();
  });

  updateCalendar();

  const params = new URLSearchParams(window.location.search);
  const serviceData = JSON.parse(decodeURIComponent(params.get('data')));
  console.log(serviceData.charges)
  document.querySelector('.left-section1 h1').textContent = params.get('title');
  document.querySelector('.left-section1 p:nth-child(2)').textContent = `By ${params.get('owner')}`;
  document.querySelector('.left-section1 p:nth-child(3)').textContent = `~ ${params.get('min')} minutes`;
  document.querySelector('.left-section1 .category').textContent = params.get('category');
  document.querySelector('.left-section1 .location').innerHTML = `<i class="fa-solid fa-location-dot"></i> ${params.get('location')}`;
  document.querySelector('.left-section1 .description').textContent = params.get('description');
  
  document.querySelector('.left-section1 .bn1').textContent = params.get('benefits');

  document.querySelector('.right-section1 img').src = params.get('image');
  document.querySelector('.right-section1 img').alt = params.get('title');

  document.querySelector('.Aname h3').textContent = `$ ${params.get('owner')}`;
  document.querySelector('.Aname p').textContent = `$ ${params.get('benefits')}`;

  document.querySelector('.content-section h3').textContent = `$ ${params.get('category')}`;
  document.querySelector('.content-section p').textContent = `$ ${params.get('category')}`;
  const price = parseFloat(serviceData.charges);
  const taxRate = 0.02;
  const taxAmount = price * taxRate;
  const totalPrice = price + taxAmount;

document.querySelector('.right-section .price').textContent = `Price - $${serviceData.charges}`;
  document.querySelector('.su h5').textContent = `$ ${serviceData.charges}`;
  document.querySelector('.summary .su:nth-child(1) p:nth-child(2)').textContent = `$${taxAmount.toFixed(2)}`;
  document.querySelector('.total').textContent = `$${totalPrice.toFixed(2)}`;

  const timeButtons = document.querySelectorAll('.timeslots button');
  let selectedTimeButton = null;

  timeButtons.forEach(button => {
      button.addEventListener('click', () => {
          if (selectedTimeButton) {
              selectedTimeButton.style.backgroundColor = '';
              selectedTimeButton.textContent = selectedTimeButton.getAttribute('data-time');
          }
          selectedTimeButton = button;
          button.textContent = ` ${button.getAttribute('data-time')}`;
          button.style.backgroundColor = 'red';
      });
  });

  const reserveButton = document.querySelector('.reserve-btn');
  const paymentPopup = document.getElementById('paymentPopup');
  const closePopupButton = document.querySelector('.close-popup');
  const userEmail = localStorage.getItem('userEmail');

  reserveButton.addEventListener('click', () => {    
      // if (!userEmail) {
      //     window.location.href = '../aniketcode/signin.html'; // Redirect to your login page
      //     return;
      // }
  
      if (selectedTimeButton) {
          paymentPopup.style.display = 'flex';
      } else {
          alert('Please select a time slot.');
      }
  });

  closePopupButton.addEventListener('click', () => {
      paymentPopup.style.display = 'none';
  });

  window.addEventListener('click', (event) => {
      if (event.target === paymentPopup) {
          paymentPopup.style.display = 'none';
      }
  });



  const submitPaymentButton = document.querySelector('.submit-payment-btn');

  submitPaymentButton.addEventListener('click', async () => {
      // Check if the user is logged in by checking if their email is stored
    //   const userEmail = localStorage.getItem('userEmail');
  
    //   if (!userEmail) {
    //       window.location.href = '../aniketcode/signin.html'; // Redirect to your login page
    //       return;
    //   }
  
      const cardNumber = document.getElementById('cardNumber').value;
      const expiryDate = document.getElementById('expiryDate').value;
      const cvv = document.getElementById('cvv').value;
      
      if (cardNumber && expiryDate && cvv) {

              const bookingDetails = {
                id :serviceData.id,
                image:serviceData.image,
                title:serviceData.title,
                description:serviceData.description,
                charges:serviceData.charges,
                location:serviceData.location,
                category:serviceData.category,
              date: selectedDate.toISOString().split('T')[0],
              time: selectedTimeButton.getAttribute('data-time'),
              totalPrice: totalPrice.toFixed(2),
              cardNumber,
              expiryDate,
              cvv,
          };
          


          try {
            const response = await fetch("https://friend-1d5c3-default-rtdb.firebaseio.com/confomebooking.json", {
                method: 'POST',
                  headers: {
                      'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(bookingDetails)
              });
  
              if (response.ok) {
                  alert('Payment successful! Your booking is confirmed.');
                  paymentPopup.style.display = 'none';
                  document.getElementById('cardNumber').value = '';
                  document.getElementById('expiryDate').value = '';
                  document.getElementById('cvv').value = '';
                  selectedTimeButton.style.backgroundColor = '';
                  window.location.href = "booking.html";
              } else {
                  alert('Error saving booking. Please try again.');
              }
          } catch (error) {
              console.error('Error:', error);
              alert('An error occurred while processing your request. Please try again later.');
          }
      } else {
          alert('Please fill in all payment details.');
      }
  });
  


});
