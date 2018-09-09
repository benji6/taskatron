import { Button, ButtonGroup, RadioButton, RadioGroup, Spinner } from 'eri'
import * as React from 'react'
import { getServices } from '../../../../api'
import serviceNames, { CLEANING, GARDENING } from '../../../../shared/services'
import { IServiceResponseObject, TService } from '../../../../shared/types'
import CleaningCard from './CleaningCard'
import GardeningCard from './GardeningCard'
import IroningCard from './IroningCard'

interface IState {
  isLoading: boolean
  services?: IServiceResponseObject[]
  servicesError: boolean
  serviceType: TService
}

export default class Search extends React.PureComponent {
  public state: IState = {
    isLoading: false,
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

    try {
      const services = await getServices({ serviceType })
      this.setState({ services })
    } catch {
      this.setState({ servicesError: true })
    } finally {
      this.setState({ isLoading: false })
    }
  }

  public render(): React.ReactNode {
    const { isLoading, serviceType, services, servicesError } = this.state

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
              {serviceName}
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
              service.service === CLEANING ? (
                <CleaningCard key={service._id}>{service}</CleaningCard>
              ) : service.service === GARDENING ? (
                <GardeningCard key={service._id}>{service}</GardeningCard>
              ) : (
                <IroningCard key={service._id}>{service}</IroningCard>
              ),
          )
        ) : (
          isLoading && <Spinner variation="page" />
        )}
      </>
    )
  }
}
