const bcrypt = require('bcrypt');
const password = 'pitaya123';
bcrypt.hash(password, 10).then(hash => {
    console.log('HASH:', hash);
    bcrypt.compare(password, hash).then(match => {
        console.log('VERIFIED:', match);
    });
});
