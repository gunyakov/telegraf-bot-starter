const buttons = require('./buttons')
const titles = require('./titles')
const errors = require('./errors')

class Titles {

	constructor() {
		this.dictionary = { ...titles, ...buttons, ...errors }
	}

	getText(key, insertions, language = 'ru') {
		const value = this.dictionary[key]
		if(!value) return key
		const string = value[language] || value
		return insertions?.length ? this.insert(string, insertions, language) : string
	}

	insert(string, insertions, language = 'ru') {
    let new_string
    for(const insertion of insertions) {
			const text = this.getText(insertion, undefined, language) || insertion
    	new_string = (new_string || string).replace('*', text)
    }
		return new_string
	}

	isInValue(key, text) {
		const value = this.dictionary[key]
    if(typeof value === 'string') return text === value
    if(typeof value === 'object') return Object.values(value).some(value => text === value)
    return false
	}

  hearsTrigger(key) {
    return (text) => this.isInValue(key, text)
  }
}

module.exports = new Titles();
