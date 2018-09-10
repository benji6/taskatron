import { Button, ButtonGroup, RadioButton, RadioGroup, Spinner } from 'eri'
import * as React from 'react'
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
  IServiceCleaningResponseObject,
  IServiceGardeningResponseObject,
  IServiceIroningResponseObject,
  TService,
} from '../../../../shared/types'
import capitalizeFirst from '../../../../utils/capitalizeFirst'
import CleaningCard from './CleaningCard'
import GardeningCard from './GardeningCard'
import IroningCard from './IroningCard'

const resultsPerPage = 10

interface IState {
  currentPage: number
  isLoading: boolean
  loadedServiceType: TService
  pageCount: number
  services?:
    | IServiceCleaningResponseObject[]
    | IServiceGardeningResponseObject[]
    | IServiceIroningResponseObject[]
  servicesError: boolean
  serviceType: TService
}

export default class Search extends React.PureComponent {
  public state: IState = {
    currentPage: 0,
    isLoading: false,
    loadedServiceType: CLEANING,
    pageCount: 0,
    serviceType: CLEANING,
    services: undefined,
    servicesError: false,
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
    const { serviceType } = this.state

    this.setState({ isLoading: true })

    const apiFn =
      serviceType === GARDENING
        ? getGardeningServices
        : serviceType === IRONING
          ? getIroningServices
          : getCleaningServices

    try {
      const responseBody = await apiFn({
        limit: resultsPerPage,
        skip: page * resultsPerPage,
      })

      this.setState({
        currentPage: page,
        loadedServiceType: serviceType,
        pageCount: Math.ceil(responseBody.total / resultsPerPage),
        services: responseBody.results,
      })
    } catch {
      this.setState({ servicesError: true })
    } finally {
      this.setState({ isLoading: false })
    }
  }

  public render(): React.ReactNode {
    const {
      currentPage,
      isLoading,
      loadedServiceType,
      pageCount,
      serviceType,
      services,
      servicesError,
    } = this.state

    return (
      <>
        <h2>Services (under construction)</h2>
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
        <ButtonGroup>
          <Button onClick={() => this.search()} type="button">
            Search
          </Button>
        </ButtonGroup>
        {servicesError ? (
          <p e-util="center negative" e-sentiment="negative">
            Oops, there was an error fetching services, please try again.
          </p>
        ) : services ? (
          <>
            {(services as any).map(
              (service: any) =>
                loadedServiceType === CLEANING ? (
                  <CleaningCard key={service._id}>
                    {service as IServiceCleaningResponseObject}
                  </CleaningCard>
                ) : loadedServiceType === GARDENING ? (
                  <GardeningCard key={service._id}>
                    {service as IServiceGardeningResponseObject}
                  </GardeningCard>
                ) : (
                  <IroningCard key={service._id}>
                    {service as IServiceIroningResponseObject}
                  </IroningCard>
                ),
            )}
            {pageCount && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  margin: '1rem',
                }}
              >
                {currentPage !== 0 && (
                  <button onClick={() => this.search(currentPage - 1)}>
                    previous
                  </button>
                )}
                {Array.from({ length: Math.min(pageCount, 6) }, (_, i) => (
                  <button key={i} onClick={() => this.search(i)}>
                    {i + 1}
                  </button>
                ))}
                {currentPage !== pageCount - 1 && (
                  <button onClick={() => this.search(currentPage + 1)}>
                    next
                  </button>
                )}
              </div>
            )}
          </>
        ) : (
          isLoading && <Spinner variation="page" />
        )}
      </>
    )
  }
}
