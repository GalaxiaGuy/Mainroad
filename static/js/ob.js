clearForInitialSearch();

async function loadElement(observer, element) {
    observer.unobserve(element);
    let snippet = await httpRequest("GET", element.getAttribute('data-uri'));
    if (element.parentElement == null) {
        return;
    }
    element.removeAttribute('data-uri');
    element.innerHTML = snippet;
}

async function doSearchWithHistory(text) {
    history.pushState({"search" : text}, "Searching for: " + text, "/search/" + escape(text));
    await doSearch(text);
}

function forceSearch(term) {
    searchInput.value = term;
    doSearch(term);
}

async function doSearch(text) {
    let searchInput = document.getElementById('searchInput');
    if (!window.searchIndex) {
        var result = await httpRequest("GET", "/searchindex.json");
        window.searchIndex = JSON.parse(result);
    }
    if (searchInput.value.trim().toLowerCase() != text) {
        return;
    }
    let observer = new IntersectionObserver(items => {
        items.forEach(async item => {
            if (!item.isIntersecting) {
                return;
            }
            loadElement(observer, item.target);
        });
    }, {
        rootMargin: '0px',
        threshold: 0
    });
    let html = document.querySelector('html');
    let main = document.querySelector('main');
    main.querySelectorAll(".search__result").forEach( x => {
        observer.unobserve(x);
        x.parentElement.removeChild(x);
    });
    main.querySelectorAll(".search__header").forEach( x => {
        x.parentElement.removeChild(x);
    });
    main.querySelectorAll(".search__empty").forEach( x => {
        x.parentElement.removeChild(x);
    });
    if (text) {
        html.classList.add('search');
    } else {
        html.classList.remove('search');
        return;
    }

    let header = document.createElement('header');
    header.classList.add('search__header');
    header.innerHTML = '<h1 class="post__title">Searching for "' + text.trim() + '"</h1>';
    main.appendChild(header);

    let results = distinct(window.searchIndex, 'id');
    words = text.split(" ");
    words.forEach(word => {
        word = word.trim();
        if (word.length > 0) {
            results = results.filter(x => x.content.toLowerCase().includes(word) || x.title.toLowerCase().includes(word));
        }
    });
    if (results.length == 0) {
        let noResults = document.createElement('div');
        noResults.classList.add('warning');
        noResults.classList.add('search__empty');
        noResults.innerHTML = '<h1 class="warning__headline">No results</h1><p class="warning__text">Nothing could be found for your search term.</p>';
        main.appendChild(noResults);
    }
    results.forEach(async result => {
        let wrapper = document.createElement('div');
        wrapper.setAttribute('data-uri', new URL(result.uri).pathname + 'searchresult.html');
        wrapper.setAttribute('data-search', text);
        wrapper.classList.add('search__result');
        main.appendChild(wrapper);
        if (isVisible(wrapper)) {
            loadElement(observer, wrapper);
        }
        else {
            observer.observe(wrapper);
        }
        await sleep(10);
    });
}

window.addEventListener('load', () => {
    document.querySelectorAll(".future").forEach( x => {
        var date = new Date(x.dataset.date);
        if (date > Date.now()) {
            x.classList.add("confirmed");
        }
    });
    let searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('search', (event) => {
        doSearchWithHistory(searchInput.value.trim().toLowerCase());
    });
    searchInput.addEventListener('change', () => {
        if (searchInput.value == '') {
            doSearchWithHistory('');
        }
    });
    checkInitialSearch();
});

window.addEventListener('popstate', (event) => {
    if (event.state && event.state["search"]) {
        forceSearch(event.state["search"]);
    } else if (!checkInitialSearch()) {
        forceSearch('');
    }
});

function clearForInitialSearch() {
    let term = getSearchTerm();

    if (term) {
		let html = document.querySelector('html');
		html.classList.add("search");
    }
}

function checkInitialSearch() {
    let term = getSearchTerm();

    if (term) {
		forceSearch(term);
        return true;
    }
    return false;
}

function getSearchTerm() {
    if (window.location.pathname.startsWith('/search/')) {
        let parts = window.location.pathname.split('/');
        let term = unescape(parts[2]);
        return term;
    }
    let url = new URL(window.location.href);
    if (url.searchParams.has('q')) {
        return url.searchParams.get('q');
    }
    return null;
}

function httpRequest(method, url) {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(xhr.response);
            } else {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            }
        };
        xhr.onerror = function () {
            reject({
                status: this.status,
                statusText: xhr.statusText
            });
        };
        xhr.send();
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function distinct(myArr, prop) {
    return myArr.filter((obj, pos, arr) => {
        return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
}

function isVisible(element) {
    var rect = element.getBoundingClientRect();
    var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
    return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
  }
