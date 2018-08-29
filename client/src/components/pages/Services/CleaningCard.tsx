import { Button, ButtonGroup, Card, Icon } from 'eri'
import * as React from 'react'
import { Link } from 'react-router-dom'
import { deleteService } from '../../../api'
import { CLEANING } from '../../../shared/services'
import { IServiceCleaningDocument } from '../../../shared/types'
import capitalizeFirst from '../../../utils/capitalizeFirst'

interface IProps {
  children: IServiceCleaningDocument
  onDelete(): void
}

const renderTrueFalse = (a: boolean) => <Icon name={a ? 'check' : 'cross'} />

class CleaningCard extends React.PureComponent<IProps> {
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
        carpetClean,
        deepClean,
        general,
        hasOwnEquipment,
        hasOwnProducts,
        hourlyRate,
        ovenClean,
      },
    } = this.props

    const editTo = `services/${CLEANING}`

    return (
      <Card>
        <h3>{capitalizeFirst(CLEANING)}</h3>
        <ul>
          <li>Hourly rate: £{String(hourlyRate)}</li>
          <li>General clean: {renderTrueFalse(general)}</li>
          <li>One-off deep clean: {renderTrueFalse(deepClean)}</li>
          <li>Specialist clean - carpets: {renderTrueFalse(carpetClean)}</li>
          <li>Specialist clean - oven: {renderTrueFalse(ovenClean)}</li>
          <li>I have my own products: {renderTrueFalse(hasOwnProducts)}</li>
          <li>I have my own equipment: {renderTrueFalse(hasOwnEquipment)}</li>
        </ul>
        <ButtonGroup>
          <Link className="e-button e-button--primary" to={editTo}>
            Edit
          </Link>
          <Button onClick={this.handleDelete} variant="secondary">
            Delete
          </Button>
        </ButtonGroup>
      </Card>
    )
  }
}

export default CleaningCard
