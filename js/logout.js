document.getElementById("logoutButton").addEventListener("click", logout);

function logout() {
  localStorage.removeItem("idToken"); // Clear token from storage
  alert("You have been logged out successfully!");
  window.location.href = "login.html"; // Redirect to login page
}

if (!localStorage.getItem("idToken")) {
  alert("You must be logged in to access this page.");
  window.location.href = "login.html";
}
