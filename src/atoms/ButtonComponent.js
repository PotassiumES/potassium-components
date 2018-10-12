import el from 'potassium-es/src/El'
import graph from 'potassium-es/src/Graph'

import Component from 'potassium-es/src/Component'

/**
ButtonComponent displays a button, natch.
*/
const ButtonComponent = class extends Component {
	/**
	@param {DataObject} [dataObject]
	@param {Object} [options]
	@param {number} [options.textSize]
	@param {number} [options.textHeight]
	@param {number} [options.textColor]
	*/
	constructor(dataObject=null, options={}){
		super(dataObject, Object.assign({
			flatEl: el.button({ class: 'button' }),
			portalEl: el.button({ class: 'button' }),
			textSize: 0.08,
			textHeight: 0.01,
			textColor: 0x444444,
			portalOverlay: true,
			portalSpatial: false
		}, options))
		this.addClass('button-component')
		this.portalGraph.name = this.immersiveGraph.name = 'ButtonComponent'

		this._text = ''

		let textMaterial = graph.meshLambertMaterial({
			color: this.options.textColor
		})

		this._portalText = graph.text('', textMaterial, null, {
			size: this.options.textSize,
			height: this.options.textHeight
		})

		this._immersiveText = graph.text('', textMaterial, null, {
			size: this.options.textSize,
			height: this.options.textHeight
		})

		if(!options.portalGraph){
			this._portalButtonObj = graph.obj('/static/potassium-components/models/Button.obj')
			this._portalButtonObj.name = 'Bracket'
			this.portalGraph.add(this._portalButtonObj)
			this.portalGraph.add(this._portalText)
		}

		if(!options.immersiveGraph){
			this._immersiveButtonObj = graph.obj('/static/potassium-components/models/Button.obj')
			this._immersiveButtonObj.name = 'Bracket'
			this.immersiveGraph.add(this._immersiveButtonObj)
			this.immersiveGraph.add(this._immersiveText)
		}

		this.addListener((eventName, actionName, value, actionParameters) => {
			switch(actionName){
				case '/action/activate':
					this.trigger(ButtonComponent.ChangedEvent, value)
					break
			}
		}, Component.ActionEvent)

		this.text = this.options.text || ''
	}

	/**
	Shows a visible alert for a short time and plays an audio alert
	*/
	showAlert(){
		this.addClass('primary-alert')
		Component.AudioManager.playSound('primary-alert')
		setTimeout(() => {
			this.removeClass('primary-alert')
		}, 1100)
	}

	/** @type {string} */
	get text(){ return this._text }

	/** @param {string} value */
	set text(value){
		this._text = value
		this.flatEl.innerHTML = this._text
		this.portalEl.innerHTML = this._text
		this._portalText.setText(this._text)
		this._immersiveText.setText(this._text)
	}
}
ButtonComponent.ChangedEvent = 'button-changed'

/** @todo Give component librarys a nice way to load a set of sounds instead of loading them in Component modules */
Component.AudioManager.setSound('primary-alert', '/static/potassium-components/audio/primary-alert.wav')

export default ButtonComponent
