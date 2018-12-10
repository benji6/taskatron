import { Button, ButtonGroup } from 'eri'
import * as React from 'react'
import { Link } from 'react-router-dom'
import { deleteServiceImage } from '../../../../../api'
import { serviceImageUrl } from '../../../../../utils'
import DeleteDialog from './DeleteDialog'

interface IProps {
  id: string
}

interface IState {
  isSubmitting: boolean
  showDeleteDialog: boolean
  showImage: boolean
}

export default class ServiceImage extends React.PureComponent<IProps> {
  public state: IState = {
    isSubmitting: false,
    showDeleteDialog: false,
    showImage: true,
  }

  public render() {
    const { id } = this.props
    const { isSubmitting, showDeleteDialog, showImage } = this.state

    return (
      <>
        <h4>Image</h4>
        {showImage ? (
          <>
            <img
              alt="your service image"
              onError={this.handleImageLoadError}
              src={serviceImageUrl(id)}
            />
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
            <Link to={`/service/${id}/image/add`}>
              Click here to add an image to your service
            </Link>
          </p>
        )}
        <DeleteDialog
          disabled={isSubmitting}
          onClose={this.closeDeleteDialog}
          onDelete={async () => {
            this.setState({ isSubmitting: true })
            try {
              await deleteServiceImage(id)
            } catch {
              // TODO
            }
            this.setState({ isSubmitting: false })
            this.closeDeleteDialog()
          }}
          open={showDeleteDialog}
        />
      </>
    )
  }

  private closeDeleteDialog = () => this.setState({ showDeleteDialog: false })

  private handleImageLoadError = () => this.setState({ showImage: false })

  private openDeleteDialog = () => {
    this.setState({ showDeleteDialog: true })
  }
}
