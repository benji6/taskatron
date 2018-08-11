import * as React from 'react'
import { Link } from 'react-router-dom'
import { getServices } from '../../../api'
import { IServiceRecord } from '../../../shared/types'
import Service from './Service'

interface IState {
  error?: Error
  services?: IServiceRecord[]
}

class Services extends React.PureComponent<{}, IState> {
  public state = {
    error: undefined,
    services: undefined,
  }

  public async componentDidMount() {
    try {
      const response = await getServices()
      const services: IServiceRecord[] = await response.json()
      this.setState({ services })
    } catch (e) {
      this.setState({ error: e })
    }
  }

  public render() {
    const { error, services } = this.state as IState

    return (
      <main>
        <h2>Services</h2>
        <p>
          Add a new service - <Link to="/services/cleaning">cleaning</Link>,{' '}
          <Link to="/services/gardening">gardening</Link>, or{' '}
          <Link to="/services/ironing">ironing</Link>.
        </p>
        {error ? (
          <p>
            Oops, there was an error fetching your services, please try again
          </p>
        ) : (
          services &&
          services.map(service => (
            <Service key={service._id} service={service.service}>
              {service}
            </Service>
          ))
        )}
      </main>
    )
  }
}

export default Services
