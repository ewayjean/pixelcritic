const fs = require('fs');
const file = 'C:\\\\Users\\\\edwar\\\\.gemini\\\\antigravity\\\\brain\\\\7580e25d-498e-4ebb-b197-f3742452e9d8\\\\scratch\\\\make_sql.js';
const content = fs.readFileSync(file, 'utf8');
const regex = /image_url:\s*['"](.*?)['"]/g;
let match;
const urls = [];
while((match = regex.exec(content)) !== null) {
  urls.push(match[1]);
}

const https = require('https');
const checkUrl = (url) => {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      resolve({ url, status: res.statusCode });
    }).on('error', (e) => {
      resolve({ url, status: e.message });
    });
  });
};

Promise.all(urls.map(checkUrl)).then(results => {
  const bad = results.filter(r => r.status !== 200);
  console.log('Total URLs:', results.length);
  console.log('Bad URLs:', JSON.stringify(bad, null, 2));
});
