import { Button, ButtonGroup, Card, Icon } from 'eri'
import * as React from 'react'
import { Link } from 'react-router-dom'
import { deleteService } from '../../../api'
import { IRONING } from '../../../shared/services'
import { IServiceIroningDocument } from '../../../shared/types'
import capitalizeFirst from '../../../utils/capitalizeFirst'
import DeleteDialog from './DeleteDialog'

interface IProps {
  children: IServiceIroningDocument
  onDelete(): void
}

const renderTrueFalse = (a: boolean) => <Icon name={a ? 'check' : 'cross'} />

class IroningCard extends React.PureComponent<IProps> {
  public state = {
    isDeleteDialogOpen: false,
    isDeleting: false,
  }

  public deleteService = async () => {
    this.setState({ isDeleting: true })

    try {
      await deleteService(this.props.children._id)
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
        bedLinen,
        collectAndReturn,
        hasOwnEquipment,
        hourlyRate,
        other,
        shirts,
        specialist,
        trousers,
      },
    } = this.props

    const editTo = `services/${IRONING}`

    return (
      <Card>
        <h3>{capitalizeFirst(IRONING)}</h3>
        <ul>
          <li>Hourly rate: £{String(hourlyRate)}</li>
          <li>Bed linen: {renderTrueFalse(bedLinen)}</li>
          <li>Shirts: {renderTrueFalse(shirts)}</li>
          <li>Trousers: {renderTrueFalse(trousers)}</li>
          <li>Other standard garments: {renderTrueFalse(other)}</li>
          <li>Specialist ironing - MOA: {renderTrueFalse(specialist)}</li>
          <li>
            I have my own ironing equipment: {renderTrueFalse(hasOwnEquipment)}
          </li>
          <li>
            Will collect, iron &amp; return: {renderTrueFalse(collectAndReturn)}
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
          serviceName={IRONING}
        />
      </Card>
    )
  }
}

export default IroningCard
