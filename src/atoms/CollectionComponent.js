import el from 'potassium-es/src/El'
import graph from 'potassium-es/src/Graph'

import Component from 'potassium-es/src/Component'

/**
CollectionComponent tracks a DataCollection's membership.
It appropriately adds and removes sub-Components for each item in the collection.
*/
const CollectionComponent = class extends Component {
	constructor(dataObject=null, options={}){
		super(dataObject, options)
		this.addClass('collection-component')
		console.error('Unimplemented')
	}
}

export default CollectionComponent
