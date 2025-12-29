console.log("home.js file loaded successfully!");


let LoginName = document.getElementById('input-user-name');
let loginPassword = document.getElementById('input-password');
let loginButton = document.getElementById('login-btn');




loginButton.addEventListener('click', function() {

    let userName = LoginName.value.trim();
    let password = loginPassword.value.trim();
    
    if (!userName || !password) {
        alert('Please enter both name and password');
        return;
    }

    let users = JSON.parse(localStorage.getItem('users')) || {};

    if(users[userName])
    {
        if(users[userName].password === password) {
            localStorage.setItem('currentUser', JSON.stringify(users[userName]));
            alert('Login successful!');
            window.location.href = './Tracker.html';
        }
        else {
            alert('Incorrect password. Please try again.');
        }
    }
    else 
    {
        users[userName] = {userName, password, transactions: []};
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(users[userName]));
        alert('New user created. Logging you in...');
        window.location.href = './Tracker.html';
    }
});