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
  enableFilters: boolean
}

const initialState: IState = {
  carpetClean: false,
  deepClean: false,
  enableFilters: false,
  general: false,
  hasOwnEquipment: false,
  hasOwnProducts: false,
  ovenClean: false,
}

export default class Filters extends React.PureComponent<IProps> {
  public state: IState = initialState

  public handleEnableFiltersChange = ({
    target: { checked },
  }: React.ChangeEvent<any>) => {
    if (checked) return this.setState({ enableFilters: checked })
    this.setState(initialState)
    this.setFilters(initialState)
  }

  public setFilters(state: IState) {
    const filteredNewState = filterObj(Boolean, state)
    delete filteredNewState.enableFilters
    this.props.setFilters(filteredNewState)
  }

  public handleChange = (key: keyof IServiceFilters) => ({
    target: { checked },
  }: React.ChangeEvent<any>) => {
    this.setState((state: IState) => {
      const newState = { ...state, [key]: checked }
      this.setFilters(newState)
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
      enableFilters,
    } = this.state

    return (
      <>
        <Checkbox
          checked={enableFilters}
          onChange={this.handleEnableFiltersChange}
          label="Enable filters"
        />
        {enableFilters && (
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
