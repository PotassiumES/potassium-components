import dom from 'potassium-es/src/DOM'
import som from 'potassium-es/src/SOM'

import Component from 'potassium-es/src/Component'

/**
MenuComponent holds a set of menu item Components.
Users are given the opportunity to choose items from the menu.
*/
const MenuComponent = class extends Component {
	/**
	@param {DataObject} [dataObject=null]
	@param {Object} [options=null]
	*/
	constructor(dataObject = null, options = {}, inheritedOptions = {}) {
		super(dataObject, options, inheritedOptions)
		this.addClass('menu-component')
		this.setName('MenuComponent')

		this._selectedIndex = -1
		this._menuItems = []
	}

	get menuItems() {
		return this._menuItems
	}
	get selectedIndex() {
		return this._selectedIndex
	}
	set selectedIndex(index) {
		if (!this._menuItems[index]) {
			console.error('no such menu index', index)
			return
		}
		if (this._selectedIndex === index) return
		this._selectedIndex = index
		this._updateSelectionDisplay()
	}

	_updateSelectionDisplay() {
		for (let i = 0; i < this._menuItems.length; i++) {
			if (i === this._selectedIndex) {
				this._menuItems[i].addClass('selected')
			} else {
				this._menuItems[i].removeClass('selected')
			}
		}
	}

	layout() {
		/** @todo convert to grid */
		const itemHeight = 0.12
		for (let i = 0; i < this._menuItems.length; i++) {
			this._menuItems[i].portalSOM.position.set(0, i * itemHeight * -1, 0)
			this._menuItems[i].immersiveSOM.position.set(0, i * itemHeight * -1, 0)
		}
	}

	appendMenuItem(component) {
		this._menuItems.push(component)
		this.appendComponent(component)
		if (this._menuItems.length === 1) {
			this.selectedIndex = 0
		}
	}
}

MenuComponent.NAVIGATED_EVENT = 'meun-navigated'

export default MenuComponent
