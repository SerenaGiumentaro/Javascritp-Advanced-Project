import css from '../css/style.css'
const axios = require('axios')
// get elements from DOM 
const keyword = document.getElementById('keyword')
const submit = document.getElementById('submit')
const result = document.querySelector('.result')
const categories = document.querySelector('nav')
const categoriesList = document.querySelectorAll('nav li')
let allTheData = []


function draw(className, elToAppend, type){
  let newEl = document.createElement(type)
  newEl.classList.add(className)
  elToAppend.append(newEl)
  return newEl
}

// function for get data from Open Library API 
async function callApi(subject){
    // empty the result element from previous research 
    result.innerHTML = ''
    // creating loader 
    const loading = document.createElement('p')
    loading.innerHTML = 'Loading...'
    result.append(loading)
    try{
      const response = await axios.get(`https://openlibrary.org/subjects/${subject}.json`)
      // handle success
      // empty the loader 
  
      // checking if the data exist 
      if(response.data.work_count === 0){
        // show a message when nothing is found 
        const message = draw('msg',result, 'p')
        message.innerHTML = "Sorry! Nothing found, try to use different words..."
        loading.innerHTML = ''
        return
      }
      // we receive an array of works and we loop it for show all data 
      allTheData = []
  
      await Promise.all(response.data.works.map(async work => {
        const book = await createObjFromData(work)
        allTheData.push(book)
      }))
      console.log(allTheData)
      loading.innerHTML = ''
      renderBooks(allTheData)
  
    }
    catch(error){
      console.error(error)
    }

    }




// function for have data from input search console 
const getData = () => {
  // reading the value in the input text and transform for being used in json url 
  const searchData = keyword.value.toLowerCase().split(' ').join('_')
  // with the axios's help asking for data from Open Library API 
  callApi(searchData)
}

const categoriesData = (e) => {
    categoriesList.forEach(el => el.classList.remove('active'))
    if(e.target === categories){return}
    e.target.classList.toggle('active')
    const subject = e.target.dataset.categoria
    callApi(subject)
}
submit.addEventListener('click', getData)
categories.addEventListener('click', categoriesData)

// activate search after press Enter key 
keyword.addEventListener('keydown', (e) => {
  if(e.key === 'Enter'){
    getData()
  }
})
// function that create an oblect with all data 
async function createObjFromData(work){
  const book = {title: work.title, cover:'', author:'', description:''}

  const res = await axios.get(`https://openlibrary.org${work.key}.json`)  
  const bookInfo = res.data       
  // checking if there is a cover otherwise use the generic photo
  !bookInfo.covers || bookInfo.covers === null 
    ? book.cover = `url(../src/assets/Cover-not-found.png)`
          // filter the array covers so we don't have 404 error
    : book.cover = `url(https://covers.openlibrary.org/b/id/${bookInfo.covers.filter(n => n != -1)[0]}-M.jpg)`

  book.description = bookInfo.description?.value || bookInfo.description || `Sorry! We don't have any description about this title`
  const authorsRes = await axios.get(`https://openlibrary.org${bookInfo.authors[0].author.key}.json`)
          
  book.author = authorsRes.data.name
            
  return book                
}

function renderBook(book){
      // crete a title and a cover to show 
      const cardBook = draw('card-book', result, 'div')
      const title = draw('title', cardBook, 'h4')
      const author = draw('author', cardBook, 'h3')
      const cover = draw('book-img', cardBook, 'div')
      title.innerText = book.title
      author.innerText = book.author
      cover.style.backgroundImage = book.cover
      // click on book title give a book's description 
      cardBook.addEventListener('click', (e) => {showModule(e,book)})
   
      
}
function renderBooks(arrBook){
  arrBook.forEach(book => renderBook(book))
}

function showModule(e,book){
  const thisBook = e.target
  const infoModule = draw('info', result, 'div')
  const closeBtn = draw('close', infoModule, 'button')
  const titleModule = draw('module-title', infoModule, 'p')
  const textModule = draw('module-text', infoModule, 'p')
  closeBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20"><path d="m6.062 14.708-.77-.77L9.229 10 5.292 6.062l.77-.77L10 9.229l3.938-3.937.77.77L10.771 10l3.937 3.938-.77.77L10 10.771Z"/></svg>`
  titleModule.innerHTML = 'Description:'
  textModule.innerHTML = book.description
  // check if there's too much text and convert in scroll text
  if(infoModule.scrollHeight > window.innerHeight){
    infoModule.style.maxHeight = '80vh'
    infoModule.style.overflowY = 'scroll'
  }
  // remove the module
  closeBtn.addEventListener('click', infoModule.remove)
  // remove the module when click outside the info box
  document.addEventListener('click', (e) => {
    const hasClickedOutsideTheModule = e.target != infoModule && e.target != thisBook && e.target != titleModule && e.target != textModule
    if(hasClickedOutsideTheModule){
      infoModule.remove()
    }
  })
  // remove info box after pressing Escape button 
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape'){
      infoModule.remove()
    }
  })
}