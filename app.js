const alert = document.querySelector('.alert');
const form = document.querySelector('.grocery-form');
const grocery = document.getElementById('grocery');
const submitBtn = document.querySelector('.submit-btn');
const container = document.querySelector('.grocery-container');
const list = document.querySelector('.grocery-list');
const clearBtn = document.querySelector('.clear-btn');


// edit
let editElement;
let editFlag = false;
let editID = "";

/*=============== 
event
===============*/

// submit form
form.addEventListener('submit', addItem);
//clear items
clearBtn.addEventListener('click', clearItems);
//load items
window.addEventListener('DOMContentLoaded', setItem);

/*=============== 
functions
===============*/
function addItem(e) {
  e.preventDefault();
  const value = grocery.value;
  const id = new Date().getTime().toString();
  if (value && !editFlag) {
    createListItem(id, value);
    // display alert
    displayAlert("item added to the list", "success");
    //show container
    container.classList.add('show-container');
    // add local storage
    addToLocalStorage(id, value);
    // set back to default
    setBackToDefault();
  }
  else if (value && editFlag) {
    editElement.innerHTML = value;
    displayAlert("value changed", "success");
    //edit rocal strage
    editLocalStrage(editID, value);
    setBackToDefault();
  }
  else {
    displayAlert("please enter value", "danger");
  }
}

// display alert
function displayAlert(text, action) {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);

  // remove alert
  setTimeout(function () {
    alert.textContent = '';
    alert.classList.remove(`alert-${action}`);

  }, 1000);
}

//clear items
function clearItems() {
  const items = document.querySelectorAll('.grocery-item');
  if (items.length > 0) {
    items.forEach(function (item) {
      list.removeChild(item);
    });
  }
  container.classList.remove("show-container");
  displayAlert("emptylist", "danger");
  setBackToDefault();
  // localStorage.removeItem('list');
}

//delete function
function deletItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  const id = element.dataset.id;
  list.removeChild(element);
  if (list.children.length === 0) {
    container.classList.remove("show-container");
  }
  displayAlert("item removed", "danger");
  setBackToDefault();
  removeFromLocalStorage(id);
}

//edit function
function editItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  //set edit item
  editElement = e.currentTarget.parentElement.previousElementSibling;
  //set form
  grocery.value = editElement.innerHTML;
  editFlag = true;
  editID = element.dataset.id;
  submitBtn.textContent = "edit!";
}

//set back to defoult
function setBackToDefault() {
  grocery.value = "";
  editFlag = false;
  editID = "";
  submitBtn.textContent = "GO!";
}


/*=============== 
LOCAL STORAGE
===============*/
function addToLocalStorage(id, value) {
  const grocery = { id, value };
  let items = getLocalStorage();

  items.push(grocery);
  localStorage.setItem("list", JSON.stringify(items));
}

function removeFromLocalStorage(id) {
  let items = getLocalStorage();

  items = items.filter(function (item) {
    if (item.id !== id) {
      return item;
    }
  });
  localStorage.setItem("list", JSON.stringify(items));
}


function editLocalStrage(id, value) {
  let items = getLocalStorage();
  items = items.map(function (item) {
    if (item.id === id) {
      item.value = value;
    }
    return item;
  });
  localStorage.setItem("list", JSON.stringify(items));
}

function getLocalStorage() {
  return localStorage.getItem("list") ? JSON.parse(localStorage.getItem("list")) : [];
}

/*=============== 
SET UP ITEMS
===============*/
function setItem() {
  let items = getLocalStorage();
  if (items.length > 0) {
    items.forEach(function (item) {
      createListItem(item.id, item.value);
    });
    container.classList.add('show-container')
  }
}

function createListItem(id, value) {
  const element = document.createElement('article');
  // add class
  element.classList.add('grocery-item');
  // add id
  const attr = document.createAttribute('data-id');
  attr.value = id;
  element.setAttributeNode(attr);
  element.innerHTML = ` <p class="title">${value}</p>
              <div class="btn-container">
                <button type="button" class="edit-btn">
                  <i class="fas fa-edit"></i>
                </button>
                <button type="button" class="delete-btn">
                  <i class="fas fa-trash"></i>
                </button>
              </div>`;
  //delete & edit btn eventListner
  const deleteBtn = element.querySelector('.delete-btn');
  const editBtn = element.querySelector('.edit-btn');
  deleteBtn.addEventListener('click', deletItem);
  editBtn.addEventListener('click', editItem);
  // append child
  list.appendChild(element);
}