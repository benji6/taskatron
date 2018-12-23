import { Button, ButtonGroup, Pagination, Spinner } from 'eri'
import { History, Location } from 'history' // tslint:disable-line no-implicit-dependencies
import * as React from 'react'
import { Query } from 'react-apollo'
import { withRouter } from 'react-router-dom'
import { IServiceFilters } from 'shared/types'
import { createSearchString } from '../../../../utils'
import { resultsPerPage } from './constants'
import Filters from './Filters'
import query from './query'
import Result from './Result'

interface IProps {
  location: Location
  history: History
}

interface IState {
  filters?: IServiceFilters
  services?: any
  total: number
}

class Search extends React.PureComponent<IProps> {
  public state: IState = {
    filters: this.filters,
    services: undefined,
    total: 0,
  }

  get page() {
    return new URLSearchParams(this.props.location.search).get('page')
  }

  get filters() {
    const searchParams = new URLSearchParams(this.props.location.search)
    const filters: IServiceFilters = {}

    for (const filter of [
      'carpetClean',
      'deepClean',
      'general',
      'hasOwnEquipment',
      'hasOwnProducts',
      'ovenClean',
    ]) {
      if (searchParams.get(filter)) {
        filters[filter as keyof IServiceFilters] = true
      }
    }

    return filters
  }

  public setFilters = (filters: IServiceFilters) => this.setState({ filters })

  public handlePaginationChange = (page: number) => {
    this.props.history.push(
      createSearchString({
        page,
        ...this.filters,
      }),
    )
  }

  public render() {
    const { filters } = this.state

    const search = createSearchString({
      page: 0,
      ...filters,
    })

    return (
      <>
        <h2>Find a cleaner</h2>
        <Filters setFilters={this.setFilters} urlSearchFilters={this.filters} />
        <ButtonGroup>
          <Button
            to={{
              pathname: '/',
              search,
            }}
          >
            Search
          </Button>
        </ButtonGroup>
        {typeof this.page === 'string' && (
          <Query
            fetchPolicy="network-only"
            query={query}
            variables={
              {
                ...this.filters,
                skip: Number(this.page) * resultsPerPage,
              } as any
            }
          >
            {({ loading, error, data }) => {
              if (loading) return <Spinner variant="page" />

              if (error) {
                return (
                  <p e-util="center negative">
                    Oops, there was an error searching services, please try
                    again.
                  </p>
                )
              }

              const {
                services: { nodes, total },
              } = data

              return (
                <>
                  {total === 0 ? (
                    <p e-util="center">
                      We can't find any results, try again with a different
                      search.
                    </p>
                  ) : (
                    <p e-util="center">
                      {total} result
                      {total > 1 && 's'} found
                    </p>
                  )}
                  {nodes.map((service: any) => (
                    <Result key={service.id}>{service}</Result>
                  ))}
                  <Pagination
                    onChange={this.handlePaginationChange}
                    page={Number(this.page)}
                    pageCount={Math.ceil(total / resultsPerPage)}
                  />
                </>
              )
            }}
          </Query>
        )}
      </>
    )
  }
}

export default withRouter(Search as any)
