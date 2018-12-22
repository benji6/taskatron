import { Card, Icon } from 'eri'
import * as React from 'react'
import { renderCurrency, serviceImageUrl } from '../../../../utils'

interface IProps {
  children: any
}

const renderTrueFalse = (a: boolean) => <Icon name={a ? 'check' : 'cross'} />

export default function Result({
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
}: IProps) {
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
