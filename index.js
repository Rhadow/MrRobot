let express = require('express');
let app = express();

app.set('port', (process.env.PORT || 3000));

app.get('/', (req, res) => {
    res.send('Hey there!');
});

app.listen(app.get('port'), () => {
    console.log('Node app is running on port', app.get('port'));
});
