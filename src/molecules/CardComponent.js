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
	@param {string} [options.titleField=title]
	@param {string} [options.captionField=caption]
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
		)
			.appendTo(this)
			.addClass('card-title-component')
			.setName('CardTitleComponent')

		this._captionComponent = new LabelComponent(
			dataObject,
			{
				textField: this.options.captionField,
				textColor: 0x999999
			},
			this.inheritedOptions
		)
			.appendTo(this)
			.addClass('card-caption-component')
			.setName('CardCaptionComponent')
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
