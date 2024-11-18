// DOM Elements
const bookForm = document.getElementById("book-form");
const bookGrid = document.getElementById("book-grid");
const bookImageInput = document.getElementById("book-image");
const searchInput = document.getElementById("search-bar");
const themeToggle = document.getElementById("theme-toggle");
const hamburger = document.getElementById("hamburger");
const navbar = document.getElementById("navbar");
const pagination = document.getElementById("pagination");

// Library Array
let library = [];
const booksPerPage = 6; // Pagination setting
let currentPage = 1;

// Event Listeners
bookForm.addEventListener("submit", addBook);
searchInput.addEventListener("input", debounce(searchBooks, 300));
themeToggle.addEventListener("click", toggleTheme);
hamburger.addEventListener("click", () => navbar.classList.toggle("show"));

// Load library on page load
window.onload = () => {
    loadLibrary();
    loadTheme();
};

// Add Book Function
function addBook(e) {
    e.preventDefault();
    const title = document.getElementById("book-title").value;
    const author = document.getElementById("book-author").value;
    const genre = document.getElementById("book-genre").value;

    const book = {
        title,
        author,
        genre,
        image: bookImageInput.files[0]
            ? URL.createObjectURL(bookImageInput.files[0])
            : "default-cover.png",
    };

    library.push(book);
    saveLibrary();
    displayBooks();
    bookForm.reset();
}

// Display Books with Pagination
function displayBooks(page = 1) {
    bookGrid.innerHTML = "";
    pagination.innerHTML = "";

    const start = (page - 1) * booksPerPage;
    const end = start + booksPerPage;
    const booksToDisplay = library.slice(start, end);

    booksToDisplay.forEach((book, index) => {
        const bookCard = document.createElement("div");
        bookCard.classList.add("book-card");
        bookCard.innerHTML = `
            <img src="${book.image}" alt="Book Cover">
            <h3>${book.title}</h3>
            <p>${book.author}</p>
            <p><em>${book.genre}</em></p>
            <button onclick="removeBook(${start + index})">Remove</button>
        `;
        bookGrid.appendChild(bookCard);
    });

    // Pagination Controls
    const totalPages = Math.ceil(library.length / booksPerPage);
    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement("button");
        pageBtn.textContent = i;
        pageBtn.classList.add("pagination-btn");
        if (i === page) pageBtn.classList.add("active");
        pageBtn.addEventListener("click", () => {
            currentPage = i;
            displayBooks(i);
        });
        pagination.appendChild(pageBtn);
    }
}

// Remove Book
function removeBook(index) {
    library.splice(index, 1);
    saveLibrary();
    displayBooks(currentPage);
}

// Search Books with Debounce
function searchBooks() {
    const searchText = searchInput.value.toLowerCase();
    const filteredBooks = library.filter(
        (book) =>
            book.title.toLowerCase().includes(searchText) ||
            book.author.toLowerCase().includes(searchText)
    );
    displayFilteredBooks(filteredBooks);
}

function displayFilteredBooks(filteredBooks) {
    bookGrid.innerHTML = "";
    filteredBooks.forEach((book) => {
        const bookCard = document.createElement("div");
        bookCard.classList.add("book-card");
        bookCard.innerHTML = `
            <img src="${book.image}" alt="Book Cover">
            <h3>${book.title}</h3>
            <p>${book.author}</p>
            <p><em>${book.genre}</em></p>
        `;
        bookGrid.appendChild(bookCard);
    });
}

// Debounce Function
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Toggle Theme
function toggleTheme() {
    document.body.classList.toggle("light-theme");
    localStorage.setItem(
        "theme",
        document.body.classList.contains("light-theme") ? "light" : "dark"
    );
}

// Load Theme
function loadTheme() {
    if (localStorage.getItem("theme") === "light") {
        document.body.classList.add("light-theme");
    }
}

// Save Library
function saveLibrary() {
    localStorage.setItem("library", JSON.stringify(library));
}

// Load Library
function loadLibrary() {
    const storedLibrary = JSON.parse(localStorage.getItem("library"));
    if (storedLibrary) {
        library = storedLibrary;
        displayBooks();
    }
}
