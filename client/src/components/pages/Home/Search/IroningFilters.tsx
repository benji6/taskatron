import { Checkbox } from 'eri'
import * as React from 'react'
import { IIroningFilters } from '../../../../shared/types'
import { filterObj } from '../../../../shared/utils'

interface IProps {
  setFilters(filters: IIroningFilters): void
}

interface IState {
  bedLinen: boolean
  collectAndReturn: boolean
  hasOwnEquipment: boolean
  other: boolean
  shirts: boolean
  showFilters: boolean
  specialist: boolean
  trousers: boolean
}

export default class IroningFilters extends React.PureComponent<IProps> {
  public state: IState = {
    bedLinen: false,
    collectAndReturn: false,
    hasOwnEquipment: false,
    other: false,
    shirts: false,
    showFilters: false,
    specialist: false,
    trousers: false,
  }

  public handleShowFiltersChange = ({
    target: { checked },
  }: React.ChangeEvent<any>) => {
    const showFilters = checked
    this.setState({ showFilters })
  }

  public handleChange = (key: keyof IIroningFilters) => ({
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
      bedLinen,
      collectAndReturn,
      hasOwnEquipment,
      other,
      shirts,
      showFilters,
      specialist,
      trousers,
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
              checked={bedLinen}
              onChange={this.handleChange('bedLinen')}
              label="Bed linen"
            />
            <Checkbox
              checked={shirts}
              onChange={this.handleChange('shirts')}
              label="Shirts"
            />
            <Checkbox
              checked={trousers}
              onChange={this.handleChange('trousers')}
              label="Trousers"
            />
            <Checkbox
              checked={other}
              onChange={this.handleChange('other')}
              label="Other standard garments"
            />
            <Checkbox
              checked={specialist}
              onChange={this.handleChange('specialist')}
              label="Specialist ironing"
            />
            <Checkbox
              checked={hasOwnEquipment}
              onChange={this.handleChange('hasOwnEquipment')}
              label="Has own equipment"
            />
            <Checkbox
              checked={collectAndReturn}
              onChange={this.handleChange('collectAndReturn')}
              label="Collect &amp; return"
            />
          </>
        )}
      </>
    )
  }
}
