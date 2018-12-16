import { Card, Icon } from 'eri'
import * as React from 'react'
import { IServiceDocument } from 'shared/types'
import { renderCurrency, serviceImageUrl } from '../../../../utils'

interface IChildren extends IServiceDocument {
  description: string
  id: string
  imagePath: string
  providerName: string
}

interface IProps {
  children: IChildren
}

const renderTrueFalse = (a: boolean) => <Icon name={a ? 'check' : 'cross'} />

export default class Result extends React.PureComponent<IProps> {
  public render() {
    const {
      children: {
        carpetClean,
        deepClean,
        description,
        general,
        hasOwnEquipment,
        hasOwnProducts,
        hourlyRate,
        imagePath,
        name,
        ovenClean,
      },
    } = this.props

    return (
      <Card>
        <h3>{name}</h3>
        <p>{description}</p>
        {imagePath && (
          <img
            alt={`profile image for ${name}`}
            src={serviceImageUrl(imagePath)}
          />
        )}
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
