import css from '../css/style.css'
const axios = require('axios')
// get elements from DOM 
const keyword = document.getElementById('keyword')
const submit = document.getElementById('submit')
const result = document.querySelector('.result')
const categories = document.querySelector('nav')
const categoriesList = document.querySelectorAll('nav li')

function draw(className, elToAppend, type){
  let newEl = document.createElement(type)
  newEl.classList.add(className)
  elToAppend.append(newEl)
  return newEl
}
// function for get data from Open Library API 
function callApi(subject){
    // empty the result element from previous research 
    result.innerHTML = ''
    // creating loader 
    const loading = document.createElement('p')
    loading.innerHTML = 'Loading...'
    result.append(loading)
  axios.get(`https://openlibrary.org/subjects/${subject}.json`)
.then(function (response) {
    // handle success
    // empty the loader 
    loading.innerHTML = ''
    // checking if the data exist 
    if(response.data.work_count === 0){
      // show a message when nothing is found 
      const message = draw('msg',result, 'p')
      message.innerHTML = "Sorry! Nothing found, try to use different words..."
    }else{
      console.table(response.data.works);
      // we receive an array of works and we loop it for show all data 
      response.data.works.forEach(work => {
        // crete a title and a cover to show 
        const cardBook = draw('card-book', result, 'div')
        const title = draw('title', cardBook, 'h4')
        const cover = draw('book-img', cardBook, 'div')
        title.innerHTML = work.title
       axios.get(`https://openlibrary.org${work.key}.json`)
       .then(res => {
        console.log(res)

        // checking if there is a cover otherwise use the generic photo
        !res.data.covers || res.data.covers === null 
        ? console.log('nessuna foto')
               // filter the array covers so we don't have 404 error
        : cover.style.backgroundImage = `url(https://covers.openlibrary.org/b/id/${res.data.covers.filter(n => n != -1)[0]}-M.jpg)`
       
        // click on book title give a book's description 
        title.addEventListener('click', (e) => {
          const thisTitle = e.target
          const infoModule = draw('info', result, 'div')
          const closeBtn = draw('close', infoModule, 'button')
          const titleModule = draw('module-title', infoModule, 'p')
          const textModule = draw('module-text', infoModule, 'p')
          closeBtn.innerHTML = 'X'
          titleModule.innerHTML = 'Description:'
          textModule.innerHTML = res.data.description?.value || res.data.description || `Sorry! We don't have any description about this title`
          
          // remove the module
          closeBtn.addEventListener('click', () => {
            infoModule.remove()
          })
          // remove the module when click outside the info box
          document.addEventListener('click', (e) => {
            if(e.target != infoModule && e.target != thisTitle && e.target != titleModule && e.target != textModule){
            infoModule.remove()
            }
          })
          // remove info box after pressing Escape button 
          document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape'){
              infoModule.remove()
            }
          })
        })
      })
      });
    }
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
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
    e.target.classList.toggle('active')
    const subject = e.target.innerHTML.toLowerCase()
    callApi(subject)
}
submit.addEventListener('click', getData)
categories.addEventListener('click', categoriesData)

// activate search after press Enter key 
keyword.addEventListener('keydown', (e) => {
  console.log(e.key)
  if(e.key === 'Enter'){
    getData()
  }
})