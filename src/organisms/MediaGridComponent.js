import dom from 'potassium-es/src/DOM'
import som from 'potassium-es/src/SOM'
import Component from 'potassium-es/src/Component'

import CardComponent from 'potassium-components/src/molecules/CardComponent'
import CollectionComponent from './CollectionComponent.js'

/**
MediaGridComponent shows a CSS grid of {@link CardComponent}s like images, videos, audio tracks, etc.
*/
const MediaGridComponent = class extends Component {
	/**
	@param {DataCollection} dataObject
	@param {Object} [options={}]
	@param {Component} [itemComponent=CardComponent] the options object to pass to the item class constructor
	@param {Object} [itemOptions={}] the Component **class** used for each item in the DataCollection
	*/
	constructor(dataObject = null, options = {}) {
		super(
			dataObject,
			Object.assign(
				{
					itemOptions: {},
					itemComponent: CardComponent,
					usesPortalOverlay: false
				},
				options
			)
		)
		this.addClass('media-grid-component')
		this.setName('MediaGridComponent')

		this._collectionComponent = new CollectionComponent(dataObject, {
			itemComponent: this.options.itemComponent,
			itemOptions: this.options.itemOptions
		}).appendTo(this)

		/** @todo add pagination */
	}
}

export default MediaGridComponent
