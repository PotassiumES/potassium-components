import dom from 'potassium-es/src/DOM'
import som from 'potassium-es/src/SOM'

import Component from 'potassium-es/src/Component'

/**
TableComponent shows tabular data.
*/
const TableComponent = class extends Component {
	/**
	@param {DataObject} [dataObject=null]
	@param {Object} [options=null]
	@param {string[]} [options.columns=['key', 'value']]
	*/
	constructor(dataObject = null, options = {}, inheritedOptions = {}) {
		super(
			dataObject,
			Object.assign(
				{
					flatDOM: dom.table(),
					portalDOM: dom.table(),
					columns: ['key', 'value']
				},
				options
			),
			inheritedOptions
		)
		this.addClass('table-component')
		this.setName('TableComponent')
		if (this.dataObject) this._updateFromData()
	}

	_updateFromData() {
		this._clear()
		for (const datum of this.dataObject) {
			const tr = dom.tr().appendTo(this.flatDOM)
			for (const dataField of this.options.columns) {
				tr.appendChild(dom.td(datum.get(dataField, '')))
			}
		}
	}

	_clear() {
		this.flatDOM.innerHTML = ''
		this.portalDOM.innerHTML = ''
	}
}

export default TableComponent
