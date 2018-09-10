import { Button, ButtonGroup, Card, Icon } from 'eri'
import * as React from 'react'
import { Link } from 'react-router-dom'
import { deleteCleaningService } from '../../../api'
import { CLEANING } from '../../../shared/services'
import { IServiceCleaningDocument } from '../../../shared/types'
import capitalizeFirst from '../../../utils/capitalizeFirst'
import DeleteDialog from './DeleteDialog'

interface IProps {
  children: IServiceCleaningDocument
  onDelete(): void
}

const renderTrueFalse = (a: boolean) => <Icon name={a ? 'check' : 'cross'} />

class CleaningCard extends React.PureComponent<IProps> {
  public state = {
    isDeleteDialogOpen: false,
    isDeleting: false,
  }

  public deleteService = async () => {
    this.setState({ isDeleting: true })

    try {
      await deleteCleaningService(this.props.children._id)
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
          serviceName={CLEANING}
        />
      </Card>
    )
  }
}

export default CleaningCard
