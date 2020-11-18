var axios = require("axios").default;

var options = {
  method: 'GET',
  url: 'https://webit-news-search.p.rapidapi.com/search',
  params: {q: 'Bio Physics', language: 'en'},
  headers: {
    'x-rapidapi-key': 'fde2539db9msh31059f3e5c5d66dp196e7djsn5b9add792ab0',
    'x-rapidapi-host': 'webit-news-search.p.rapidapi.com'
  }
};

axios.request(options).then(function (response) {
	console.log(response.data.data.results);
}).catch(function (error) {
	console.error(error);
});