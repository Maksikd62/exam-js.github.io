const apiKey = 'CYQbfkzPKVIyGDuvsQrxLfPjaTafWIpEBqxIIFH5CycirYhChAUBkjnb';
const apiUrl = 'https://api.pexels.com/v1/search';
const perPage = 10;
let currentPage = 1;
let totalPages = 1;

document.addEventListener('DOMContentLoaded', function() {
    const isSuccess = localStorage.getItem('isSuccess');
    const selectedCategory = localStorage.getItem('galleryCategory');
    if (isSuccess === 'true') {
        const buttonSign = document.getElementById('buttonSign');
        buttonSign.innerText = 'Вийти';
    }
    if (isSuccess === 'true' && selectedCategory) {
        document.getElementById('photoType').value = selectedCategory;
        fetchPhotos();
    }
});

function SignIn() {
    const buttonSign = document.getElementById('buttonSign');
    const isSuccess = localStorage.getItem('isSuccess');
    if (isSuccess === 'true') {
        buttonSign.innerText = 'Увійти/Зареєструватися';
        localStorage.setItem('isSuccess', 'false');
    } else {
        window.location.href = '/SignIn/';
    }
}

function searchPhotos(e) {
    e.preventDefault();
    fetchPhotos();
};

async function fetchPhotos() {
    const query = document.getElementById('photoType').value;
    const isSuccess = localStorage.getItem('isSuccess');
    try {
        const response = await fetch(`${apiUrl}?query=${query}&per_page=${perPage}&page=${currentPage}`, {
            headers: {
                Authorization: apiKey
            }
        });
        if (isSuccess === 'true') {
            localStorage.setItem('galleryCategory', query);
        }
        const data = await response.json();
        totalPages = Math.ceil(data.total_results / perPage);
        displayPhotos(data.photos);
        updatePagination();
    } catch (error) {
        console.error('Error:', error);
    }
}

function displayPhotos(photos) {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = '';

    for (let i = 0; i < photos.length; i++) {
        const img = document.createElement('img');
        img.src = photos[i].src.medium;
        img.className = 'img';
        gallery.appendChild(img);
    }
}

function updatePagination() {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    const prevPageItem = document.createElement('li');
    prevPageItem.className = 'page-item' + (currentPage === 1 ? ' disabled' : '');
    const prevPageButton = document.createElement('button');
    prevPageButton.className = 'page-link';
    prevPageButton.textContent = 'Попередня';
    prevPageButton.addEventListener('click', () => changePage('prev'));
    prevPageItem.appendChild(prevPageButton);
    pagination.appendChild(prevPageItem);

    const startPage = Math.max(1, currentPage - 1);
    const endPage = Math.min(totalPages, startPage + 2);

    for (let i = startPage; i <= endPage; i++) {
        const pageItem = document.createElement('li');
        pageItem.className = 'page-item';
        const pageButton = document.createElement('button');
        pageButton.className = 'page-link';
        pageButton.textContent = i;
        pageButton.disabled = i === currentPage;
        if (i === currentPage) {
            pageItem.classList.add('active');
            pageButton.setAttribute('aria-current', 'page');
        }
        pageButton.addEventListener('click', () => goToPage(i));
        pageItem.appendChild(pageButton);
        pagination.appendChild(pageItem);
    }

    const nextPageItem = document.createElement('li');
    nextPageItem.className = 'page-item' + (currentPage === totalPages ? ' disabled' : '');
    const nextPageButton = document.createElement('button');
    nextPageButton.className = 'page-link';
    nextPageButton.textContent = 'Наступна';
    nextPageButton.addEventListener('click', () => changePage('next'));
    nextPageItem.appendChild(nextPageButton);
    pagination.appendChild(nextPageItem);
}


function changePage(direction) {
    if (direction === 'prev' && currentPage > 1) {
        currentPage--;
    } else if (direction === 'next' && currentPage < totalPages) {
        currentPage++;
    }
    fetchPhotos();
}

function goToPage(page) {
    currentPage = page;
    fetchPhotos();
}
