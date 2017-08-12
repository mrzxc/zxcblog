const express = require('express');
const fs = require('fs');
const app = express();

app.set('view engine', 'pug');

function updateCatolog() {
  var marked = require('marked');
  marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: false
  });
  
  const md = fs.readFileSync('./notes/2017-8-12.md', 'utf-8');
  console.log(md)
  console.log(marked(md));
  return marked(md);
}
updateCatolog();
app.get('/', (req, res) => {
  //res.sendfile('./note_htmls/2017-8-12.html');
  res.send(updateCatolog());
  console.log(updateCatolog());
});

app.use(express.static('public'));

const server = app.listen(3000, function () {
  const{ address, port } = server.address();
  console.log(`listen ${address}:${port}`);
});

