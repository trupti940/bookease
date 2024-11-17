document.getElementById("signupForm").addEventListener("submit", signup);

function signup(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const API_KEY = "AIzaSyA5p23N3mNungeP8Y0z7v3kRvGgU9jS_CE";

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: email,
            password: password,
            returnSecureToken: true,
        }),
    };

    fetch(
            `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,
            requestOptions
        )
        .then((resp) => resp.json())
        .then((res) => {
            if (res.idToken) {
                alert("Signup successful! Redirecting to login page...");
                window.location.href = "login.html"; // Redirect to login page
            } else {
                alert("Signup failed: " + (res.error.message || "Unknown error"));
            }
        })
        .catch((err) => console.error("Error:", err));
}
