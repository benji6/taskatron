import { Checkbox, Toggle } from 'eri'
import * as React from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { IServiceFilters } from '../../../../shared/types'
import { filterObj } from '../../../../shared/utils'

interface IProps extends RouteComponentProps {
  urlSearchFilters: IServiceFilters
  setFilters(filters: IServiceFilters): void
}

interface IState {
  carpetClean: boolean
  deepClean: boolean
  enableFilters: boolean
  general: boolean
  hasOwnEquipment: boolean
  hasOwnProducts: boolean
  lastQueryString: string
  ovenClean: boolean
}

class Filters extends React.PureComponent<IProps> {
  public static getDerivedStateFromProps(props: IProps, state: IState) {
    if (props.location.search === '' && state.lastQueryString !== '') {
      const filteredNewState = filterObj(Boolean, state)
      delete filteredNewState.enableFilters
      delete filteredNewState.lastQueryString
      props.setFilters(filteredNewState)
      return {
        carpetClean: false,
        deepClean: false,
        enableFilters: false,
        general: false,
        hasOwnEquipment: false,
        hasOwnProducts: false,
        lastQueryString: '',
        ovenClean: false,
      }
    }
    return { lastQueryString: props.location.search }
  }

  public state: IState = {
    carpetClean: this.props.urlSearchFilters.carpetClean || false,
    deepClean: this.props.urlSearchFilters.deepClean || false,
    enableFilters: Boolean(Object.keys(this.props.urlSearchFilters).length),
    general: this.props.urlSearchFilters.general || false,
    hasOwnEquipment: this.props.urlSearchFilters.hasOwnEquipment || false,
    hasOwnProducts: this.props.urlSearchFilters.hasOwnProducts || false,
    lastQueryString: '',
    ovenClean: this.props.urlSearchFilters.ovenClean || false,
  }

  public handleEnableFiltersChange = ({
    target: { checked },
  }: React.ChangeEvent<any>) => {
    if (checked) return this.setState({ enableFilters: checked })
    this.setState({
      carpetClean: false,
      deepClean: false,
      enableFilters: false,
      general: false,
      hasOwnEquipment: false,
      hasOwnProducts: false,
      ovenClean: false,
    })
    this.setFilters({
      carpetClean: false,
      deepClean: false,
      enableFilters: false,
      general: false,
      hasOwnEquipment: false,
      hasOwnProducts: false,
      lastQueryString: '',
      ovenClean: false,
    })
  }

  public setFilters(state: IState) {
    const filteredNewState = filterObj(Boolean, state)
    delete filteredNewState.enableFilters
    delete filteredNewState.lastQueryString
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
        <Toggle
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

export default withRouter(Filters)
