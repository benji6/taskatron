import { gql } from 'apollo-boost'
import { Button, ButtonGroup, Card, Icon } from 'eri'
import * as React from 'react'
import { Mutation } from 'react-apollo'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { query } from '.'
import { userIdSelector } from '../../../selectors'
import IStore from '../../../types/IStore'
import { renderCurrency } from '../../../utils'
import DeleteDialog from './DeleteDialog'

interface IProps {
  children: any
  userId: string
}

interface IState {
  isDeleteDialogOpen: boolean
}

const mutation = gql`
  mutation DeleteService($id: ID!) {
    deleteService(id: $id) {
      id
    }
  }
`

const renderTrueFalse = (a: boolean) => <Icon name={a ? 'check' : 'cross'} />

class ServiceForm extends React.PureComponent<IProps> {
  public state: IState = {
    isDeleteDialogOpen: false,
  }

  public openDeleteDialog = () => {
    this.setState({ isDeleteDialogOpen: true })
  }

  public closeDeleteDialog = () => this.setState({ isDeleteDialogOpen: false })

  public render() {
    const { isDeleteDialogOpen } = this.state
    const {
      children: {
        carpetClean,
        deepClean,
        general,
        hasOwnEquipment,
        hasOwnProducts,
        hourlyRate,
        id,
        name,
        ovenClean,
        radius,
      },
      userId,
    } = this.props

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
          <Link
            className="e-button e-button--primary"
            to="profile/service/edit"
          >
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
        <Mutation
          mutation={mutation}
          refetchQueries={[{ query, variables: { userId } }]}
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
      </Card>
    )
  }
}

const mapStateToProps = (state: IStore) => ({
  userId: userIdSelector(state) as string,
})

export default connect(mapStateToProps)(ServiceForm)
