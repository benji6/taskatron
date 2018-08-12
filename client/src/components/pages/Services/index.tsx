import * as React from 'react'
import { Link } from 'react-router-dom'
import { getServices } from '../../../api'
import { IServiceRecord } from '../../../shared/types'
import Service from './Service'

interface IState {
  error: boolean
  services?: IServiceRecord[]
}

class Services extends React.PureComponent {
  public state: IState = {
    error: false,
    services: undefined,
  }

  public async componentDidMount() {
    try {
      const services = await getServices()
      this.setState({
        services: services.sort((a, b) => a.service.localeCompare(b.service)),
      })
    } catch {
      this.setState({ error: true })
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
          <p>Oops, there was an error, please try again.</p>
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
