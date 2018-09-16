const http = require('http'),
    fs = require('fs'),
    url = require('url');


http.createServer((req, res) => {
    // 解决跨域问题的
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.setHeader("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.setHeader("X-Powered-By", ' 3.2.1')
    if (req.method == "OPTIONS")
        return res.end();

    let { pathname, query } = url.parse(req.url, true);

    var content1 = JSON.parse(fs.readFileSync("./combolist.json", "utf-8"));
    var content2 = JSON.parse(fs.readFileSync("./jqgridlist.json", "utf-8"));

    // -> combo ajax接口
    if(pathname === '/api/combolist'){
        res.end(JSON.stringify(content1));
    }

    if(pathname === '/api/jqgridlist'){
        res.end(JSON.stringify(content2));
    }
}).listen(8000);