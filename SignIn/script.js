function SignIn(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    const errorLabel = document.getElementById('error');
    errorLabel.textContent='';

    if (!validateEmail(email)) {
        errorLabel.textContent = 'Некоректний формат email';
        return;
    }
    if (password.length < 6 || password.length > 10) {
        errorLabel.textContent = 'Пароль має бути від 6 до 10 символів';
        return;
    }

    const savedEmail = localStorage.getItem('email');
    const savedPassword = localStorage.getItem('password');
    if (email === savedEmail && password === savedPassword) {
        if (localStorage.getItem('rememberMe') === 'false') {
            if (rememberMe) {
                localStorage.setItem('rememberMe', 'true');
            } 
        }
        localStorage.setItem('isSuccess', 'true');
        window.location.href = '/Users/adm/Desktop/Exam/JS/News/index.html';
    } 
    else {
        errorLabel.textContent = 'Невірний email або пароль';
    }
}

function Cancel(){
    localStorage.setItem('isSuccess', 'false');
    window.location.href = '/Users/adm/Desktop/Exam/JS/News/index.html';
}

function validateEmail(email) {
    const checkEmail = /^[\w\.-]+@[\w\.-]+\.[\w]{2,4}$/;
    return checkEmail.test(email);
}

window.onload = load()

function load(){
    if (localStorage.getItem('rememberMe') === 'true') {
        const savedEmail = localStorage.getItem('email');
        const savedPassword = localStorage.getItem('password');
        if (savedEmail && savedPassword) {
            document.getElementById('email').value = savedEmail;
            document.getElementById('password').value = savedPassword;
        }
    }
}