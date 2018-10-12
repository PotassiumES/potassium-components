import el from 'potassium-es/src/El'
import App from 'potassium-es/src/App'
import graph from 'potassium-es/src/Graph'
import Component from 'potassium-es/src/Component'
import { lt, ld, ldt } from 'potassium-es/src/Localizer'
import DisplayModeTracker from 'potassium-es/src/DisplayModeTracker'

import ButtonComponent from '../atoms/ButtonComponent.js'

import ButtonGroupComponent from '../molecules/ButtonGroupComponent.js'

/**
ModeSwitcherComponent allows the user to switch between flat, portal, and immersive display modes.
*/
const ModeSwitcherComponent = class extends ButtonGroupComponent {
	/**
	@param {DataObject} [dataObject=null]
	@param {Object} [options=null]
	*/
	constructor(dataObject = null, options = {}) {
		super(dataObject, options)
		this.addClass('mode-switcher-component')
		this._portalGraph.name = this._immersiveGraph.name = 'ModeSwitcherComponent'
		this._handleDisplayUpdate = this._handleDisplayUpdate.bind(this)

		this._displayModeTracker = DisplayModeTracker.Singleton
		this._displayModeTracker.addListener(this._handleDisplayUpdate, DisplayModeTracker.DisplayUpdatedEvent)

		this._attemptingMode = null

		// Exit button appears in portalEl and immersiveGraph
		this._exitButton = new ButtonComponent(null, { text: lt('Exit') })
		this._exitButton.flatEl.style.display = 'none'
		this._exitButton.portalGraph.visible = false
		this._exitButton.addListener((eventName, value) => {
			if (!value) return
			this.trigger(ModeSwitcherComponent.ModeChangedEvent, App.FLAT)
		}, ButtonComponent.ChangedEvent)
		this.appendComponent(this._exitButton)

		// Portal button appears only in flatEl
		this._portalButton = new ButtonComponent(null, { text: lt('Portal') })
		this._portalButton.portalEl.style.display = 'none'
		this._portalButton.portalGraph.visible = false
		this._portalButton.immersiveGraph.visible = false
		this._portalButton.addListener((eventName, value) => {
			if (!value) return
			this._attemptingMode = App.PORTAL
			this._showModal()
		}, ButtonComponent.ChangedEvent)
		this.appendComponent(this._portalButton)

		// Immersive button appears only in flatEl
		this._immersiveButton = new ButtonComponent(null, { text: lt('Immersive') })
		this._immersiveButton.portalEl.style.display = 'none'
		this._immersiveButton.portalGraph.visible = false
		this._immersiveButton.immersiveGraph.visible = false
		this._immersiveButton.addListener((eventName, value) => {
			if (!value) return
			this._attemptingMode = App.IMMERSIVE
			this._showModal()
		}, ButtonComponent.ChangedEvent)
		this.appendComponent(this._immersiveButton)

		this._switchModal = el.div({ class: 'switch-modal modal' })
		el.button('go')
			.appendTo(this._switchModal)
			.addEventListener('click', ev => {
				this._hideModal()
				this.trigger(ModeSwitcherComponent.ModeChangedEvent, this._attemptingMode)
				this._attemptingMode = null
			})
		el.button('cancel')
			.appendTo(this._switchModal)
			.addEventListener('click', ev => {
				this._hideModal()
				this._attemptingMode = null
			})

		this._updateDisplayedModes(
			this._displayModeTracker.portalCapable === true,
			this._displayModeTracker.immersiveCapable === true
		)
	}

	_showModal() {
		document.body.appendChild(this._switchModal)
	}

	_hideModal() {
		document.body.removeChild(this._switchModal)
	}

	_handleDisplayUpdate(eventName, flatCapable, portalCapable, immersiveCapable) {
		this._updateDisplayedModes(portalCapable, immersiveCapable)
	}

	_updateDisplayedModes(portalCapable, immersiveCapable) {
		this._portalButton.flatEl.style.display = portalCapable ? '' : 'none'
		this._immersiveButton.flatEl.style.display = immersiveCapable ? '' : 'none'
	}

	handleSwitchFailed(mode) {
		switch (mode) {
			case App.FLAT:
				this._exitButton.showAlert()
				return
			case App.PORTAL:
				this._portalButton.showAlert()
				return
			case App.IMMERSIVE:
				this._immersiveButton.showAlert()
				return
		}
	}
}

ModeSwitcherComponent.ModeChangedEvent = 'mode-changed'

export default ModeSwitcherComponent
