import dom from 'potassium-es/src/DOM'
import App from 'potassium-es/src/App'
import som from 'potassium-es/src/SOM'
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
	constructor(dataObject = null, options = {}, inheritedOptions = {}) {
		super(dataObject, options, inheritedOptions)
		this.addClass('mode-switcher-component')
		this.setName('ModeSwitcherComponent')
		this._handleDisplayUpdate = this._handleDisplayUpdate.bind(this)

		this._displayModeTracker = DisplayModeTracker.Singleton
		this._displayModeTracker.addListener(this._handleDisplayUpdate, DisplayModeTracker.DisplayUpdatedEvent)

		this._attemptingMode = null

		// Exit button appears in portalDOM and immersiveSOM
		this._exitButton = new ButtonComponent(
			null,
			{
				text: lt('Exit'),
				usesFlat: false,
				usesPortalSpatial: false,
				usesImmersive: false
			},
			this.inheritedOptions
		).appendTo(this)
		this._exitButton.addListener((eventName, active) => {
			if (!active) return
			this.trigger(ModeSwitcherComponent.ModeChangedEvent, App.FLAT)
		}, ButtonComponent.ChangedEvent)

		// Portal button appears only in flatDOM
		this._portalButton = new ButtonComponent(
			null,
			{
				text: lt('Portal'),
				usesPortalOverlay: false,
				usesPortalSpatial: false,
				usesImmersive: false
			},
			this.inheritedOptions
		).appendTo(this)
		this._portalButton.addListener((eventName, active) => {
			if (!active) return
			this._attemptingMode = App.PORTAL
			this._showModal()
		}, ButtonComponent.ChangedEvent)

		// Immersive button appears only in flatDOM
		this._immersiveButton = new ButtonComponent(
			null,
			{
				text: lt('Immersive'),
				usesPortalOverlay: false,
				usesPortalSpatial: false,
				usesImmersive: false
			},
			this.inheritedOptions
		).appendTo(this)
		this._immersiveButton.addListener((eventName, active) => {
			if (!active) return
			this._attemptingMode = App.IMMERSIVE
			this._showModal()
		}, ButtonComponent.ChangedEvent)

		this._switchModal = dom.div({ class: 'switch-modal dom-modal' })
		dom
			.button(lt('Enter'))
			.appendTo(this._switchModal)
			.addEventListener('click', (ev) => {
				this._hideModal()
				this.trigger(ModeSwitcherComponent.ModeChangedEvent, this._attemptingMode)
				this._attemptingMode = null
			})
		dom
			.button(lt('Cancel'))
			.appendTo(this._switchModal)
			.addEventListener('click', (ev) => {
				this._hideModal()
				this._attemptingMode = null
			})

		this._updateDisplayedModes(
			this._displayModeTracker.portalCapable === true,
			this._displayModeTracker.immersiveCapable === true
		)
	}

	_showModal() {
		document.body.prepend(this._switchModal)
	}

	_hideModal() {
		document.body.removeChild(this._switchModal)
	}

	_handleDisplayUpdate(eventName, flatCapable, portalCapable, immersiveCapable) {
		this._updateDisplayedModes(portalCapable, immersiveCapable)
	}

	_updateDisplayedModes(portalCapable, immersiveCapable) {
		this._portalButton.flatDOM.style.display = portalCapable ? '' : 'none'
		this._immersiveButton.flatDOM.style.display = immersiveCapable ? '' : 'none'
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
