import el from 'potassium-es/src/El'
import graph from 'potassium-es/src/Graph'

import Component from 'potassium-es/src/Component'

/**
ImageComponent handles the display of a single image.
*/
const ImageComponent = class extends Component {
	/**
	options:
		imageField ('image'): the name of the field in dataObject that holds the URL to the image
	*/
	constructor(dataObject=null, options={}){
		super(dataObject, Object.assign({
			imageField: 'image'
		},options))
		this.addClass('image-component')

		this._flatImg = el.img().appendTo(this.flatEl)
		this._portalImg = el.img().appendTo(this.portalEl)

		/** @todo add image to portal and immersive graph */

		this._updateFromData()
	}

	get imageURL(){ return this.dataObject.get(this.options.imageField) }

	_updateFromData(){
		this._flatImg.src = this.imageURL
		this._portalImg.src = this._flatImg.src
		/** @todo update portal and immersive graph */
	}
}

export default ImageComponent
