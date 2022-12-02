import css from '../css/style.css'
const axios = require('axios')
// get elements from DOM 
const keyword = document.getElementById('keyword')
const submit = document.getElementById('submit')
const result = document.querySelector('.result')

// function for get data from Open Library API 
const getData = () => {
  // empty the result element from previous research 
  result.innerHTML = ''
  // creating loader 
  const loading = document.createElement('p')
  loading.innerHTML = 'Loading...'
  result.append(loading)
  // reading the value in the input text and transform for being used in json url 
  const searchData = keyword.value.toLowerCase().split(' ').join('_')
  // with the axios's help asking for data from Open Library API 
axios.get(`https://openlibrary.org/subjects/${searchData}.json`)
.then(function (response) {
    // handle success
    // empty the loader 
    loading.innerHTML = ''
    // checking if the data exist 
    if(response.data.work_count === 0){
      const message = document.createElement('p');
      message.innerHTML = 'Sorry! Nothing found, try to use different words...'
      result.append(message)
    }else{
      console.table(response.data.works);
      // we receive an array of works and we loop it for show all data 
      response.data.works.forEach(work => {
        // crete a title and a cover to show 
        const title = document.createElement('h4')
        const cover = document.createElement('img')
        result.append(title,cover)
        title.innerHTML = work.title
       axios.get(`https://openlibrary.org${work.key}.json`)
       .then(res => {
        console.log(res)

        // checking if there is a cover otherwise use the generic photo
        !res.data.covers || res.data.covers === null 
        ? console.log('nessuna foto')
               // filter the array covers so we don't have 404 error
        : cover.src = `https://covers.openlibrary.org/b/id/${res.data.covers.filter(n => n != -1)[0]}-M.jpg`
       })
      });
    }
    
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
}

submit.addEventListener('click', getData)