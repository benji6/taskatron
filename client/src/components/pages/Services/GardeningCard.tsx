import { Button, ButtonGroup, Card, Icon } from 'eri'
import * as React from 'react'
import { Link } from 'react-router-dom'
import { deleteService } from '../../../api'
import { GARDENING } from '../../../shared/services'
import { IServiceGardeningDocument } from '../../../shared/types'
import capitalizeFirst from '../../../utils/capitalizeFirst'

interface IProps {
  children: IServiceGardeningDocument
  onDelete(): void
}

const renderTrueFalse = (a: boolean) => <Icon name={a ? 'check' : 'cross'} />

class GardeningCard extends React.PureComponent<IProps> {
  public handleDelete = async () => {
    try {
      await deleteService(this.props.children._id)
      this.props.onDelete()
    } catch {
      // TODO
    }
  }

  public render() {
    const {
      children: {
        general,
        hasOwnEquipment,
        hasOwnProducts,
        hourlyRate,
        specialist,
      },
    } = this.props

    const editTo = `services/${GARDENING}`

    return (
      <Card>
        <h3>{capitalizeFirst(GARDENING)}</h3>
        <ul>
          <li>Hourly rate: £{String(hourlyRate)}</li>
          <li>General gardening services: {renderTrueFalse(general)}</li>
          <li>
            Specialist gardening services - MOA (what actually is MOA?):{' '}
            {renderTrueFalse(specialist)}
          </li>
          <li>
            I have my own gardening products: {renderTrueFalse(hasOwnProducts)}
          </li>
          <li>
            I have my own gardening equipment:{' '}
            {renderTrueFalse(hasOwnEquipment)}
          </li>
        </ul>
        <ButtonGroup>
          <Link className="e-button e-button--primary" to={editTo}>
            Edit
          </Link>
          <Button
            onClick={this.handleDelete}
            sentiment="negative"
            variant="secondary"
          >
            Delete
          </Button>
        </ButtonGroup>
      </Card>
    )
  }
}

export default GardeningCard
