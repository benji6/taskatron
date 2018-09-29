import { Checkbox } from 'eri'
import * as React from 'react'
import { IServiceFilters } from '../../../../shared/types'
import { filterObj } from '../../../../shared/utils'

interface IProps {
  setFilters(filters: IServiceFilters): void
}

interface IState {
  carpetClean: boolean
  deepClean: boolean
  general: boolean
  hasOwnEquipment: boolean
  hasOwnProducts: boolean
  ovenClean: boolean
  showFilters: boolean
}

export default class Filters extends React.PureComponent<IProps> {
  public state: IState = {
    carpetClean: false,
    deepClean: false,
    general: false,
    hasOwnEquipment: false,
    hasOwnProducts: false,
    ovenClean: false,
    showFilters: false,
  }

  public handleShowFiltersChange = ({
    target: { checked },
  }: React.ChangeEvent<any>) => {
    const showFilters = checked
    this.setState({ showFilters })
  }

  public handleChange = (key: keyof IServiceFilters) => ({
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
      carpetClean,
      deepClean,
      general,
      hasOwnEquipment,
      hasOwnProducts,
      ovenClean,
      showFilters,
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
              label="General clean"
            />
            <Checkbox
              checked={deepClean}
              onChange={this.handleChange('deepClean')}
              label="One-off deep clean"
            />
            <Checkbox
              checked={carpetClean}
              onChange={this.handleChange('carpetClean')}
              label="Specialist clean - carpets"
            />
            <Checkbox
              checked={ovenClean}
              onChange={this.handleChange('ovenClean')}
              label="Specialist clean - oven"
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
