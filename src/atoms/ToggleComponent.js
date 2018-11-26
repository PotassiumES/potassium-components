import dom from 'potassium-es/src/DOM'
import som from 'potassium-es/src/SOM'
import Component from 'potassium-es/src/Component'

import ImageComponent from 'potassium-components/src/atoms/ImageComponent'

/**
ToggleComponent shows a triangle and represents an open or closed state
*/
const ToggleComponent = class extends Component {
	/**
	@param {DataObject} [dataObject=null]
	@param {Object} [options=null]
	*/
	constructor(dataObject = null, options = {}, inheritedOptions = {}) {
		super(
			dataObject,
			Object.assign(
				{
					flatDOM: dom.img({
						src: '/static/potassium-components/images/left-arrow.png'
					}),
					portalDOM: dom.img({
						src: '/static/potassium-components/images/left-arrow.png'
					}),
					name: 'ToggleComponent'
				},
				options
			),
			inheritedOptions
		)
		this.addClass('toggle-component')
		this._opened = false

		if (this.usesPortalSpatial) {
			this._portalOBJ = som.obj('/static/potassium-components/models/toggle-component.obj', () => {
				this.portalSOM.styles.geometryIsDirty = true
			})
			this._portalOBJ.name = 'ToggleComponentOBJ'
			this._portalSOM.add(this._portalOBJ)
		}

		if (this.usesImmersive) {
			this._immersiveOBJ = som.obj('/static/potassium-components/models/toggle-component.obj', () => {
				this.immersiveSOM.styles.geometryIsDirty = true
			})
			this._immersiveOBJ.name = 'ToggleComponentOBJ'
			this._immersiveSOM.add(this._immersiveOBJ)
		}
	}

	handleAction(actionName, value, actionParameters) {
		super.handleAction(actionName, value, actionParameters)
		if (actionName === '/action/activate' && value) {
			this.toggle()
		}
	}

	get opened() {
		return this._opened
	}

	open() {
		if (this._opened) return
		this._opened = true
		this.addClass('open')
		this.portalSOM.styles.layoutIsDirty = true
		this.immersiveSOM.styles.layoutIsDirty = true
		this.trigger(ToggleComponent.ToggleEvent, this._opened)
	}

	close() {
		if (this._opened === false) return
		this._opened = false
		this.removeClass('open')
		this.portalSOM.styles.layoutIsDirty = true
		this.immersiveSOM.styles.layoutIsDirty = true
		this.trigger(ToggleComponent.ToggleEvent, this._opened)
	}

	toggle(open) {
		if (typeof open === 'boolean') {
			if (open) {
				this.close()
			} else {
				this.open()
			}
			return
		}
		if (this._opened) {
			this.close()
		} else {
			this.open()
		}
	}
}

ToggleComponent.ToggleEvent = Symbol('toggled')

export default ToggleComponent
