import el from 'potassium-es/src/El'
import graph from 'potassium-es/src/Graph'

import Component from 'potassium-es/src/Component'

/**
MenuComponent holds a set of menu item Components.
Users are given the opportunity to choose items from the menu.
*/
const MenuComponent = class extends Component {
	constructor(dataObject=null, options={}){
		super(dataObject, options)
		this.addClass('menu-component')

		this._menuItems = []
	}

	get menuItems(){ return this._menuItems }

	setSelected(index){
		if(!this._menuItems[index]) {
			console.error('no such menu index', index)
			return
		}
		for(let i=0; i < this._menuItems.length; i++){
			if(i === index){
				this._menuItems[i].addClass('selected')
			} else {
				this._menuItems[i].removeClass('selected')
			}
		}
	}

	appendMenuItem(component){
		this._menuItems.push(component)
		this.appendComponent(component)
	}
}

export default MenuComponent
