import el from 'potassium-es/src/El'
import graph from 'potassium-es/src/Graph'

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
	@param {DataObject} dataObject
	@param {Object} options
	@param {string or Component} options.brand
	@param {Object[]} options.menuItems
	@param {string} options.menuItems.name
	@param {string} options.menuItems.anchor
	*/
	constructor(dataObject=null, options={}){
		super(dataObject, Object.assign({
			brand: null,
			menuItems: []
		}, options))
		this.addClass('masthead-component')

		if(this.options.brand instanceof Component){
			this._brand = this.options.brand
		} else {
			const brandOptions = {}
			if(typeof this.options.brand === 'string'){
				brandOptions.text = this.options.brand
			}
			this._brand = new HeadingComponent(null, brandOptions)
		}
		this.appendComponent(this._brand)


		this._modeSwitcherComponent = new ModeSwitcherComponent()
		this.appendComponent(this._modeSwitcherComponent)
		this._modeSwitcherComponent.immersiveGraph.position.set(-1, 0, 0)
		this.appendComponent(this._modeSwitcherComponent)
		this._modeSwitcherComponent.addListener((eventName, mode) => {
			this.trigger(MastheadComponent.MODE_REQUEST_EVENT, mode)
		}, ModeSwitcherComponent.ModeChangedEvent)


		this._navigationMenu = new MenuComponent()
		this._navigationMenu.portalGraph.position.set(2, 0, 0)
		this._navigationMenu.immersiveGraph.position.set(2, 0, 0)
		this.appendComponent(this._navigationMenu)
		if(this.options.menuItems){
			for(let item of this.options.menuItems){
				this._navigationMenu.appendMenuItem(new LabelComponent(null, {
					text: item.name,
					activationAnchor: item.anchor
				}))
			}
		}
		this._navigationMenu.layout()
		this._navigationMenu.addListener((eventName, anchor) => {
		}, MenuComponent.NAVIGATED_EVENT)
	}

	/** @type {NavigationMenu} */
	get navigationMenu(){ return this._navigationMenu }
}

MastheadComponent.MODE_REQUEST_EVENT = 'mode-request'

export default MastheadComponent
