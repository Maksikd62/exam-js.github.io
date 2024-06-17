document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('isSuccess')==='true'){
        const buttonSign=document.getElementById('buttonSign');
        buttonSign.innerText='Вийти';
    }
});

function SignIn(){
    const buttonSign=document.getElementById('buttonSign');
    if(localStorage.getItem('isSuccess')==='true'){
        buttonSign.innerText='Увійти/Зареєструватися';
        localStorage.setItem('isSuccess', 'false');
    }
    else{
        window.location.href = '/Users/adm/Desktop/Exam/JS/SignIn/index.html';
    }
}