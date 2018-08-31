import { ButtonGroup, Card } from 'eri'
import * as React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { getServices } from '../../../api'
import {
  userEmailSelector,
  userFirstNameSelector,
  userLastNameSelector,
  userPostcodeSelector,
  userRadiusSelector,
} from '../../../selectors'
import serviceConstants, { CLEANING, GARDENING } from '../../../shared/services'
import { IServiceDocument } from '../../../shared/types'
import IStore from '../../../types/IStore'
import CleaningCard from './CleaningCard'
import GardeningCard from './GardeningCard'
import IroningCard from './IroningCard'

interface IProps {
  email: string
  firstName: string
  lastName: string
  postcode: string
  radius: number
}

interface IState {
  error: boolean
  services?: IServiceDocument[]
}

class Services extends React.PureComponent<IProps> {
  public state: IState = {
    error: false,
    services: undefined,
  }

  public fetchServices = async () => {
    try {
      const services = await getServices()
      this.setState({
        services: services.sort((a, b) => a.service.localeCompare(b.service)),
      })
    } catch {
      this.setState({ error: true })
    }
  }

  public componentDidMount() {
    this.fetchServices()
  }

  public render() {
    const { email, firstName, lastName, postcode, radius } = this.props
    const { error, services } = this.state as IState

    const newServices =
      services &&
      serviceConstants.filter(
        serviceConstant =>
          !services.find(({ service }) => service === serviceConstant),
      )

    return (
      <main>
        <h2>Profile</h2>
        <Card>
          <h3>About me</h3>
          <ul>
            <li>First name: {firstName}</li>
            <li>Last name: {lastName}</li>
            <li>Email: {email}</li>
            <li>Postcode: {postcode}</li>
            <li>Radius: {radius} miles</li>
          </ul>
          <ButtonGroup>
            <Link className="e-button e-button--primary" to="/services/profile">
              Edit
            </Link>
          </ButtonGroup>
        </Card>
        <h2>Services</h2>
        <p>
          {newServices &&
            Boolean(newServices.length) && (
              <>
                Add a new service -{' '}
                {newServices.map((service, i, { length }) => (
                  <span key={service}>
                    <Link to={`/services/${service}`}>{service}</Link>
                    {i === length - 1 ? '.' : i === length - 2 ? ' or ' : ', '}
                  </span>
                ))}
              </>
            )}
        </p>
        {error ? (
          <p>Oops, there was an error, please try again.</p>
        ) : (
          services &&
          services.map(
            service =>
              service.service === CLEANING ? (
                <CleaningCard key={service._id} onDelete={this.fetchServices}>
                  {service}
                </CleaningCard>
              ) : service.service === GARDENING ? (
                <GardeningCard key={service._id} onDelete={this.fetchServices}>
                  {service}
                </GardeningCard>
              ) : (
                <IroningCard key={service._id} onDelete={this.fetchServices}>
                  {service}
                </IroningCard>
              ),
          )
        )}
      </main>
    )
  }
}

const mapStateToProps = (state: IStore) => ({
  email: userEmailSelector(state) as string,
  firstName: userFirstNameSelector(state) as string,
  lastName: userLastNameSelector(state) as string,
  postcode: userPostcodeSelector(state) as string,
  radius: userRadiusSelector(state) as number,
})

export default connect(mapStateToProps)(Services)
