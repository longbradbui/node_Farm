// core modules //
const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');

// our modules //
const replaceTemplate = require('./modules.js/replaceTemplate');

////////////////////////////////////////////////////////
/////  FILE    /////
////////////////////////////////////////////////////////

const textIn = fs.readFileSync('./txt/input.txt', 'UTF-8');
console.log(textIn);
const textOut = `This is what we know about the avocado: ${textIn}.\nCeated on ${Date.now()}`;
fs.writeFileSync('./txt/output.txt', textOut);
console.log(`File written`);

////////////////////////////////////////////////////////
/////  SERVER   /////
////////////////////////////////////////////////////////

// replacing tag with approriate object properties

// directory to overview template
const templateOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
// directory to product card template
const templateCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
// directory to product template
const templateProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');
// read the data file once the program starting running
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));
console.log(slugs);
// create a server
const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  // OVERVIEW PAGE //
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    const cardsHTML = dataObj.map((el) => replaceTemplate(templateCard, el)).join('');
    const output = templateOverview.replace('{%PRODUCT_CARDS%}', cardsHTML);
    res.end(output);

    // PRODUCT PAGE //
  } else if (pathname === '/product') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    const product = dataObj[query.id];
    const output = replaceTemplate(templateProduct, product);
    console.log(query);
    res.end(output);

    // API //
  } else if (pathname === '/api') {
    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(data); // must be sent in String or Buffer

    // SERVER  NOT FOUND //
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'Hello-there',
    });
    res.end('<h1>Page Not Found</h1>');
  }
});

// PORT //
server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to request on port 8000');
});
