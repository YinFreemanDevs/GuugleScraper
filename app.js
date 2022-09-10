const google = require('googlethis');
const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(express.static(__dirname + '/public'))
app.use(bodyParser.urlencoded({ extended: false }))


const options = {
  page: 0, 
  safe: false,
  additional_params: { 
    hl: 'es' 
  }
}
let result = [{
  title: null,
  description: null,
  url: null
}]


const pushing = async (x, response) => {
  result.push({
    title: response.results[x].title,
    description: response.results[x].description,
    url: response.results[x].url
  }) 
}



app.post('/', async (req, res) => {
  const text = req.body.textSearch
  const response = await google.search(text, options);
  x=1;
  while(x  < response.results.length){
    await pushing(x, response);
    x++;
  }

  let add = `<!DOCTYPE html> <html lang="en">`
  add += `<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="css/style.css">
  <title>Guugle</title>
  </head>`
  add += `<body>
  <div class="left"></div>
  <div class="mid">
      <h1>Guugle</h1>
      <form action="/" method="post">
          <input type="text" id="text" name="textSearch">
          <input type="submit" id="button" value="Send">
          </form>
  <br><br>`
  let i = 1;
  while(i < result.length){
    add += `
    <p>${result[i].title}</p>
    <p>${result[i].description}</p>
    <p><a href="${result[i].url}" target="_blank">${result[i].url}</a></p>
    <br><br>
  `
    i++;
  }
   
  add += `</div>
    <div class="right"></div>
  </body>
  </html>`
   
  
  let index = result.length-1;
  let o = 1;

  while(o <=index){
    result.pop()
    o++;

  }


  res.send(add);
})

app.get('/', (req,res)=>{
  const results = __dirname + '/public/index.html';
  res.sendFile(results);

})

app.listen(3000, () => {
  console.log('Servidor web iniciado');
});