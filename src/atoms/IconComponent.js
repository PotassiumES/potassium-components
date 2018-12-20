import dom from 'potassium-es/src/DOM.js'
import som from 'potassium-es/src/SOM.js'
import App from 'potassium-es/src/App.js'

import Component from 'potassium-es/src/Component.js'

/**
IconComponent displays an image in the DOM or a geometry in the SOM
*/
const IconComponent = class extends Component {
	/**
	@param {DataObject} [dataObject]
	@param {Object} [options]
	@param {string} [options.imageURL]
	@param {string} [options.modelURL]
	*/
	constructor(dataObject = null, options = {}, inheritedOptions = {}) {
		super(dataObject, options, inheritedOptions)
		this.addClass('icon-component')
		this.setName('IconComponent')

		if (this.usesDOM) {
			this._image = new Image()
			this._image.src = this.options.imageURL || ''
			if (this.usesFlat) this.flatDOM.appendChild(this._image)
		} else {
			this._image = null
		}

		this._model = null // lazily loaded
	}

	_getModel() {
		if (this._model !== null) return this._model
		this._model = som.obj(this.options.modelURL)
		return this._model
	}

	handleDisplayModeChange(eventName, mode, displayModeTracker) {
		switch (mode) {
			case App.FLAT:
				if (this.usesFlat) this.flatDOM.appendChild(this._image)
				break
			case App.PORTAL:
				if (this.usesPortalOverlay) this.portalDOM.appendChild(this._image)
				if (this.usesPortalSpatial) this.portalSOM.add(this._getModel())
				if (this.usesPortalSpatial) this.portalSOM.styles.geometryIsDirty = true
				break
			case App.IMMERSIVE:
				if (this.usesImmersive) this.immersiveSOM.add(this._getModel())
				if (this.usesImmersive) this.immersiveSOM.styles.geometryIsDirty = true
				break
		}
	}
}

export default IconComponent
