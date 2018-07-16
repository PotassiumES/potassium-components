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
- a ModeSwitcherComponent
- a navigation MenuComponent

In flat mode, this will be a bar at the top of the page.
In portal mode, it will be a UI element in the top left of the window.
In immersive mode, it will be a nifty utility object that floats near the user.
*/
const MastheadComponent = class extends Component {
	/**
	@param {DataObject} dataObject
	@param {Object} like { brand{string|Component}, menuItems{Array[{ name, anchor }]} }
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
		this._modeSwitcherComponent.immersiveGraph.position.set(-1, 0, -2)
		this._modeSwitcherComponent.immersiveGraph.scale.set(0.5, 0.5, 0.5)
		this.appendComponent(this._modeSwitcherComponent)
		this._modeSwitcherComponent.addListener((eventName, mode) => {
			console.error("NEED TO SEND AN EVENT TO THE APP")
			//this.setDisplayMode(mode)
		}, ModeSwitcherComponent.ModeChangedEvent)


		this._navigationMenu = new MenuComponent()
		this.appendComponent(this._navigationMenu)

		if(this.options.menuItems){
			for(let item of this.options.menuItems){
				this._navigationMenu.appendMenuItem(new LabelComponent(null, {
					text: item.name,
					activationAnchor: item.anchor
				}))
			}
		}
	}

	get navigationMenu(){ return this._navigationMenu }
}

export default MastheadComponent
