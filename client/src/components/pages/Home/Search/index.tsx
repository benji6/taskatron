import { Button, ButtonGroup, Pagination, Spinner } from 'eri'
import { History, Location } from 'history' // tslint:disable-line no-implicit-dependencies
import * as React from 'react'
import { withRouter } from 'react-router-dom'
import { getCleaningServices } from '../../../../api'
import {
  ICoord,
  IServiceFilters,
  IServiceResponseObject,
} from '../../../../shared/types'
import { createSearchString, position } from '../../../../utils'
import Filters from './Filters'
import Result from './Result'

const resultsPerPage = 10

interface IProps {
  location: Location
  history: History
}

interface IState {
  coords?: ICoord
  currentPage?: number
  filters?: IServiceFilters
  isLoading: boolean
  pageCount: number
  services?: IServiceResponseObject[]
  servicesError: boolean
  total: number
}

class Search extends React.PureComponent<IProps> {
  public state: IState = {
    currentPage: undefined,
    filters: undefined,
    isLoading: false,
    pageCount: 0,
    services: undefined,
    servicesError: false,
    total: 0,
  }

  get page() {
    return new URLSearchParams(this.props.location.search).get('page')
  }

  public setFilters = (filters: IServiceFilters) => this.setState({ filters })

  public async componentDidMount() {
    if (!this.page) return

    this.search(Number(this.page))

    this.setState((state: IState) => ({
      ...state,
      filters: {
        ...state.filters,
        latitude: 51.5214891,
        longitude: -0.0922047,
      },
    })) // DELETEME

    try {
      const { latitude, longitude } = await position
      this.setState((state: IState) => ({
        ...state,
        filters: { ...state.filters, latitude, longitude },
      }))
    } catch (e) {
      // tslint:disable-next-line:no-console
      console.error(e) // TODO
    }
  }

  public componentWillReceiveProps(nextProps: IProps) {
    const nextSearchParams = new URLSearchParams(nextProps.location.search)

    const page = nextSearchParams.get('page')

    if (!page) {
      return this.setState({
        currentPage: 0,
        pageCount: 0,
        services: undefined,
      })
    }

    this.search(Number(page))
  }

  public search = async (page = 0) => {
    const { filters } = this.state

    this.setState({ isLoading: true, servicesError: false })

    try {
      const { results, total } = await getCleaningServices({
        ...filters,
        limit: resultsPerPage,
        skip: page * resultsPerPage,
      } as any)

      this.setState({
        currentPage: page,
        pageCount: Math.ceil(total / resultsPerPage),
        services: results,
        total,
      })
    } catch {
      this.setState({ servicesError: true })
    } finally {
      this.setState({ isLoading: false })
    }
  }

  public handlePaginationChange = (page: number) => {
    const { history } = this.props

    history.push(createSearchString({ page }))
  }

  public render(): React.ReactNode {
    const {
      currentPage,
      filters,
      isLoading,
      pageCount,
      services,
      servicesError,
      total,
    } = this.state

    const search = createSearchString({
      page: Number(currentPage) || 0,
      ...filters,
    })

    return (
      <>
        <h2>Find a cleaner</h2>
        <Filters setFilters={this.setFilters} />
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
        {servicesError ? (
          <p e-util="center negative" e-sentiment="negative">
            Oops, there was an error fetching services, please try again.
          </p>
        ) : services ? (
          <>
            {total === 0 ? (
              <p e-util="center">
                We can't find any results for your search, try again with a
                different search.
              </p>
            ) : (
              <p e-util="center">
                {total} result
                {total > 1 && 's'} found
              </p>
            )}
            {(services as any).map((service: any) => (
              <Result key={service._id}>{service}</Result>
            ))}
            <Pagination
              onChange={this.handlePaginationChange}
              page={Number(currentPage)}
              pageCount={pageCount}
            />
          </>
        ) : (
          isLoading && <Spinner variation="page" />
        )}
      </>
    )
  }
}

export default withRouter(Search as any)
