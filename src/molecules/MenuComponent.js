import dom from 'potassium-es/src/DOM'
import som from 'potassium-es/src/SOM'
import Component from 'potassium-es/src/Component'

import ToggleComponent from 'potassium-components/src/atoms/ToggleComponent'

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

		this._toggleComponent = new ToggleComponent(undefined, {}, this.inheritedOptions).appendTo(this)
		this.listenTo(ToggleComponent.ToggleEvent, this._toggleComponent, (eventName, opened) => {
			if (opened) {
				this.addClass('open')
			} else {
				this.removeClass('open')
			}
			this.trigger(MenuComponent.ToggleEvent, this._toggleComponent._opened, this)
		})

		/* terrible hack to prevent selection of the toggle, but the user-select CSS is non-standard and needs browser prefixes 😢 */
		this.flatDOM.setAttribute('onselectstart', 'return false;')
		this.portalDOM.setAttribute('onselectstart', 'return false;')

		this._menuItemsComponent = new Component(undefined, {}, this.inheritedOptions)
			.appendTo(this)
			.addClass('menu-items-component')
			.setName('MenuItemsComponent')
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

	get opened() {
		return this._toggleComponent.opened
	}

	open() {
		this._toggleComponent.open()
	}

	close() {
		this._toggleComponent.close()
	}

	toggle(open) {
		this._toggleComponent.toggle(open)
	}

	appendMenuItem(component) {
		this._menuItems.push(component)
		this._menuItemsComponent.appendComponent(component)
		component.addClass('menu-item')
		if (this._menuItems.length === 1) {
			this.selectedIndex = 0
		}
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
}

MenuComponent.NAVIGATED_EVENT = 'meun-navigated'

export default MenuComponent
