import el from 'potassium-es/src/El'
import graph from 'potassium-es/src/Graph'

import Component from 'potassium-es/src/Component'

/**
SearchComponent gives the user an interface for setting search terms and receiving search results.
*/
const SearchComponent = class extends Component {
	/**
	@param {DataObject} [dataObject=null]
	@param {Object} [options=null]
	*/
	constructor(dataObject=null, options={}){
		super(dataObject, options)
		this.addClass('search-component')

		console.error('Unimplemented')
	}
}

export default SearchComponent
