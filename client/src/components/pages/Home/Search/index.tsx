import {
  Button,
  ButtonGroup,
  Pagination,
  RadioButton,
  RadioGroup,
  Spinner,
} from 'eri'
import { History, Location } from 'history' // tslint:disable-line no-implicit-dependencies
import * as React from 'react'
import { withRouter } from 'react-router-dom'
import {
  getCleaningServices,
  getGardeningServices,
  getIroningServices,
} from '../../../../api'
import serviceNames, {
  CLEANING,
  GARDENING,
  IRONING,
} from '../../../../shared/services'
import {
  ICleaningFilters,
  IGardeningFilters,
  IIroningFilters,
  IServiceCleaningResponseObject,
  IServiceGardeningResponseObject,
  IServiceIroningResponseObject,
  TService,
} from '../../../../shared/types'
import { capitalizeFirst, createSearchString } from '../../../../utils'
import CleaningCard from './CleaningCard'
import CleaningFilters from './CleaningFilters'
import GardeningCard from './GardeningCard'
import GardeningFilters from './GardeningFilters'
import IroningCard from './IroningCard'
import IroningFilters from './IroningFilters'

const resultsPerPage = 10

type Filters = ICleaningFilters | IGardeningFilters | IIroningFilters

interface IProps {
  location: Location
  history: History
}

interface IState {
  currentPage?: number
  filters?: Filters
  isLoading: boolean
  loadedServiceType: TService
  pageCount: number
  services?:
    | IServiceCleaningResponseObject[]
    | IServiceGardeningResponseObject[]
    | IServiceIroningResponseObject[]
  servicesError: boolean
  serviceType: TService
  total: number
}

class Search extends React.PureComponent<IProps> {
  public state: IState = {
    currentPage: undefined,
    filters: undefined,
    isLoading: false,
    loadedServiceType: CLEANING,
    pageCount: 0,
    serviceType: this.initialServiceType,
    services: undefined,
    servicesError: false,
    total: 0,
  }

  get initialServiceType(): TService {
    const serviceTypeSearchParam = new URLSearchParams(
      this.props.location.search,
    ).get('serviceType')
    return serviceTypeSearchParam &&
      serviceNames.includes(serviceTypeSearchParam)
      ? (serviceTypeSearchParam as TService)
      : CLEANING
  }

  get page() {
    return new URLSearchParams(this.props.location.search).get('page')
  }

  get serviceType() {
    return new URLSearchParams(this.props.location.search).get('serviceType')
  }

  public setFilters = (filters: Filters) => this.setState({ filters })

  public componentDidMount() {
    if (!this.page && !this.serviceType) {
      return
    }

    if (!this.page || !this.serviceType) {
      return this.props.history.replace('/')
    }

    this.search(Number(this.page))
  }

  public componentWillReceiveProps(nextProps: IProps) {
    const nextSearchParams = new URLSearchParams(nextProps.location.search)

    const page = nextSearchParams.get('page')
    const serviceType = nextSearchParams.get('serviceType')

    if (!page && !serviceType) {
      return this.setState({
        currentPage: 0,
        pageCount: 0,
        services: undefined,
      })
    }

    if (!page || !serviceType) {
      this.props.history.replace('/')

      return this.setState({
        currentPage: 0,
        pageCount: 0,
        services: undefined,
      })
    }

    this.search(Number(page))
  }

  public handleServiceChange = ({
    target: { value },
  }: React.ChangeEvent<any>) => {
    this.setState({
      currentPage: 0,
      pageCount: 0,
      serviceType: value,
      services: undefined,
    })
  }

  public search = async (page = 0) => {
    const { filters, serviceType } = this.state

    this.setState({ isLoading: true, servicesError: false })

    try {
      const { results, total } = await (serviceType === GARDENING
        ? getGardeningServices({
            ...filters,
            limit: resultsPerPage,
            skip: page * resultsPerPage,
          } as any)
        : serviceType === IRONING
          ? getIroningServices({
              ...filters,
              limit: resultsPerPage,
              skip: page * resultsPerPage,
            } as any)
          : getCleaningServices({
              ...filters,
              limit: resultsPerPage,
              skip: page * resultsPerPage,
            } as any))

      this.setState({
        currentPage: page,
        loadedServiceType: serviceType,
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
    const { serviceType } = this.state

    history.push(createSearchString({ page, serviceType }))
  }

  public render(): React.ReactNode {
    const {
      currentPage,
      filters,
      isLoading,
      loadedServiceType,
      pageCount,
      serviceType,
      services,
      servicesError,
      total,
    } = this.state

    const search = createSearchString({
      page: Number(currentPage) || 0,
      serviceType,
      ...filters,
    })

    return (
      <>
        <h2>Services</h2>
        <RadioGroup label="What type of service are you looking for?">
          {serviceNames.map(serviceName => (
            <RadioButton
              checked={serviceName === serviceType}
              key={serviceName}
              name="service"
              onChange={this.handleServiceChange}
              value={serviceName}
            >
              {capitalizeFirst(serviceName)}
            </RadioButton>
          ))}
        </RadioGroup>
        {serviceType === GARDENING ? (
          <GardeningFilters setFilters={this.setFilters} />
        ) : serviceType === IRONING ? (
          <IroningFilters setFilters={this.setFilters} />
        ) : (
          <CleaningFilters setFilters={this.setFilters} />
        )}
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
            {(services as any).map(
              (service: any) =>
                loadedServiceType === CLEANING ? (
                  <CleaningCard key={service._id}>{service}</CleaningCard>
                ) : loadedServiceType === GARDENING ? (
                  <GardeningCard key={service._id}>{service}</GardeningCard>
                ) : (
                  <IroningCard key={service._id}>{service}</IroningCard>
                ),
            )}
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
