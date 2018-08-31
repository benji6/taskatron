import { Button, ButtonGroup, Dialog } from 'eri'
import * as React from 'react'
import { TService } from '../../../shared/types'

interface IProps {
  disabled: boolean
  open: boolean
  serviceName: TService
  onClose(): void
  onDelete(): void
}

export default class DeleteDialog extends React.PureComponent<IProps> {
  public render() {
    const { disabled, onClose, onDelete, open, serviceName } = this.props

    return (
      <Dialog
        onClose={onClose}
        open={open}
        title={`Delete your ${serviceName} service?`}
      >
        <ButtonGroup>
          <Button disabled={disabled} onClick={onDelete} sentiment="negative">
            Delete
          </Button>
          <Button disabled={disabled} onClick={onClose} variant="secondary">
            Cancel
          </Button>
        </ButtonGroup>
      </Dialog>
    )
  }
}
