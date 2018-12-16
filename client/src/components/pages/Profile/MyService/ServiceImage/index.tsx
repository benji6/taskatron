import { Button, ButtonGroup } from 'eri'
import * as React from 'react'
import { Mutation } from 'react-apollo'
import { Link } from 'react-router-dom'
import { deleteServiceImage } from '../../../../../api'
import { serviceImageUrl } from '../../../../../utils'
import query from '../query'
import DeleteDialog from './DeleteDialog'
import mutation from './mutation'

interface IProps {
  id: string
  imagePath: string
  userId: string
}

interface IState {
  isSubmitting: boolean
  showDeleteDialog: boolean
}

export default class ServiceImage extends React.PureComponent<IProps> {
  public state: IState = {
    isSubmitting: false,
    showDeleteDialog: false,
  }

  public render() {
    const { id, imagePath, userId } = this.props
    const { isSubmitting, showDeleteDialog } = this.state

    return (
      <>
        <h4>Image</h4>
        {imagePath ? (
          <>
            <img alt="your service image" src={serviceImageUrl(imagePath)} />
            <ButtonGroup>
              <Button to={`/service/${id}/image/edit`}>Edit image</Button>
              <Button
                onClick={this.openDeleteDialog}
                sentiment="negative"
                variant="secondary"
              >
                Delete image
              </Button>
            </ButtonGroup>
          </>
        ) : (
          <p e-util="center">
            <strong>
              <Link to={`/service/${id}/image/add`}>
                Click here to add an image to your service
              </Link>
            </strong>
          </p>
        )}
        <Mutation
          mutation={mutation}
          refetchQueries={[{ query, variables: { userId } }]}
          variables={{ id }}
        >
          {updateService => (
            <DeleteDialog
              disabled={isSubmitting}
              onClose={this.closeDeleteDialog}
              onDelete={async () => {
                this.setState({ isSubmitting: true })
                try {
                  await deleteServiceImage(id)
                  await updateService()
                } catch {
                  // TODO
                }
                this.setState({ isSubmitting: false })
                this.closeDeleteDialog()
              }}
              open={showDeleteDialog}
            />
          )}
        </Mutation>
      </>
    )
  }

  private closeDeleteDialog = () => this.setState({ showDeleteDialog: false })

  private openDeleteDialog = () => {
    this.setState({ showDeleteDialog: true })
  }
}
