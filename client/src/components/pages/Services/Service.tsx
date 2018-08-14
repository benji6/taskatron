import { Button, ButtonGroup, Card } from 'eri'
import * as React from 'react'
import { Link } from 'react-router-dom'
import { deleteService } from '../../../api'
import { CLEANING, GARDENING, IRONING } from '../../../shared/services'
import {
  IServiceCleaningDocument,
  IServiceDocument,
  IServiceIroningDocument,
  TService,
} from '../../../shared/types'
import capitalizeFirst from '../../../utils/capitalizeFirst'

interface IProps {
  children: IServiceDocument
  onDelete: any
  service: TService
}

const renderTrueFalse = (a: boolean) => (a ? '✓' : '×')

class Service extends React.PureComponent<IProps> {
  public handleDelete = async () => {
    try {
      await deleteService(this.props.children._id)
      this.props.onDelete()
    } catch {
      // TODO
    }
  }

  public render() {
    const { children, service } = this.props

    const editTo = `services/${
      service === GARDENING
        ? GARDENING
        : service === IRONING
          ? IRONING
          : CLEANING
    }`

    return (
      <Card>
        <h3>{capitalizeFirst(children.service)}</h3>
        <ul>
          <li>Hourly rate: £{String(children.hourlyRate)}</li>
          {children.service === 'cleaning' && (
            <li>General clean: {renderTrueFalse(children.general)}</li>
          )}
          {(children as IServiceCleaningDocument).deepClean !== undefined && (
            <li>
              Deep clean:{' '}
              {renderTrueFalse(
                (children as IServiceCleaningDocument).deepClean,
              )}
            </li>
          )}
          {(children as IServiceIroningDocument).bedLinen !== undefined && (
            <li>
              Bed linen:{' '}
              {renderTrueFalse((children as IServiceIroningDocument).bedLinen)}
            </li>
          )}
          {(children as IServiceCleaningDocument).carpetClean !== undefined && (
            <li>
              Carpet clean:{' '}
              {renderTrueFalse(
                (children as IServiceCleaningDocument).carpetClean,
              )}
            </li>
          )}
          {(children as IServiceIroningDocument).collectAndReturn !==
            undefined && (
            <li>
              Collect and return:{' '}
              {renderTrueFalse(
                (children as IServiceIroningDocument).collectAndReturn,
              )}
            </li>
          )}
          {children.service === 'gardening' && (
            <li>General gardening: {renderTrueFalse(children.general)}</li>
          )}
          {(children as IServiceIroningDocument).other !== undefined && (
            <li>
              Other:{' '}
              {renderTrueFalse((children as IServiceIroningDocument).other)}
            </li>
          )}
          {(children as IServiceCleaningDocument).ovenClean !== undefined && (
            <li>
              Oven clean:{' '}
              {renderTrueFalse(
                (children as IServiceCleaningDocument).ovenClean,
              )}
            </li>
          )}
          {(children as IServiceIroningDocument).shirts !== undefined && (
            <li>
              Shirts:{' '}
              {renderTrueFalse((children as IServiceIroningDocument).shirts)}
            </li>
          )}
          {children.service === 'ironing' && (
            <li>Specialist ironing: {renderTrueFalse(children.specialist)}</li>
          )}
          {children.service === 'gardening' && (
            <li>
              Specialist gardening: {renderTrueFalse(children.specialist)}
            </li>
          )}
          {(children as IServiceIroningDocument).trousers !== undefined && (
            <li>
              Trousers:{' '}
              {renderTrueFalse((children as IServiceIroningDocument).trousers)}
            </li>
          )}
          {(children as IServiceCleaningDocument).hasOwnProducts !==
            undefined && (
            <li>
              Have own products:{' '}
              {renderTrueFalse(
                (children as IServiceCleaningDocument).hasOwnProducts,
              )}
            </li>
          )}
          <li>
            Have own equipment: {renderTrueFalse(children.hasOwnEquipment)}
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

export default Service
