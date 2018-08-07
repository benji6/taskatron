import { Card } from 'eri'
import * as React from 'react'
import {
  IServiceCleaningRecord,
  IServiceIroningRecord,
  IServiceRecord,
} from '../../../shared/types'
import capitalizeFirst from '../../../utils/capitalizeFirst'

interface IProps {
  children: IServiceRecord
}

class Service extends React.PureComponent<IProps> {
  public render() {
    const { children } = this.props

    return (
      <Card>
        <h3>{capitalizeFirst(children.service)}</h3>
        <ul>
          <li>Hourly rate: £{JSON.stringify(children.hourlyRate)}</li>
          {(children as IServiceIroningRecord).bedLinen && (
            <li>
              Bed linen:{' '}
              {JSON.stringify((children as IServiceIroningRecord).bedLinen)}
            </li>
          )}
          {(children as IServiceCleaningRecord).carpetClean && (
            <li>
              Carpet clean:{' '}
              {JSON.stringify((children as IServiceCleaningRecord).carpetClean)}
            </li>
          )}
          {(children as IServiceIroningRecord).collectAndReturn && (
            <li>
              Collect and return:{' '}
              {JSON.stringify(
                (children as IServiceIroningRecord).collectAndReturn,
              )}
            </li>
          )}
          {(children as IServiceCleaningRecord).deepClean && (
            <li>
              Deep clean:{' '}
              {JSON.stringify((children as IServiceCleaningRecord).deepClean)}
            </li>
          )}
          {children.service === 'cleaning' && (
            <li>General clean: {JSON.stringify(children.general)}</li>
          )}
          {children.service === 'gardening' && (
            <li>General gardening: {JSON.stringify(children.general)}</li>
          )}
          {(children as IServiceIroningRecord).other && (
            <li>
              Other: {JSON.stringify((children as IServiceIroningRecord).other)}
            </li>
          )}
          {(children as IServiceCleaningRecord).ovenClean && (
            <li>
              Oven clean:{' '}
              {JSON.stringify((children as IServiceCleaningRecord).ovenClean)}
            </li>
          )}
          {(children as IServiceIroningRecord).shirts && (
            <li>
              Shirts:{' '}
              {JSON.stringify((children as IServiceIroningRecord).shirts)}
            </li>
          )}
          {children.service === 'ironing' && (
            <li>Specialist ironing: {JSON.stringify(children.specialist)}</li>
          )}
          {children.service === 'gardening' && (
            <li>Specialist gardening: {JSON.stringify(children.specialist)}</li>
          )}
          {(children as IServiceIroningRecord).trousers && (
            <li>
              Trousers:{' '}
              {JSON.stringify((children as IServiceIroningRecord).trousers)}
            </li>
          )}
          {(children as IServiceCleaningRecord).hasOwnProducts && (
            <li>
              Have own products:{' '}
              {JSON.stringify(
                (children as IServiceCleaningRecord).hasOwnProducts,
              )}
            </li>
          )}
          <li>
            Have own equipment: {JSON.stringify(children.hasOwnEquipment)}
          </li>
        </ul>
      </Card>
    )
  }
}

export default Service
