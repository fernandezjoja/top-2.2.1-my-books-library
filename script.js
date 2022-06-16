let myLibrary = [];
const booksGrid = document.querySelector(".books-grid");
let numberOfBooks = 0;
const btn_AddBook = document.querySelector("#btn-add");

btn_AddBook.addEventListener("click", openNewBookModal);
myLibrary.push(new Book("David Copperfield", "Charles Dickens", 300, true));
myLibrary.push(new Book("The End Of The Beginning", "Avi", 140, true));
myLibrary.push(new Book("Robinson Crusoe", "James Joyce", 210, false));
refreshMyLibrary();

const newBookModal = document.querySelector("#newBookModal");
const newBookModal__X = document.querySelectorAll(".modal__X")[0];
newBookModal__X.addEventListener("click", (e) => closeModal(e.target.parentNode.parentNode));
const btnNewBookSubmit = document.querySelector('#submit-new-book');
btnNewBookSubmit.addEventListener("click", submitNewBook);

const bookInfoModal = document.querySelector("#book-info-modal");
const bookInfoModal__X = document.querySelectorAll(".modal__X")[1];
bookInfoModal__X.addEventListener("click", (e) => closeModal(e.target.parentNode.parentNode));

window.addEventListener("click", (e) => closeModal(e.target));

function Book(title, author, pages, isRead) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.isRead = isRead;
  this.coverRed = Math.floor((161 - 70) * Math.random()) + 70;
  this.coverBlue = Math.floor((161 - 70) * Math.random()) + 70;
  this.coverGreen = Math.floor((161 - 70) * Math.random()) + 70;
}

function refreshMyLibrary() {
  removeDOMBooks();
  for (let i = 0; i < myLibrary.length; i++) {
    addNewBookToLibrary(myLibrary[i]);
  }
}

function removeDOMBooks() {
  let booksGridItems = booksGrid.children.length;
  for (let i = 0; i < booksGridItems; i++) {
    booksGrid.children[0].remove();
  }
}

//#region Modals Setup --------------------------------------------------------

function closeModal(modal) {
  if (modal === newBookModal) {
    clearNewBookForm();
    newBookModal.style.display = "none";
  }
  else if (modal === bookInfoModal){
    bookInfoModal.style.display = "none";
  }
}

function openNewBookModal() {
  newBookModal.style.display = "block";
}

function closeNewBookModal() {
  clearNewBookForm();
  newBookModal.style.display = "none";
}

function submitNewBook() {
  let title = document.querySelector("#input-name").value;
  let author = document.querySelector("#input-author").value;
  let pages = document.querySelector("#input-pages").value;
  let read = document.querySelector("#input-read").checked;
  const bookToAdd = new Book(title, author, pages, read);
  if (!validateNewBookInfo(bookToAdd)) return;
  addNewBookToLibrary(bookToAdd);
  closeNewBookModal();
}

function validateNewBookInfo(book) {
  if (book.title.length > 75) {
    if (confirm("Title too long! Max Title length is 75 characters. Would you like to set the additional characters to '...'?")) book.title = book.title.substring(0, 72) + "...";
    else return false;
  }
  if (book.author.length > 75) {
    if (confirm("Author too long! Max Author length is 75 characters. Would you like to set the additional characters to '...'?")) book.author = book.author.substring(0, 72) + "...";
    else return false;
  }
  if (book.pages < 0 || book.pages % 1 != 0) {
    alert("Pages invalid!");
    return false;
  }
  if (book.title.length == 0) {
    alert("No Title!");
    return false;
  }
  if (book.author.length == 0) {
    alert("No Author!");
    return false;
  }
  return true;
}

function clearNewBookForm() {
  document.querySelector("#input-name").value = "";
  document.querySelector("#input-author").value = "";
  document.querySelector("#input-pages").value = "";
  document.querySelector("#input-read").checked = false;
}

function openBookInfoModal(e) {
  let book = myLibrary[parseInt(e.target.parentNode.parentNode.getAttribute("data-id"))];
  document.querySelector("#book-info__title").textContent = book.title;
  document.querySelector("#book-info__author").textContent = book.author;
  document.querySelector("#book-info__pages").textContent = book.pages;
  document.querySelector("#book-info__read").textContent = book.isRead ? "Yes" : "No";
  bookInfoModal.style.display = "block";
}

function closeBookInfoModal() {

}

//#endregion Modals Setup -----------------------------------------------------

//#region DOM Book Creation ---------------------------------------------------

function addNewBookToLibrary(book) {
  booksGrid.appendChild(createDOMBook(book));
}

function removeBookFromLibrary(e) {
  let id = parseInt(e.target.parentNode.parentNode.getAttribute("data-id"));
  myLibrary.splice(id, 1);
  refreshMyLibrary();
}

function createDOMBook(book) {
  const domBook = document.createElement("div");
  domBook.classList.add("book");
  domBook.setAttribute("data-id", `${booksGrid.children.length}`);
  domBook.appendChild(createDOMBookCover(book));
  domBook.appendChild(createDOMBookReadActions(book));
  domBook.appendChild(createDOMBookButtons());
  return domBook;
}

function createDOMBookCover(book) {
  const domBook_cover = document.createElement("div");
  domBook_cover.classList.add("book__cover");
  domBook_cover.style["background-color"] = `rgb(${book.coverRed}, ${book.coverBlue}, ${book.coverGreen})`;
  const domBook_title = document.createElement("p");
  domBook_title.classList.add("book__title");
  domBook_title.textContent = book.title;
  domBook_cover.appendChild(domBook_title);
  return domBook_cover;
}

function createDOMBookReadActions(book) {
  const domBook_readActions = document.createElement("div");
  domBook_readActions.classList.add("read-actions");
  const domBook_readInput = document.createElement("input");
  domBook_readInput.setAttribute("type", "checkbox");
  domBook_readInput.setAttribute("id", `book${numberOfBooks}`);
  domBook_readInput.checked = book.isRead;
  domBook_readInput.addEventListener("change", () => book.isRead = domBook_readInput.checked);
  domBook_readActions.appendChild(domBook_readInput);
  const domBook_readLabel = document.createElement("label");
  domBook_readLabel.setAttribute("for", `book${numberOfBooks}`);
  domBook_readLabel.textContent = "Read";
  numberOfBooks++;
  domBook_readActions.appendChild(domBook_readLabel);
  return domBook_readActions;
}

function createDOMBookButtons() {
  const domBook_buttons = document.createElement("div");
  domBook_buttons.classList.add("book__buttons");
  const btn_delete = document.createElement("div");
  btn_delete.classList.add("button");
  btn_delete.classList.add("button--delete");
  btn_delete.textContent = "Delete";
  btn_delete.addEventListener("click", removeBookFromLibrary);
  domBook_buttons.appendChild(btn_delete);
  const btn_open = document.createElement("div");
  btn_open.classList.add("button");
  btn_open.classList.add("button--open");
  btn_open.textContent = "Open";
  btn_open.addEventListener("click", openBookInfoModal);
  domBook_buttons.appendChild(btn_open);
  return domBook_buttons;
}

//#endregion New Book's Modal functions ---------------------------------------

//#region Add Sample Book -------
document.querySelector("#btn-addSample").addEventListener("click", addSampleBook);
let sampleIndex = 0;
let sampleBooks = [];
sampleBooks.push(new Book("In Search of Lost Time", "Marcel Proust", 101, false));
sampleBooks.push(new Book("Ulysses", "James Joyce", 102, false));
sampleBooks.push(new Book("Don Quixote", "Miguel De Cervantes", 103, false));
sampleBooks.push(new Book("100 Years of Solitude", "Gabriel Garcia Marquez", 104, false));
sampleBooks.push(new Book("The Great Gatsby", "F. Scott Fitzgerald", 105, false));
sampleBooks.push(new Book("Moby Dick", "Herman Melville", 106, false));
sampleBooks.push(new Book("War and Peace", "Leo Tolstoy", 107, false));
sampleBooks.push(new Book("Hamlet", "William Shakespeare", 108, false));
sampleBooks.push(new Book("The Odyssey", "Homer", 109, false));
sampleBooks.push(new Book("Madame Bovary", "Gustave Flaubert", 110, false));
sampleBooks.push(new Book("The Divine Comedy", "Dante Alighieri", 111, false));
sampleBooks.push(new Book("Lolita", "Vladimir Nabokov", 112, false));
sampleBooks.push(new Book("The Brothers Karamazov", "Fyodor Dostoyevsky", 113, false));
sampleBooks.push(new Book("Crime and Punishment", "Fyodor Dostoyevsky", 114, false));
sampleBooks.push(new Book("Wuthering Heights", "Emily Brontë", 115, false));
sampleBooks.push(new Book("The Catcher in the Rye", "J. D. Salinger", 116, false));
sampleBooks.push(new Book("Pride and Prejudice", "Jane Austen", 117, false));
sampleBooks.push(new Book("The Adventures of Huckleberry Finn", "Mark Twain", 118, false));
sampleBooks.push(new Book("Anna Karenina", "Leo Tolstoy", 119, false));
sampleBooks.push(new Book("Alice's Adventures in Wonderland", "Lewis Carroll", 120, false));

function addSampleBook() {
  myLibrary.push(sampleBooks[sampleIndex]);
  addNewBookToLibrary(sampleBooks[sampleIndex]);
  sampleIndex++;
  if (sampleIndex >= sampleBooks.length) sampleIndex = 0;
}