import { Card, Icon } from 'eri'
import * as React from 'react'
import { IServiceIroningResponseObject } from '../../../../shared/types'
import capitalizeFirst from '../../../../utils/capitalizeFirst'
import renderCurrency from '../../../../utils/renderCurrency'

interface IProps {
  children: IServiceIroningResponseObject
}

const renderTrueFalse = (a: boolean) => <Icon name={a ? 'check' : 'cross'} />

export default class IroningCard extends React.PureComponent<IProps> {
  public render() {
    const {
      children: {
        bedLinen,
        collectAndReturn,
        hasOwnEquipment,
        hourlyRate,
        other,
        providerName,
        shirts,
        specialist,
        trousers,
      },
    } = this.props

    return (
      <Card>
        <h3>{capitalizeFirst(providerName)}</h3>
        <ul>
          <li>Hourly rate: {renderCurrency(hourlyRate)}</li>
          <li>Bed linen: {renderTrueFalse(bedLinen)}</li>
          <li>Shirts: {renderTrueFalse(shirts)}</li>
          <li>Trousers: {renderTrueFalse(trousers)}</li>
          <li>Other standard garments: {renderTrueFalse(other)}</li>
          <li>Specialist ironing: {renderTrueFalse(specialist)}</li>
          <li>Has own ironing equipment: {renderTrueFalse(hasOwnEquipment)}</li>
          <li>
            Will collect, iron &amp; return: {renderTrueFalse(collectAndReturn)}
          </li>
        </ul>
      </Card>
    )
  }
}
