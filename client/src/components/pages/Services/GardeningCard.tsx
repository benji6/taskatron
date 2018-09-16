import { Button, ButtonGroup, Card, Icon } from 'eri'
import * as React from 'react'
import { Link } from 'react-router-dom'
import { deleteGardeningService } from '../../../api'
import { GARDENING } from '../../../shared/services'
import { IServiceGardeningDocument } from '../../../shared/types'
import { capitalizeFirst, renderCurrency } from '../../../utils'
import DeleteDialog from './DeleteDialog'

interface IProps {
  children: IServiceGardeningDocument
  onDelete(): void
}

const renderTrueFalse = (a: boolean) => <Icon name={a ? 'check' : 'cross'} />

class GardeningCard extends React.PureComponent<IProps> {
  public state = {
    isDeleteDialogOpen: false,
    isDeleting: false,
  }

  public deleteService = async () => {
    this.setState({ isDeleting: true })

    try {
      await deleteGardeningService(this.props.children._id)
      this.props.onDelete()
    } catch {
      // TODO
    } finally {
      this.setState({ isDeleteDialogOpen: false, isDeleting: false })
    }
  }

  public openDeleteDialog = () => {
    this.setState({ isDeleteDialogOpen: true })
  }

  public closeDeleteDialog = () => this.setState({ isDeleteDialogOpen: false })

  public render() {
    const { isDeleteDialogOpen, isDeleting } = this.state
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
          <li>Hourly rate: {renderCurrency(hourlyRate)}</li>
          <li>General gardening services: {renderTrueFalse(general)}</li>
          <li>Specialist gardening services: {renderTrueFalse(specialist)}</li>
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
            onClick={this.openDeleteDialog}
            sentiment="negative"
            variant="secondary"
          >
            Delete
          </Button>
        </ButtonGroup>
        <DeleteDialog
          disabled={isDeleting}
          onClose={this.closeDeleteDialog}
          onDelete={this.deleteService}
          open={isDeleteDialogOpen}
          serviceName={GARDENING}
        />
      </Card>
    )
  }
}

export default GardeningCard
