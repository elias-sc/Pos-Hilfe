const signupForm = document.getElementById('signup-form');
const loginForm = document.getElementById('login-form');

const signupPopup = document.getElementById("signup-container");
const loginPopup = document.getElementById("login-container");

let currentUser = "";

window.addEventListener("load", (event) => {
    currentUser = localStorage.getItem('user');
    
    if(currentUser){
        currentUser = JSON.parse(currentUser);
        document.getElementsByClassName("account-dropdown")[0].style.display = "flex";
        document.getElementById("account-name").innerHTML = currentUser.username;
    } else {
        document.getElementById("buttons").style.display = "block";
    }
});

signupForm.addEventListener('submit', function (event) {
    event.preventDefault();

    if(event.submitter.className != "submit-button"){
        return;
    }
        

    const formData = new FormData(event.target);
    const formDataObject = {};
    formData.forEach((value, key) => {
        formDataObject[key] = value;
    });

    if(formDataObject["username"].length > 20){
        errorContainer = document.getElementById("signup-error");
        errorContainer.style.display = "block";
        errorContainer.innerHTML = "Username can't be longer than 20 Characters";
        return;
    }

    if(formDataObject["email"].length > 50){
        errorContainer = document.getElementById("signup-error");
        errorContainer.style.display = "block";
        errorContainer.innerHTML = "Email can't be longer than 50 Characters";
        return;
    }

    fetch('https://pos-hilfe.onrender.com/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formDataObject),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Signup Response:', data);

        if(data.success == false){
            errorContainer = document.getElementById("signup-error");
            errorContainer.style.display = "block";
            errorContainer.innerHTML = getErrorMessage(data.message);
        } else {
            localStorage.setItem('user', JSON.stringify(data.user));
            currentUser = data.user;
            location.reload();
            hideAllPopups();
        }
    })
    .catch((error) => {
        console.error('Signup Error:', error);
    });


});

loginForm.addEventListener('submit', function (event) {
    event.preventDefault();

    if(event.submitter.className != "submit-button"){
        return;
    }

    const formData = new FormData(event.target);
    const formDataObject = {};
    formData.forEach((value, key) => {
        formDataObject[key] = value;
    });

    fetch('https://pos-hilfe.onrender.com/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formDataObject),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Login Response:', data);

        if(data.success == false){
            errorContainer = document.getElementById("login-error");
            errorContainer.style.display = "block";
            errorContainer.innerHTML = getErrorMessage(data.message);
        } else {
            localStorage.setItem('user', JSON.stringify(data.user));
            currentUser = data.user;
            location.reload();
            hideAllPopups();
        }
    })
    .catch((error) => {
        console.error('Login Error:', error)
    });
});

function logout(){
    localStorage.setItem('user', "");
    currentUser = "";
    location.reload();
}

function showSignup(){
    showPopup(signupPopup);
}

function showLogin(){
    showPopup(loginPopup);
}

function hideAllPopups(){
    const otherPopups = document.getElementsByClassName("popup");
    
    for(let i = 0; i < otherPopups.length; i++){
        hidePopup(otherPopups[i]);
    }
}

function showPopup(element){
    element.parentElement.style.visibility = "visible";
    element.parentElement.style.backdropFilter = "blur(5px)";
    element.style.visibility = "visible";
    element.style.opacity = "1";
    element.style.transform = "translate(0%, -50%)"
}

function hidePopup(element){

    element.parentElement.style.backdropFilter = "none";

    element.style.opacity = "0";
    element.style.transform = "translate(0%, -30%)"

    setTimeout(() => {
        element.parentElement.style.visibility = "hidden";
        element.style.visibility = "hidden";
    }, 500);


}

function getErrorMessage(message){
    if(message.includes("username")){
        return "Username is already in use";

    } else if(message.includes("email")){
        return "Email is already in use";

    } else if(message.includes("credentials")){
        return "Username or Password is incorrect";

    } else {
        return "Something went wrong";
    }
}
