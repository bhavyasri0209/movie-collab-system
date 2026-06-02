function login() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    fetch("/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({email, password})
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message);
    });
}
function logout() {

    localStorage.removeItem("token");

    window.location.href =
        '/login-page';
}