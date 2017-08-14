const http = require('http');
const express = require('express');
const fs = require('fs');
const app = express();
const readline = require('readline');
const marked = require('marked');
const notesDirPath = './notes/';
app.set('view engine', 'pug');

app.locals.catolog = [];
const translateNotes = (id) => {
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
  const md = fs.readFileSync(notesDirPath + id, 'utf-8');
  return marked(md);
}
const updateCatolog = () => {
  const filePromise = new Promise((resolve, reject) => {
    fs.readdir(notesDirPath, (err, files) => {
      const _files = [];
      if(err) {
        reject(err);
      };
      files.forEach((val) => {
        if(val.substr(-3) === ".md") {
          _files.push(val);
        }
      });
      resolve(_files);
    });
  }).catch(function(err) {
    console.log('error:' + err); 
  }); 
  filePromise.then((files) => {
    const promises = files.map((val) => {
      return new Promise((resolve, reject) => {
        const rl = readline.createInterface({
          input: fs.createReadStream(`${notesDirPath}/${val}`),
        });
        rl.on('line', (line) => {
          resolve({
            filename: val,
            title: line.replace(/^#+/, '').trim(),
          });
          rl.close();
        });
      });
    });
    Promise.all(promises).then((items) => {
      app.locals.catolog = items;
      console.log(items);
    }).catch((err) => {
      console.log('files read error: ' + err);
    });
  });
};

updateCatolog();

app.get('/', (req, res) => {
  res.render('index', { items: app.locals.catolog });
});
app.get('/article;id=:id', (req, res) => {
  const path = app.locals.catolog[req.params.id].filename;
  res.send(translateNotes(path));
});
app.use(express.static('public'));

const server = app.listen(3000, () => {
  const{ address, port } = server.address();
  console.log(`listen ${address}:${port}`);
});
