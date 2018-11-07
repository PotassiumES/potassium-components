import dom from 'potassium-es/src/DOM'
import som from 'potassium-es/src/SOM'
import Component from 'potassium-es/src/Component'

import ImageComponent from 'potassium-components/src/atoms/ImageComponent'


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

		this._opened = false // True when the toggle is open and the menu is showing

		this._selectedIndex = -1
		this._menuItems = []

		this._toggleComponent = new ImageComponent(undefined, {
			image: '/static/potassium-components/images/left-arrow.png'
		}, this.inheritedOptions).appendTo(this)
			.addClass('toggle-component')
			.setName('ToggleComponent')
		this.listenTo(Component.ActionEvent, this._toggleComponent, (eventName, actionName, value, actionParameters) => {
			switch (actionName) {
				case '/action/activate':
					this.toggle()
					break
			}
		})
		/* terrible hack to prevent selection of the toggle, but the user-select CSS is non-standard and needs browser prefixes 😢 */
		this.flatDOM.setAttribute('onselectstart', 'return false;')
		this.portalDOM.setAttribute('onselectstart', 'return false;')

		this._menuItemsComponent = new Component(undefined, {
		}, this.inheritedOptions)
			.appendTo(this)
			.addClass('menu-items-component')
			.setName('MenuItemsComponent')
			.hide()
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

	get opened(){ return this._opened }

	open(){
		if(this._opened) return
		this._opened = true
		this._toggleComponent.addClass('open')
		this._menuItemsComponent.show()
	}

	close(){
		if(this._opened === false) return
		this._opened = false
		this._toggleComponent.removeClass('open')
		this._menuItemsComponent.hide()
	}

	toggle(open=null){
		if(typeof open === 'boolean'){
			if(open){
				this.close()
			} else {
				this.open()
			}
			return
		}
		if(this._opened) {
			this.close()
		} else {
			this.open()
		}
		this.trigger(MenuComponent.ToggleEvent, this._opened, this)
	}

	appendMenuItem(component) {
		this._menuItems.push(component)
		this._menuItemsComponent.appendComponent(component)
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
