const server = require("http");
const fs = require("fs");
const url = require("url");
const replaceTemplate = require("./modules/replaceTemplate");

const PORT = 3000;

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

server
  .createServer((req, res) => {
    const { pathname, query } = url.parse(req.url, true);

    // overview page
    if (pathname === "/" || pathname === "/overview") {
      res.writeHead(200, {
        "content-type": "text/html"
      });

      const cardHTML = dataObj
        .map((el) => replaceTemplate(tempCard, el))
        .join("");

      const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardHTML);

      res.end(output);
      //   product page
    } else if (pathname === "/product") {
      res.writeHead(200, {
        "content-type": "text/html"
      });

      const product = dataObj[query.id];
      const productPage = replaceTemplate(tempProduct, product);

      res.end(productPage);
      //   API
    } else if (pathname === "/api") {
      res.writeHead(200, {
        "content-type": "application/json"
      });
      res.end(data);
      //   not found page
    } else {
      res.writeHead(404, {
        "content-type": "text/html"
      });
      res.end("<h1>page not found</h1>");
    }
  })
  .listen(PORT, () => {
    console.log(`server run on : localhost:${PORT}`);
  });
