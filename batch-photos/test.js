const async = require('async')
const dns = require('dns');

let indexes = [0, 1, 2]
let names = ['i.ua', 'u.udddda', 'google.com']

_getNameAndLookup = (index, callback) => {
	dns.lookup(names[index], (err, address, family) => {
		return callback(err, [address, family])
	})
}

async.map(indexes, _getNameAndLookup, (err, results) => {
  console.log('all done', err, results);
});

/*dns.lookup('i.ua', (a,b,c) => {
	console.log(a,b,c)
})*/