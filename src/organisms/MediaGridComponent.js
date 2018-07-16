import el from 'potassium-es/src/El'
import graph from 'potassium-es/src/Graph'

import Component from 'potassium-es/src/Component'
import CollectionComponent from 'potassium-es/src/CollectionComponent'

import CardComponent from 'potassium-components/src/molecules/CardComponent'

/**
MediaGridComponent shows a CSS grid of {@link CardComponent}s like images, videos, audio tracks, etc.
*/
const MediaGridComponent = class extends Component {
	/**
	options:
		itemComponent: the {@link Component} class used for each item in the dataCollection

	@param {DataCollection} dataObject
	@param {Object} options
	*/
	constructor(dataObject=null, options={}){
		super(dataObject, Object.assign({
			itemComponent: CardComponent
		}, options))
		this.addClass('media-grid-component')

		this._collectionComponent = new CollectionComponent(dataObject, {
			itemComponent: this.options.itemComponent
		}).appendTo(this)

		/** @todo add pagination */
	}
}

export default MediaGridComponent
