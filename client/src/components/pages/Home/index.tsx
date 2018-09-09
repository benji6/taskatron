import { Button, ButtonGroup, Spinner } from 'eri'
import * as React from 'react'
import { connect } from 'react-redux'
import { userSignOut } from '../../../actions'
import { getServices } from '../../../api'
import { userFirstNameSelector } from '../../../selectors'
import { CLEANING, GARDENING } from '../../../shared/services'
import { IServiceResponseObject } from '../../../shared/types'
import IStore from '../../../types/IStore'
import CleaningCard from './CleaningCard'
import GardeningCard from './GardeningCard'
import IroningCard from './IroningCard'

interface IProps {
  firstName: string | undefined
  onSignOut: typeof userSignOut
}

interface IState {
  services?: IServiceResponseObject[]
  servicesError: boolean
}

class Home extends React.PureComponent<IProps> {
  public state: IState = {
    services: undefined,
    servicesError: false,
  }

  public async componentDidMount() {
    try {
      const services = await getServices()
      this.setState({ services })
    } catch {
      this.setState({ servicesError: true })
    }
  }

  public render(): React.ReactNode {
    const { firstName, onSignOut } = this.props
    const { services, servicesError } = this.state

    return (
      <main>
        <h2>Welcome</h2>
        {firstName ? (
          <>
            <p>Hi {firstName}!</p>
            <ButtonGroup>
              <Button to="/services">Manage my services</Button>
              <Button onClick={onSignOut} variant="secondary">
                Sign out
              </Button>
            </ButtonGroup>
          </>
        ) : (
          <ButtonGroup>
            <Button to="sign-up">Join us!</Button>
            <Button to="sign-in" variant="secondary">
              Sign in
            </Button>
          </ButtonGroup>
        )}
        <h2>Services</h2>
        <p>
          Right now this is just an ugly list of all the services, but there's a
          proper search functionality coming soon!
        </p>
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
          <Spinner variation="page" />
        )}
      </main>
    )
  }
}

const mapStateToProps = (state: IStore) => ({
  firstName: userFirstNameSelector(state),
})

const mapDispatchToProps = {
  onSignOut: userSignOut,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Home)
