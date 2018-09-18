import { Checkbox } from 'eri'
import * as React from 'react'
import { IGardeningFilters } from '../../../../shared/types'
import { filterObj } from '../../../../shared/utils'

interface IProps {
  setFilters(filters: IGardeningFilters): void
}

interface IState {
  general: boolean
  hasOwnEquipment: boolean
  hasOwnProducts: boolean
  showFilters: boolean
  specialist: boolean
}

export default class GardeningFilters extends React.PureComponent<IProps> {
  public state: IState = {
    general: false,
    hasOwnEquipment: false,
    hasOwnProducts: false,
    showFilters: false,
    specialist: false,
  }

  public handleShowFiltersChange = ({
    target: { checked },
  }: React.ChangeEvent<any>) => {
    const showFilters = checked
    this.setState({ showFilters })
  }

  public handleChange = (key: keyof IGardeningFilters) => ({
    target: { checked },
  }: React.ChangeEvent<any>) => {
    this.setState(state => {
      const newState = { ...state, [key]: checked }
      const filteredNewState = filterObj(Boolean, newState)
      delete filteredNewState.showFilters
      this.props.setFilters(filteredNewState)
      return newState
    })
  }

  public render() {
    const {
      general,
      hasOwnEquipment,
      hasOwnProducts,
      showFilters,
      specialist,
    } = this.state

    return (
      <>
        <Checkbox
          checked={showFilters}
          onChange={this.handleShowFiltersChange}
          label="Show filters"
        />
        {showFilters && (
          <>
            <Checkbox
              checked={general}
              onChange={this.handleChange('general')}
              label="General gardening"
            />
            <Checkbox
              checked={specialist}
              onChange={this.handleChange('specialist')}
              label="Specialist gardening"
            />
            <Checkbox
              checked={hasOwnProducts}
              onChange={this.handleChange('hasOwnProducts')}
              label="Has own products"
            />
            <Checkbox
              checked={hasOwnEquipment}
              onChange={this.handleChange('hasOwnEquipment')}
              label="Has own equipment"
            />
          </>
        )}
      </>
    )
  }
}
