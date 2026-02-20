import React from 'react'
import { render } from '@testing-library/react-native'
import Skelton from '../../../src/Component/Skelton/Skelton'

jest.mock('react-native-skeleton-placeholder', () => {
  const React = require('react')
  const { View } = require('react-native')

  const MockSkeleton = ({ children }: any) => (
    <View testID="skeleton-placeholder">{children}</View>
  )

  MockSkeleton.Item = ({ children }: any) => (
    <View>{children}</View>
  )

  return MockSkeleton
})

describe('Skelton Component', () => {
  it('renders skeleton container', () => {
    const { getByTestId } = render(<Skelton />)

    expect(getByTestId('skeleton-container')).toBeTruthy()
  })

  it('renders 6 skeleton placeholders', () => {
    const { getAllByTestId } = render(<Skelton />)

    const skeletons = getAllByTestId('skeleton-placeholder')
    expect(skeletons.length).toBe(6)
  })
})
