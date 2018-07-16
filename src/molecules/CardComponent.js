import el from 'potassium-es/src/El'
import graph from 'potassium-es/src/Graph'

import Component from 'potassium-es/src/Component'

import LabelComponent from 'potassium-components/src/atoms/LabelComponent'
import HeadingComponent from 'potassium-components/src/atoms/HeadingComponent'

/**
CardComponent contains a list of Audio-, Video-, or Image- Components and a caption LabelComponent
*/
const CardComponent = class extends Component {
	/**
	options:
		titleField: 'title',
		captionField: 'caption'
	*/
	constructor(dataObject=null, options={}){
		super(dataObject, options)
		this.addClass('card-component')

		/** the main content, like an image or video */
		this._mainComponent = new Component().appendTo(this)
		this._mainComponent.addClass('main')

		this._titleComponent = new HeadingComponent(dataObject, {
			textField: this.options.titleField
		}).appendTo(this)

		this._captionComponent = new LabelComponent(dataObject, {
			textField: this.options.captionField
		}).appendTo(this)
	}

	/** the {@link Component} in which we display the main content, like an image or video */
	get mainComponent(){ return this._mainComponent }
}

export default CardComponent
