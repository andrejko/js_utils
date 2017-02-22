const async = require('async')
const fs = require('fs')
const path = require('path')
const _ = require('lodash')
const request = require('request')

let filesPath = 'D:/js_utils/test'

console.time('filesWrite')

const _createFile = (name, callback) => {
	request('http://i.ua/', (error, response, body) => {
		console.log(error)
	  fs.writeFileSync(path.join(filesPath, name + '.txt'), body)

	  callback(null)
	})
}

let names = _.range(1, 40)

async.map(names, _createFile, (err, results) => {
	console.timeEnd('filesWrite')
})