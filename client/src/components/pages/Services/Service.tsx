import { Card } from 'eri'
import * as React from 'react'
import { Link } from 'react-router-dom'
import { CLEANING, GARDENING, IRONING } from '../../../shared/services'
import {
  IServiceCleaningRecord,
  IServiceIroningRecord,
  IServiceRecord,
  TService,
} from '../../../shared/types'
import capitalizeFirst from '../../../utils/capitalizeFirst'

interface IProps {
  children: IServiceRecord
  service: TService
}

const renderTrueFalse = (a: boolean) => (a ? '✓' : '×')

class Service extends React.PureComponent<IProps> {
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
        <h3>
          {capitalizeFirst(children.service)} (<Link to={editTo}>edit</Link>)
        </h3>

        <ul>
          <li>Hourly rate: £{String(children.hourlyRate)}</li>
          {(children as IServiceIroningRecord).bedLinen && (
            <li>
              Bed linen:{' '}
              {renderTrueFalse((children as IServiceIroningRecord).bedLinen)}
            </li>
          )}
          {(children as IServiceCleaningRecord).carpetClean && (
            <li>
              Carpet clean:{' '}
              {renderTrueFalse(
                (children as IServiceCleaningRecord).carpetClean,
              )}
            </li>
          )}
          {(children as IServiceIroningRecord).collectAndReturn && (
            <li>
              Collect and return:{' '}
              {renderTrueFalse(
                (children as IServiceIroningRecord).collectAndReturn,
              )}
            </li>
          )}
          {(children as IServiceCleaningRecord).deepClean && (
            <li>
              Deep clean:{' '}
              {renderTrueFalse((children as IServiceCleaningRecord).deepClean)}
            </li>
          )}
          {children.service === 'cleaning' && (
            <li>General clean: {renderTrueFalse(children.general)}</li>
          )}
          {children.service === 'gardening' && (
            <li>General gardening: {renderTrueFalse(children.general)}</li>
          )}
          {(children as IServiceIroningRecord).other && (
            <li>
              Other:{' '}
              {renderTrueFalse((children as IServiceIroningRecord).other)}
            </li>
          )}
          {(children as IServiceCleaningRecord).ovenClean && (
            <li>
              Oven clean:{' '}
              {renderTrueFalse((children as IServiceCleaningRecord).ovenClean)}
            </li>
          )}
          {(children as IServiceIroningRecord).shirts && (
            <li>
              Shirts:{' '}
              {renderTrueFalse((children as IServiceIroningRecord).shirts)}
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
          {(children as IServiceIroningRecord).trousers && (
            <li>
              Trousers:{' '}
              {renderTrueFalse((children as IServiceIroningRecord).trousers)}
            </li>
          )}
          {(children as IServiceCleaningRecord).hasOwnProducts && (
            <li>
              Have own products:{' '}
              {renderTrueFalse(
                (children as IServiceCleaningRecord).hasOwnProducts,
              )}
            </li>
          )}
          <li>
            Have own equipment: {renderTrueFalse(children.hasOwnEquipment)}
          </li>
        </ul>
      </Card>
    )
  }
}

export default Service
