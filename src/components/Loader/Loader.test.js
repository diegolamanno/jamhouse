import React from 'react'
import { shallow } from 'enzyme'
import Loader from './Loader'

describe('Loader', () => {
	it('renders the Loader', () => {
		const component = shallow(<Loader />)
		expect(component).toMatchSnapshot()
	})
})
