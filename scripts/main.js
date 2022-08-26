var url = `https://api.chucknorris.io/jokes`;

document.addEventListener('DOMContentLoaded', function() {
    let searchBox = document.getElementById(`search-box`);
    searchBox.focus();
}, false);

function getRandomJoke() {
    let newUrl = `${url}/random`;
    fetch(newUrl).then(function (response) {
        return response.json();
    }).then(function (data) {
        changeClass('default-mode');
        let jokeBoxText = document.getElementById(`random-joke-result`);
        jokeBoxText.style.fontSize = '25px';
        jokeBoxText.innerHTML = `<a href='${data.url}' target='_blank'>${data.value}</a>`;
        resize_to_fit();
    }).catch(function (err) {
        console.warn(`Something went wrong.`, err);
    });
}

function resize_to_fit() {
    let jokeBox = document.getElementById(`random-joke-box`);
    let jokeBoxText = document.getElementById(`random-joke-result`);
    let jokeBoxTextFontSize = window.getComputedStyle(jokeBoxText).fontSize;
    
    while (jokeBoxText.offsetHeight >= jokeBox.offsetHeight) {
        jokeBoxText.style.fontSize = jokeBoxTextFontSize.replace(/\D/g,'') - 1 + 'px';
        jokeBoxTextFontSize = window.getComputedStyle(jokeBoxText).fontSize;
    }
}

function search(terms) {
    return new Promise((resolve, reject) => {
        let newUrl = `${url}/search?query=${terms}`;
        fetch(newUrl).then(function (response) {
            return response.json();
        }).then(function (data) {
            let jokes = data.result;
            resolve(jokes);
        }).catch(function (err) {
            reject(err);
        });
    });
}

function getErrorMessage() {
    let termsBox = document.getElementById('search-box');
    termsBox.classList.add('error-message');
    termsBox.value = 'You Must Type Something';
    termsBox.disabled = true;
    setTimeout(function () {
        termsBox.classList.remove('error-message');
        termsBox.disabled = false;
        termsBox.value = '';
    }, 3000);
}

function getSearchResult() {
    let terms = document.getElementById('search-box').value
    let jokeBox = document.getElementById(`search-result`);
    if (terms) {
        terms = terms.toLowerCase();
        search(terms).then(function (jokes){
            changeClass('search-result-mode');
            jokeBox.innerHTML = ``;
            jokes.map(function (joke) {
                jokeBox.innerHTML += `<li>
                                        <a href='${joke.url}' target='_blank'>${joke.value}</a>
                                    </li>`;
            });
        });
    } else {
        getErrorMessage();
    }
}

function getLucky() {
    let terms = document.getElementById('search-box').value
    if (terms) {
        terms = terms.toLowerCase();
        search(terms).then(function (jokes){
            changeClass('default-mode');
            let number = Math.floor(Math.random() * jokes.length);
            let jokeBoxText = document.getElementById(`random-joke-result`);
            jokeBoxText.style.fontSize = '25px';
            jokeBoxText.innerHTML = `<a href='${jokes[number].url}' target='_blank'>${jokes[number].value}</a>`;
            resize_to_fit();
        });
    } else {
        getErrorMessage();
    }
}

function changeClass(className) {
    let body = document.querySelector('body');

    if (!body.classList.contains(className)) {
        let loadingScreen = document.getElementById('loading-screen');
        loadingScreen.style.display = 'flex';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, "3000")
        body.className = className;
    }
}