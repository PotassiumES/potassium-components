import el from 'potassium-es/src/El'
import graph from 'potassium-es/src/Graph'

import Component from 'potassium-es/src/Component'

/**
TextComponent holds a block of text which may include paragraphs but not other media.

@todo Can it be hypertext and embed images and other media?
*/
const TextComponent = class extends Component {
	constructor(dataObject=null, options={}){
		super(dataObject, options)
		this.addClass('text-component')

		console.error('Unimplemented')
	}
}

export default TextComponent
