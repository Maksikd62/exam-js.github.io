const apiKey = "a7d7854113ef42709d93344b25d70030";
document.addEventListener('DOMContentLoaded', function() {
    const storedCategory = localStorage.getItem('category');
    const isSuccess = localStorage.getItem('isSuccess');

    if (isSuccess === 'true'){
        const buttonSign=document.getElementById('buttonSign');
        buttonSign.innerText='Вийти';
    }
    if (isSuccess === 'true' && storedCategory) {
        document.getElementById('newCategory').value = storedCategory;
        fetchNews(1);
    }
});

function SignIn(){
    const buttonSign=document.getElementById('buttonSign');
    if(localStorage.getItem('isSuccess')==='true'){
        buttonSign.innerText='Увійти/Зареєструватися';
        localStorage.setItem('isSuccess', 'false');
    }
    else{
        window.location.href = '/SignIn/';
    }
}

function searchNews(e) {
    e.preventDefault();
    fetchNews(1);
}

async function fetchNews(page) {
    const category = document.getElementById("newCategory").value;
    const pageSize = 10;
    const url = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&pageSize=${pageSize}&page=${page}&apiKey=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.status === "ok") {
            displayNews(data.articles);
            setupPagination(data.totalResults, page, pageSize);
            localStorage.setItem('category', category);
        } else {
            document.getElementById('newsList').innerHTML = `<p>News not found</p>`;
            document.getElementById('pagination').innerHTML = '';
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        document.getElementById('newsList').innerHTML = `<p>Error fetching data</p>`;
        document.getElementById('pagination').innerHTML = '';
    }
}

function displayNews(news) {
    const newsList = document.getElementById('newsList');
    newsList.innerHTML = '';

    if (news && news.length > 0) {
        for (let i = 0; i < news.length; i++) {
            const article = news[i];

            const card = document.createElement('div');
            card.setAttribute("class", "card");
            card.style.width = '18rem';

            const img = document.createElement('img');
            img.setAttribute("class", "card-img-top");
            img.setAttribute("src", article.urlToImage || 'noimage.jpg');
            img.setAttribute("alt", article.title);

            const cardBody = document.createElement('div');
            cardBody.setAttribute("class", "card-body");

            const cardTitle = document.createElement('h5');
            cardTitle.setAttribute("class", "card-title");
            cardTitle.innerText = article.title;

            const cardText = document.createElement('p');
            cardText.setAttribute("class", "card-text");
            cardText.innerText = article.description || 'No description available.';

            const cardButton = document.createElement('a');
            cardButton.setAttribute("href", article.url);
            cardButton.setAttribute("class", "btn btn-primary");
            cardButton.innerText = "Детальніше";
            cardButton.setAttribute("onclick", "return checkAccess()");

            cardBody.appendChild(cardTitle);
            cardBody.appendChild(cardText);
            cardBody.appendChild(cardButton);

            card.appendChild(img);
            card.appendChild(cardBody);

            newsList.appendChild(card);
        }
    } 
    else {
        newsList.innerHTML = `<p>No news available</p>`;
    }
}

function setupPagination(totalResults, currentPage, pageSize) {
    const totalPages = Math.ceil(totalResults / pageSize);
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        if (i === currentPage) {
            pageButton.disabled = true;
        }
        pageButton.addEventListener('click', () => fetchNews(i));
        pagination.appendChild(pageButton);
    }
}

function checkAccess() {
    const isSuccess = localStorage.getItem('isSuccess');
    if (isSuccess === 'true') {
        return true;
    } 
    else {
        alert("Увійдіть, щоб переглянути новину детальніше.");
        return false;
    }
}
