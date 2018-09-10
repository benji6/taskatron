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
  IServiceResponseObject,
  TService,
} from '../../../../shared/types'
import capitalizeFirst from '../../../../utils/capitalizeFirst'
import CleaningCard from './CleaningCard'
import GardeningCard from './GardeningCard'
import IroningCard from './IroningCard'

interface IState {
  isLoading: boolean
  loadedServiceType: TService
  services?: IServiceResponseObject[]
  servicesError: boolean
  serviceType: TService
}

export default class Search extends React.PureComponent {
  public state: IState = {
    isLoading: false,
    loadedServiceType: CLEANING,
    serviceType: CLEANING,
    services: undefined,
    servicesError: false,
  }

  public handleServiceChange = ({
    target: { value },
  }: React.ChangeEvent<any>) => {
    this.setState({ serviceType: value })
  }

  public search = async () => {
    const { serviceType } = this.state

    this.setState({ isLoading: true })

    const apiFn =
      serviceType === GARDENING
        ? getGardeningServices
        : serviceType === IRONING
          ? getIroningServices
          : getCleaningServices

    try {
      const services = await apiFn()
      this.setState({ services, loadedServiceType: serviceType })
    } catch {
      this.setState({ servicesError: true })
    } finally {
      this.setState({ isLoading: false })
    }
  }

  public render(): React.ReactNode {
    const {
      isLoading,
      loadedServiceType,
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
          <Button onClick={this.search} type="button">
            Search
          </Button>
        </ButtonGroup>
        {servicesError ? (
          <p e-util="center negative" e-sentiment="negative">
            Oops, there was an error fetching services, please try again.
          </p>
        ) : services ? (
          services.map(
            service =>
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
          )
        ) : (
          isLoading && <Spinner variation="page" />
        )}
      </>
    )
  }
}
