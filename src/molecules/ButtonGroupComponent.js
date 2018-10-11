import el from 'potassium-es/src/El'
import graph from 'potassium-es/src/Graph'

import Component from 'potassium-es/src/Component'

/**
ButtonGroupComponent gathers together {@link ButtonComponent}s.
*/
const ButtonGroupComponent = class extends Component {
	constructor(dataObject=null, options={}){
		super(dataObject, options)
		this.addClass('button-group-component')
		this._portalGraph.name = 'ButtonGroupComponent'
		this._immersiveGraph.name = 'ButtonGroupComponent'
	}
}

export default ButtonGroupComponent
