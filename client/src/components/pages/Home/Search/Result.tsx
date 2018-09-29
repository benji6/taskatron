import { Card, Icon } from 'eri'
import * as React from 'react'
import { IServiceResponseObject } from '../../../../shared/types'
import { capitalizeFirst, renderCurrency } from '../../../../utils'

interface IProps {
  children: IServiceResponseObject
}

const renderTrueFalse = (a: boolean) => <Icon name={a ? 'check' : 'cross'} />

export default class Result extends React.PureComponent<IProps> {
  public render() {
    const {
      children: {
        carpetClean,
        deepClean,
        general,
        hasOwnEquipment,
        hasOwnProducts,
        hourlyRate,
        ovenClean,
        providerName,
      },
    } = this.props

    return (
      <Card>
        <h3>{capitalizeFirst(providerName)}</h3>
        <ul>
          <li>Hourly rate: {renderCurrency(hourlyRate)}</li>
          <li>General clean: {renderTrueFalse(general)}</li>
          <li>One-off deep clean: {renderTrueFalse(deepClean)}</li>
          <li>Specialist clean - carpets: {renderTrueFalse(carpetClean)}</li>
          <li>Specialist clean - oven: {renderTrueFalse(ovenClean)}</li>
          <li>Has own products: {renderTrueFalse(hasOwnProducts)}</li>
          <li>Has own equipment: {renderTrueFalse(hasOwnEquipment)}</li>
        </ul>
      </Card>
    )
  }
}
