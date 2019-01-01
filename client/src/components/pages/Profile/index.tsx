import { CardGroup } from 'eri'
import * as React from 'react'
import MyDetails from './MyDetails'
import MyService from './MyService'

export default function Profile() {
  return (
    <CardGroup>
      <MyDetails />
      <MyService />
    </CardGroup>
  )
}
