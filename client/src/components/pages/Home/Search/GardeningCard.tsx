import { Card, Icon } from 'eri'
import * as React from 'react'
import { IServiceGardeningResponseObject } from '../../../../shared/types'
import { capitalizeFirst, renderCurrency } from '../../../../utils'

interface IProps {
  children: IServiceGardeningResponseObject
}

const renderTrueFalse = (a: boolean) => <Icon name={a ? 'check' : 'cross'} />

export default class GardeningCard extends React.PureComponent<IProps> {
  public render() {
    const {
      children: {
        general,
        hasOwnEquipment,
        hasOwnProducts,
        hourlyRate,
        providerName,
        specialist,
      },
    } = this.props

    return (
      <Card>
        <h3>{capitalizeFirst(providerName)}</h3>
        <ul>
          <li>Hourly rate: {renderCurrency(hourlyRate)}</li>
          <li>General gardening: {renderTrueFalse(general)}</li>
          <li>Specialist gardening: {renderTrueFalse(specialist)}</li>
          <li>Has own products: {renderTrueFalse(hasOwnProducts)}</li>
          <li>Has own equipment: {renderTrueFalse(hasOwnEquipment)}</li>
        </ul>
      </Card>
    )
  }
}
