var url = `https://api.chucknorris.io/jokes`;
var searchResults = new Array();
var resultStart = 0;
var resultEnd = 9;

document.addEventListener('DOMContentLoaded', function() {
    let searchBox = document.getElementById(`search-box`);
    searchBox.focus();
}, false);

// The Scroll Event.
window.addEventListener('scroll',function(){
    let scrollHeight = document.documentElement.scrollHeight;
    let scrollTop = document.documentElement.scrollTop;
    let clientHeight = document.documentElement.clientHeight;
    
    if( (scrollTop + clientHeight) > (scrollHeight - 5)){
        setTimeout(addResults(searchResults.slice(resultStart, resultEnd)), 1000);
    }
});

function backToDefaultMode() {
    let searchResultBox = document.getElementById('search-result');
    let jokeBoxText = document.getElementById(`random-joke-result`);
    let searchBox = document.getElementById(`search-box`);

    searchBox.value = ``;
    searchBox.focus();
    searchResultBox.innerHTML = ``;
    jokeBoxText.style.fontSize = '25px';
    jokeBoxText.innerHTML = ``;
    changeClass('default-mode');
}

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
            if(jokes.length != 0) {
                resolve(jokes);
            } else {
                resolve(false);
            }
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
    }, 1500);
}

function getSearchResult() {
    let terms = document.getElementById('search-box').value;
    if (terms) {
        terms = terms.toLowerCase();
        search(terms).then(function (jokes){
            let searchResultBox = document.getElementById('search-result');
            searchResultBox.innerHTML = ``;
            searchResults = [];
            resultStart = 0;
            resultEnd = 9;
            changeClass('search-result-mode');
            if(jokes) {
                jokes.map(function (joke) {
                    searchResults.push(joke);
                });
                addResults(searchResults.slice(resultStart, resultEnd));
            } else {
                searchResultBox.innerHTML = `<h1>Chuck Norris says no such thing</h1>`;
            }
        });
    } else {
        getErrorMessage();
    }
}

function addResults(jokes) {
    let searchResultBox = document.getElementById('search-result');
    jokes.map(function (joke) {
        searchResultBox.innerHTML += `<li>
        <a href='${joke.url}' target='_blank'>${joke.value}</a>
        </li>`;
    });
    
    resultStart += 10;
    resultEnd += 10;
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