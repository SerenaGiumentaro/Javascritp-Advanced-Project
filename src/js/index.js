import css from '../css/style.css'
const axios = require('axios')
const keyword = document.getElementById('keyword')
const submit = document.getElementById('submit')
const result = document.querySelector('.result')

const getData = () => {
  result.innerHTML = ''
  const loading = document.createElement('p')
  loading.innerHTML = 'Loading...'
  result.append(loading)
  const searchData = keyword.value.toLowerCase().split(' ').join('_')
  console.log(searchData)
axios.get(`https://openlibrary.org/subjects/${searchData}.json`)
.then(function (response) {
    // handle success
    loading.innerHTML = ''
    if(response.data.work_count === 0){
      const message = document.createElement('p');
      message.innerHTML = 'Sorry! Nothing found, try to use different words...'
      result.append(message)
    }else{
      console.table(response.data.works);
      response.data.works.forEach(work => {
        const title = document.createElement('h4')
        const cover = document.createElement('img')
        result.append(title,cover)
        title.innerHTML = work.title
       axios.get(`https://openlibrary.org${work.key}.json`)
       .then(res => {
        console.log(res)
        !res.data.covers
        ? console.log('nessuna foto')
        : cover.src = `https://covers.openlibrary.org/b/id/${res.data.covers[0]}-L.jpg`

       })
      });
    }
    
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .then(function () {
    // always executed
  });
}

submit.addEventListener('click', getData)