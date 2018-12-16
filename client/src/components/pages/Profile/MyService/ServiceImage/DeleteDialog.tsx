import { Button, ButtonGroup, Dialog } from 'eri'
import * as React from 'react'

interface IProps {
  disabled: boolean
  open: boolean
  onClose(): void
  onDelete(): void
}

export default function DeleteDialog({
  disabled,
  onClose,
  onDelete,
  open,
}: IProps) {
  return (
    <Dialog
      onClose={onClose}
      open={open}
      title="Delete your Cleaning service image?"
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
