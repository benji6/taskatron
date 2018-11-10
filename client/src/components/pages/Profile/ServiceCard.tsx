import { Button, ButtonGroup, Card, Icon } from 'eri'
import * as React from 'react'
import { Link } from 'react-router-dom'
import { deleteCleaningService } from '../../../api'
import { renderCurrency } from '../../../utils'
import DeleteDialog from './DeleteDialog'

interface IProps {
  children: any
}

const renderTrueFalse = (a: boolean) => <Icon name={a ? 'check' : 'cross'} />

class ServiceForm extends React.PureComponent<IProps> {
  public state = {
    isDeleteDialogOpen: false,
    isDeleting: false,
  }

  public deleteService = async () => {
    this.setState({ isDeleting: true })

    try {
      await deleteCleaningService(this.props.children.id)
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
        name,
        ovenClean,
        radius,
      },
    } = this.props

    const editTo = 'profile/service'

    return (
      <Card>
        <h3>{name}</h3>
        <p>These are the details of the service you are offering:</p>
        <ul>
          <li>Hourly rate: {renderCurrency(hourlyRate)}</li>
          <li>Radius: {radius} miles</li>
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
        />
      </Card>
    )
  }
}

export default ServiceForm
