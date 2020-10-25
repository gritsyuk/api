const https = require('https');

https.get('https://pbs.twimg.com/profile_images/1060122402204606464/Uy0ltR1b.jpg', (res) => {


  res.on('data', (d) => {
    console.log(d);
  });

}).on('error', (e) => {
  console.error(e);
});
