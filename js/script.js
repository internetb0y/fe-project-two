const SAVED = 'saved-books';
const STORAGE = 'books-library';
const RENDER = 'render-books';
const books = [];

const generateId = () => {
    return + new Date();
}

const generateBook = (id, title, author, year, isComplete) => {
    return {
        id,
        title,
        author,
        year,
        isComplete
    };
}

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE, parsed);
        document.dispatchEvent(new Event(SAVED));
    }
}

function isStorageExist() {
    if (typeof(Storage) === undefined) {
        console.log("Web Storage Invalid !!!");
        return false;
    }

    return true;
}

function addBook() {
    const judul = document.querySelector('#title').value;
    const penulis = document.querySelector('#author').value;
    const tahun = document.querySelector('#year').value;

    const generatedID = generateId();
    const bookObj = generateBook(generatedID, judul, penulis, Number(tahun), false);
    books.push(bookObj);
    
    document.dispatchEvent(new Event(RENDER));
    saveData();
}

function makeBook(bookObj) {
    const bookTitle = document.createElement('h2');
    bookTitle.innerText = bookObj.title;

    const bookAuthor = document.createElement('p');
    bookAuthor.innerText = bookObj.author;

    const bookYear = document.createElement('p');
    bookYear.innerText = bookObj.year;

    const sectionList = document.createElement('section');
    sectionList.setAttribute('class', 'list');
    sectionList.setAttribute('id', `book-${bookObj.id}`);
    sectionList.appendChild(bookTitle);
    sectionList.appendChild(bookAuthor);
    sectionList.appendChild(bookYear);

    if (!bookObj.isComplete) {
        const buttonDone = document.createElement('button');
        buttonDone.setAttribute('class', 'btn');
        buttonDone.innerText = "Done";

        buttonDone.addEventListener('click', () => {
            doneBook(bookObj.id);
        })

        const buttonEdit = document.createElement('button');
        buttonEdit.setAttribute('class', 'btn');
        buttonEdit.innerText = "Edit";

        buttonEdit.addEventListener('click', (event) => {
            const update = document.querySelector('#update');
            update.showModal();

            const updateClose = document.querySelector('#update-close');

            updateClose.addEventListener('click', () => {
                update.close();
            })

            const updateSubmit = document.querySelector('#update-submit');

            updateSubmit.addEventListener('click', () => {
                editBook(bookObj.id);
                update.close();
            })
        })

        const buttonDelete = document.createElement('button');
        buttonDelete.setAttribute('class', 'btn');
        buttonDelete.innerText = "Delete";

        buttonDelete.addEventListener('click', () => {
            const choose = document.querySelector('#choose');
            choose.showModal();

            const close = document.querySelector('.close-button');
            
            close.addEventListener('click', () => {
                choose.close();
            })

            const remove = document.querySelector('.delete-button');

            remove.addEventListener('click', () => {
                deleteBook(bookObj.id);
                choose.close();
            })
        })

        const sectionButtonsComplete = document.createElement('section');
        sectionButtonsComplete.setAttribute('class', 'buttons');
        sectionButtonsComplete.appendChild(buttonDone);
        sectionButtonsComplete.appendChild(buttonEdit);
        sectionButtonsComplete.appendChild(buttonDelete);

        sectionList.appendChild(sectionButtonsComplete);
    } else {
        const buttonUndo = document.createElement('button');
        buttonUndo.setAttribute('class', 'btn');
        buttonUndo.innerText = "Undo";

        buttonUndo.addEventListener('click', () => {
            undoBook(bookObj.id);
        })

        const buttonDelete = document.createElement('button');
        buttonDelete.setAttribute('class', 'btn');
        buttonDelete.innerText = "Delete";

        buttonDelete.addEventListener('click', () => {
            const choose = document.querySelector('#choose');
            choose.showModal();

            const close = document.querySelector('.close-button');
            
            close.addEventListener('click', () => {
                choose.close();
            })

            const remove = document.querySelector('.delete-button');

            remove.addEventListener('click', () => {
                deleteBook(bookObj.id);
                choose.close();
            })
        })

        const sectionButtonsUncomplete = document.createElement('section');
        sectionButtonsUncomplete.setAttribute('class', 'buttons');
        sectionButtonsUncomplete.appendChild(buttonUndo);
        sectionButtonsUncomplete.appendChild(buttonDelete);

        sectionList.appendChild(sectionButtonsUncomplete);
    }

    return sectionList;
}

function findBook(bookId) {
    for (const book of books) {
        if (book.id === bookId) {
            return book;
        }
    }
    return null;
}

function doneBook(bookId) {
    const book = findBook(bookId);

    if (book == null) {
        return;
    }

    book.isComplete = true;
    document.dispatchEvent(new Event(RENDER));
    saveData();
}

function undoBook(bookId) {
    const book = findBook(bookId);

    if (book == null) {
        return;
    }

    book.isComplete = false;
    document.dispatchEvent(new Event(RENDER));
    saveData();
}

function findBookIndex(bookId) {
    for (const index in books) {
        if (books[index].id === bookId) {
            return index;
        }
    }

    return -1;
}

function deleteBook(bookId) {
    const book = findBookIndex(bookId);

    if (book === -1) {
        return;
    }

    books.splice(book, 1);
    document.dispatchEvent(new Event(RENDER));
    saveData();
}

function editBook(bookId) {
    const book = findBook(bookId);

    if (book == null) {
        return;
    }

    const judul = document.querySelector('#update-title').value;
    const penulis = document.querySelector('#update-author').value;
    const tahun = document.querySelector('#update-year').value;

    const bookObj = generateBook(bookId, judul, penulis, Number(tahun), false);

    const updatedBook = {...bookObj};

    if (judul === "" || penulis === "" || tahun === "") {
        const notif = document.querySelector('#notif-update');
        notif.showModal();

        const notifClose = document.querySelector('#close-update');

        notifClose.addEventListener('click', () => {
            notif.close();
        })
    } else {
        const bookIndex = findBookIndex(bookId);
        books.splice(bookIndex, 1, updatedBook);
                            
        document.dispatchEvent(new Event(RENDER));
        saveData();
    }
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE);
    let data = JSON.parse(serializedData);
   
    if (data !== null) {
        for (const book of data) {
            books.push(book);
        }
    }
   
    document.dispatchEvent(new Event(RENDER));
}

document.addEventListener('DOMContentLoaded', () => {
    const submitBook = document.querySelector('#form');

    submitBook.addEventListener('submit', (event) => {
        event.preventDefault();
        
        const exist = document.querySelector('#title').value;

        for (const book of books) {
            if (exist === book.title) {
                const notifDouble = document.querySelector('#notif-double');
                notifDouble.showModal();

                const notifClose = document.querySelector('#close-double');

                notifClose.addEventListener('click', () => {
                    notifDouble.close();
                })
                return;
            }
        }
        
        addBook();
    })

    const searchValue = document.querySelector('#box');

    searchValue.addEventListener('search', () => { 
        const searchText = searchValue.value.trim();

        document.querySelector('.uncomplete').innerHTML = '';
        document.querySelector('.complete').innerHTML = '';

        for (const book of books) {
            if (book.title.toLowerCase().includes(searchText.toLowerCase())) {
                const listBook = makeBook(book);
                const container = book.isComplete ? document.querySelector('.complete') : document.querySelector('.uncomplete');
                container.appendChild(listBook);
            }
        }
    })

    document.addEventListener(RENDER, function () {
        console.log(books);
        const clearTitle = document.querySelector('#title');
        clearTitle.value = '';

        const clearAuthor = document.querySelector('#author');
        clearAuthor.value = '';

        const clearYear = document.querySelector('#year');
        clearYear.value = '';

        const uncompleteBook = document.querySelector('.uncomplete');
        uncompleteBook.innerHTML = '';

        const completeBook = document.querySelector('.complete');
        completeBook.innerHTML = '';

        for (const book of books) {
            const listBook = makeBook(book);
            if (!book.isComplete) {
                uncompleteBook.appendChild(listBook);
            } else {
                completeBook.appendChild(listBook);
            }
        }
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }
})