import dom from 'potassium-es/src/DOM'
import som from 'potassium-es/src/SOM'

import Component from 'potassium-es/src/Component'

import LabelComponent from 'potassium-components/src/atoms/LabelComponent'
import HeadingComponent from 'potassium-components/src/atoms/HeadingComponent'

/**
CardComponent contains a list of Audio-, Video-, or Image- Components and a caption LabelComponent
*/
const CardComponent = class extends Component {
	/**
	@param {Object} [options]
	@param {string} [options.titleField]
	@param {string} [options.captionField]
	*/
	constructor(dataObject = null, options = {}, inheritedOptions = {}) {
		super(
			dataObject,
			Object.assign(
				{
					titleField: 'title',
					captionField: 'caption'
				},
				options
			),
			inheritedOptions
		)
		this.addClass('card-component')
		this.setName('CardComponent')

		/** the main content, like an image or video */
		this._mainComponent = new Component(null, {}, this.inheritedOptions).appendTo(this)
		this._mainComponent.addClass('main-component')
		this._mainComponent.setName('MainComponent')

		this._titleComponent = new HeadingComponent(
			dataObject,
			{
				textField: this.options.titleField
			},
			this.inheritedOptions
		).appendTo(this)
		this._titleComponent.addClass('card-title-component')

		this._captionComponent = new LabelComponent(
			dataObject,
			{
				textField: this.options.captionField,
				textColor: 0x999999
			},
			this.inheritedOptions
		).appendTo(this)
		this._captionComponent.addClass('card-caption-component')
		const captionVerticalOffset = -0.1
		this._captionComponent.immersiveSOM.position.set(0, captionVerticalOffset, 0)
		this._captionComponent.portalSOM.position.set(0, captionVerticalOffset, 0)
	}

	/** the {@link Component} in which we display the main content, like an image or video */
	get mainComponent() {
		return this._mainComponent
	}

	get titleComponent() {
		return this._titleComponent
	}
	get captionComponent() {
		return this._captionComponent
	}
}

export default CardComponent
