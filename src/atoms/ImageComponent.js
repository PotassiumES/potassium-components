import el from 'potassium-es/src/El'
import graph from 'potassium-es/src/Graph'

import Component from 'potassium-es/src/Component'

/**
ImageComponent handles the display of a single image.
*/
const ImageComponent = class extends Component {
	/**
	@param {Object} options see the {@link Component} options
	@param {string} [options.image] the URL of an image
	@param {string} [options.imageField] the name of the field in dataObject that holds the URL to the image
	*/
	constructor(dataObject=null, options={}){
		super(dataObject, Object.assign({
			image: null,
			imageField: null
		},options))
		this.addClass('image-component')
		this._updateFromData = this._updateFromData.bind(this)

		this._imageURL = ''

		this._flatImg = el.img().appendTo(this.flatEl)
		this._portalImg = el.img().appendTo(this.portalEl)

		/** @todo add image to portal and immersive graph */

		if(this.options.image){
			this.imageURL = this.options.image
		}
		if(this.dataObject && this.options.imageField){
			this.dataObject.addListener(this._updateFromData, `changed:${this.options.imageField}`)
			this._updateFromData()
		}
	}

	cleanup(){
		super.cleanup()
		if(this.dataObject && this.options.imageField){
			this.dataObject.removeListener(this._updateFromData)
		}
	}

	/** @type {string} */
	get imageURL(){ return this._imageURL }

	/** @param {string} value */
	set imageURL(value){
		if(value === this._imageURL) return
		this._imageURL = value
		this._flatImg.src = this._imageURL
		this._portalImg.src = this._imageURL
		/** @todo update portal and immersive graph */
	}

	_updateFromData(){
		if(!this.dataObject || !this.options.imageField) return
		this.imageURL = this.dataObject.get(this.options.imageField) || ''
	}
}

export default ImageComponent
