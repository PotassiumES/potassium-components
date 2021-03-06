import dom from 'potassium-es/src/DOM'
import som from 'potassium-es/src/SOM'

import Component from 'potassium-es/src/Component'

import LabelComponent from '../atoms/LabelComponent.js'
import HeadingComponent from '../atoms/HeadingComponent.js'

import MenuComponent from '../molecules/MenuComponent.js'
import ModeSwitcherComponent from '../molecules/ModeSwitcherComponent.js'

/**
MastheadComponent contains:
- a brand Component
- a navigation MenuComponent
- a ModeSwitcherComponent

In flat mode, this will be a bar at the top of the page.
In portal mode, it will be a UI element in the top left of the window.
In immersive mode, it will be a nifty utility object that floats near the user.
*/
const MastheadComponent = class extends Component {
	/**
	@param {DataObject} [dataObject]
	@param {Object} options
	@param {string or Component} options.brand - the main title
	@param {string} options.brandAnchor - an activation URL for the brand 
	@param {Object[]} options.menuItems
	@param {string} options.menuItems.name
	@param {string} options.menuItems.anchor
	*/
	constructor(dataObject = null, options = {}, inheritedOptions = {}) {
		super(
			dataObject,
			Object.assign(
				{
					brand: null,
					brandAnchor: null,
					menuItems: [],
					usesPortalSpatial: false
				},
				options
			),
			inheritedOptions
		)
		this.addClass('masthead-component')
		this.setName('MastheadComponent')

		this._modeSwitcherComponent = new ModeSwitcherComponent(
			null,
			{
				usesPortalSpatial: false,
				usesImmersive: false
			},
			this.inheritedOptions
		).appendTo(this)
		this._modeSwitcherComponent.addListener((eventName, mode) => {
			this.trigger(MastheadComponent.MODE_REQUEST_EVENT, mode)
		}, ModeSwitcherComponent.ModeChangedEvent)

		if (this.options.brand instanceof Component) {
			this._brand = this.options.brand
		} else {
			const brandOptions = {}
			if (typeof this.options.brand === 'string') {
				brandOptions.text = this.options.brand
			}
			if (typeof this.options.brandAnchor === 'string') {
				brandOptions.activationAnchor = this.options.brandAnchor
			}
			this._brand = new HeadingComponent(null, brandOptions)
		}
		this._brand.addClass('brand-component')
		this._brand.setName('BrandComponent')
		this.appendComponent(this._brand)

		this._navigationMenu = new MenuComponent(null, {}, this.inheritedOptions).appendTo(this)
		if (this.options.menuItems) {
			for (const item of this.options.menuItems) {
				this._navigationMenu.appendMenuItem(
					new LabelComponent(
						null,
						{
							text: item.name,
							activationAnchor: item.anchor
						},
						this.inheritedOptions
					)
				)
			}
		}
		this._navigationMenu.addListener((eventName, anchor) => {}, MenuComponent.NAVIGATED_EVENT)
	}

	/** @type {NavigationMenu} */
	get navigationMenu() {
		return this._navigationMenu
	}
}

MastheadComponent.MODE_REQUEST_EVENT = 'mode-request'

export default MastheadComponent
