import { Button, ButtonGroup, Card } from 'eri'
import * as React from 'react'
import { Link } from 'react-router-dom'
import { deleteService } from '../../../api'
import { IRONING } from '../../../shared/services'
import { IServiceIroningDocument } from '../../../shared/types'
import capitalizeFirst from '../../../utils/capitalizeFirst'

interface IProps {
  children: IServiceIroningDocument
  onDelete(): void
}

const renderTrueFalse = (a: boolean) => (a ? '✓' : '×')

class IroningCard extends React.PureComponent<IProps> {
  public handleDelete = async () => {
    try {
      await deleteService(this.props.children._id)
      this.props.onDelete()
    } catch {
      // TODO
    }
  }

  public render() {
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
          <Button onClick={this.handleDelete} variant="secondary">
            Delete
          </Button>
        </ButtonGroup>
      </Card>
    )
  }
}

export default IroningCard
