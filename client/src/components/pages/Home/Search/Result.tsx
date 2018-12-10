import { Card, Icon } from 'eri'
import * as React from 'react'
import { IServiceResponseObject } from 'shared/types'
import { renderCurrency, serviceImageUrl } from '../../../../utils'

interface IProps {
  children: IServiceResponseObject
}

interface IState {
  showImage: boolean
}

const renderTrueFalse = (a: boolean) => <Icon name={a ? 'check' : 'cross'} />

export default class Result extends React.PureComponent<IProps> {
  public state: IState = {
    showImage: true,
  }

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
        id,
        name,
        ovenClean,
      },
    } = this.props
    const { showImage } = this.state

    return (
      <Card>
        <h3>{name}</h3>
        <p>{description}</p>
        {showImage && (
          <img
            alt={`profile image for ${name}`}
            onError={this.handleImageLoadError}
            src={serviceImageUrl(id)}
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

  private handleImageLoadError = () => this.setState({ showImage: false })
}
