const content = document.querySelector(".grid");
const modal = document.querySelector(".modal");
const img = document.querySelector(".modal img");
const loadmore = document.querySelector("#loadmore");
const search = document.querySelector("#search-form");
const input = document.querySelector("#search");


const API_KEY = "563492ad6f91700001000001fd021ebab48f4956a6c900cfff0a4393";
const baseUrl = "https://api.pexels.com/v1/curated";
const searchUrl = "https://api.pexels.com/v1/search";
var page_index = 1;
var isSearch = false;
var current_query = '';

async function fetchImage(baseUrl) {
    const data = await (
        await fetch(baseUrl, {
            method: "GET",
            headers: { Accept: "application/js", Authorization: API_KEY },
        })
    ).json();
    return data;
}

function generateHTML(photos) {
    if (photos.length == 0) {
        content.insertAdjacentHTML(
            "beforeend",
            `
        <div class="item">
            <p>Không tìm thấy kết quả nào</p>
        </div>
        `
        );
    }
    photos.forEach((item) => {
        content.insertAdjacentHTML(
            "beforeend",
            `
        <div class="item">
            <img src="${item.src.large}"/>
        </div>
        `
        );

        content.lastElementChild.addEventListener("click", () => {
            img.src = item.src.large;
            modal.classList.toggle("hide");
        });
    });
}


document.addEventListener("DOMContentLoaded", async () => {
    const page = 1;
    const url = `${baseUrl}?page=${page}`;
    const data = await fetchImage(url);
    generateHTML(data.photos);
});

modal.addEventListener("click", (event) => {
    modal.classList.toggle("hide");
});

async function loadMore() {
    let page = ++page_index;
    let url;
    if (isSearch) {
        url = searchUrl + `?query=${current_query}&page=${page}`;
    } else {
        url = baseUrl + `?page=${page}`;
    }

    const data = await fetchImage(url);
    generateHTML(data.photos);
}

loadmore.addEventListener("click", async () => {
    await loadMore(isSearch);
});

async function seachImage(query) {
    const query_string = String(query);
    const page = 1;
    const url = `${searchUrl}?query=${query_string}&page=${page}`;
    return await fetchImage(url);
}

search.addEventListener("submit", async (e) => {
    e.preventDefault();
    content.innerHTML = "";
    const data = await seachImage(input.value);
    isSearch = true;
    current_query = String(input.value);
    generateHTML(data.photos);
});
