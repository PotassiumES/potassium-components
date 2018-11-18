import dom from 'potassium-es/src/DOM'
import som from 'potassium-es/src/SOM'

import Component from 'potassium-es/src/Component'

/**
MultiComponent holds a set of Components and shows one at a time.
*/
const MultiComponent = class extends Component {
	/**
	@param {DataObject} [dataObject=null]
	@param {Object} [options={}]
	@param {Component[]} [options.components=[]]
	*/
	constructor(dataObject = null, options = {}, inheritedOptions = {}) {
		super(
			dataObject,
			Object.assign(
				{
					components: []
				},
				options
			),
			inheritedOptions
		)
		this.addClass('multi-component')
		this.setName('MultiComponent')

		this._components = this.options.components
		this._currentComponent = null

		if (this._components.length > 0) {
			this.showAt(0)
		}
	}

	get components() {
		return this._components
	}

	*[Symbol.iterator]() {
		for (const component of this._components) {
			yield component
		}
	}

	/**
	@param {number} index - The index in this.components of the Component to show
	*/
	showAt(index) {
		if (index < 0 || index >= this._components.length) return false
		if (this._currentComponent) this.removeComponent(this._currentComponent)
		this._currentComponent = this._components[index]
		this.appendComponent(this._currentComponent)
		if(this.usesPortalSpatial) this.portalSOM.setGraphLayoutDirty()
		if(this.usesImmersive) this.immersiveSOM.setGraphLayoutDirty()
		return true
	}

	/**
	@param {Component} component - The component to show. It will be added to this.components if it isn't already in there
	*/
	show(component) {
		let index = this._components.indexOf(component)
		if (index === -1) {
			this._components.push(component)
			index = this._components.length - 1
		}
		this.showAt(index)
	}
}

export default MultiComponent
