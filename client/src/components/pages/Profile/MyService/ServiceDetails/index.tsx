import { Button, ButtonGroup, Icon } from 'eri'
import * as React from 'react'
import { Mutation } from 'react-apollo'
import { getUserId } from '../../../../../localStorage'
import { renderCurrency } from '../../../../../utils'
import query from '../query'
import DeleteDialog from './DeleteDialog'
import mutation from './mutation'

interface IProps {
  children: any
}

interface IState {
  isDeleteDialogOpen: boolean
}

const renderTrueFalse = (a: boolean) => <Icon name={a ? 'check' : 'cross'} />

class ServiceDetails extends React.PureComponent<IProps> {
  public state: IState = {
    isDeleteDialogOpen: false,
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
        radius,
      },
    } = this.props
    const { isDeleteDialogOpen } = this.state

    return (
      <>
        <h4>Details</h4>
        <ul>
          <li>
            <b>Name:</b> {name}
          </li>
          <li>
            <b>Description</b>:{' '}
            {description.includes('\n') ? (
              <p e-util="pre-line">{description}</p>
            ) : (
              description
            )}
          </li>
          <li>
            <b>Hourly rate</b>: {renderCurrency(hourlyRate)}
          </li>
          <li>
            <b>Radius</b>: {radius} miles
          </li>
          <li>
            <b>General clean</b>: {renderTrueFalse(general)}
          </li>
          <li>
            <b>One-off deep clean</b>: {renderTrueFalse(deepClean)}
          </li>
          <li>
            <b>Specialist clean - carpets</b>: {renderTrueFalse(carpetClean)}
          </li>
          <li>
            <b>Specialist clean - oven</b>: {renderTrueFalse(ovenClean)}
          </li>
          <li>
            <b>I have my own products</b>: {renderTrueFalse(hasOwnProducts)}
          </li>
          <li>
            <b>I have my own equipment</b>: {renderTrueFalse(hasOwnEquipment)}
          </li>
        </ul>
        <ButtonGroup>
          <Button to="profile/service/edit">Edit details</Button>
          <Button
            onClick={this.openDeleteDialog}
            sentiment="negative"
            variant="secondary"
          >
            Delete service
          </Button>
        </ButtonGroup>
        <Mutation
          mutation={mutation}
          refetchQueries={[{ query, variables: { userId: getUserId() } }]}
          variables={{ id }}
        >
          {(deleteService, { loading }) => (
            // TODO - handle errors
            <DeleteDialog
              disabled={loading}
              onClose={this.closeDeleteDialog}
              onDelete={async () => {
                await deleteService()
                this.closeDeleteDialog()
              }}
              open={isDeleteDialogOpen}
            />
          )}
        </Mutation>
      </>
    )
  }

  private closeDeleteDialog = () => this.setState({ isDeleteDialogOpen: false })

  private openDeleteDialog = () => {
    this.setState({ isDeleteDialogOpen: true })
  }
}

export default ServiceDetails
