import el from 'potassium-es/src/El'
import graph from 'potassium-es/src/Graph'
import App from 'potassium-es/src/App'

import ButtonComponent from '../atoms/ButtonComponent.js'

import Component from 'potassium-es/src/Component'

/**
ModeSwitcherComponent allows the user to switch between flat, portal, and immersive display modes.

@todo Extend ButtonGroupComponent
*/
const ModeSwitcherComponent = class extends Component {
	constructor(dataObject=null, options={}){
		super(dataObject, options)
		this.addClass('mode-switcher-component')
		this._mode = null

		// Exit button appears in portalEl and immersiveGraph
		this._exitButton = new ButtonComponent(null, { text: 'Exit' })
		this._exitButton.flatEl.style.display = 'none'
		this._exitButton.portalGraph.visible = false
		this._exitButton.addListener((eventName, value) => {
			if(!value)return
			this.trigger(ModeSwitcherComponent.ModeChangedEvent, App.FLAT)
		}, ButtonComponent.ChangedEvent)
		this.appendComponent(this._exitButton)

		// Portal button appears only in flatEl
		this._portalButton = new ButtonComponent(null, { text: 'Portal' })
		this._portalButton.portalEl.style.display = 'none'
		this._portalButton.portalGraph.visible = false
		this._portalButton.immersiveGraph.visible = false
		this._portalButton.addListener((eventName, value) => {
			if(!value)return
			this.trigger(ModeSwitcherComponent.ModeChangedEvent, App.PORTAL)
		}, ButtonComponent.ChangedEvent)
		this.appendComponent(this._portalButton)

		// Immersive button appears only in flatEl
		this._immersiveButton = new ButtonComponent(null, { text: 'Immersive' })
		this._immersiveButton.portalEl.style.display = 'none'
		this._immersiveButton.portalGraph.visible = false
		this._immersiveButton.immersiveGraph.visible = false
		this._immersiveButton.addListener((eventName, value) => {
			if(!value)return
			this.trigger(ModeSwitcherComponent.ModeChangedEvent, App.IMMERSIVE)
		}, ButtonComponent.ChangedEvent)
		this.appendComponent(this._immersiveButton)
	}
}

ModeSwitcherComponent.ModeChangedEvent = 'mode-changed'

export default ModeSwitcherComponent