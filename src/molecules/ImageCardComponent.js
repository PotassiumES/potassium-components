import ImageComponent from 'potassium-components/src/atoms/ImageComponent'

import CardComponent from 'potassium-components/src/molecules/CardComponent'

/**
ImageCardComponent is a {@link CardComponent} that shows a single image and metadata.
It shows the image, an optional title, and an optional caption.
*/
const ImageCardComponent = class extends CardComponent {
	/**
	options:
		imageField ('image'): the field name in the DataObject that holds the URL to an image
		titleField ('title'): the field name in the DataObject that holds the title of the image
		captionField ('caption'): the field name in the dataObject that holds the caption
	*/
	constructor(dataObject, options={}){
		super(dataObject, Object.assign({
			imageField: 'image',
			titleField: 'title',
			captionField: 'caption'
		}, options))
		this.addClass('image-card-component')

		this._imageComponent = new ImageComponent(dataObject, {
			imageField: this.options.imageField
		}).appendTo(this.mainComponent)
	}
}

export default ImageCardComponent