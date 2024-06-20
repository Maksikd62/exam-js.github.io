function SignUp(event) {
    event.preventDefault();
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    const errorLabel = document.getElementById('registerError');
    errorLabel.textContent='';

    if (!validateName(firstName) || !validateName(lastName)) {
        errorLabel.textContent = "Ім'я та прізвище повинні містити тільки букви";
        return;
    }
    if (!validateEmail(email)) {
        errorLabel.textContent = 'Некоректний формат email';
        return;
    }
    if (localStorage.getItem('email')===email) {
        errorLabel.textContent = 'Email вже зареєстрований';
        return;
    }
    if (password.length < 6 || password.length > 10) {
        errorLabel.textContent = 'Пароль має бути від 6 до 10 символів';
        return;
    }
    if (password !== confirmPassword) {
        errorLabel.textContent = 'Паролі не співпадають';
        return;
    }

    localStorage.setItem('email', email);
    localStorage.setItem('password', password);
    localStorage.setItem('name', `${firstName} ${lastName}`);
    if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
    } 
    else {
        localStorage.setItem('rememberMe', 'false');
    }
    localStorage.setItem('isSuccess', 'true');
    removeLocalStorage('weatherCity');
    removeLocalStorage('newsCategory');
    removeLocalStorage('galleryCategory');
    window.location.href = '/News/';
}

function validateEmail(email) {
    const checkEmail = /^[\w\.-]+@[\w\.-]+\.[\w]{2,4}$/;
    return checkEmail.test(email);
}

function validateName(name) {
    const checkName = /^[A-Za-zА-Яа-яІіЇїЄє]+$/;
    return checkName.test(name);
}

const removeLocalStorage = (key) => {
    localStorage.removeItem(key);
}