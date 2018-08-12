import * as React from 'react'
import { Link } from 'react-router-dom'
import { getServices } from '../../../api'
import serviceConstants from '../../../shared/services'
import { IServiceDocument } from '../../../shared/types'
import Service from './Service'

interface IState {
  error: boolean
  services?: IServiceDocument[]
}

class Services extends React.PureComponent {
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
    const { error, services } = this.state as IState

    const newServices =
      services &&
      serviceConstants.filter(
        serviceConstant =>
          !services.find(({ service }) => service === serviceConstant),
      )

    return (
      <main>
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
          services.map(service => (
            <Service
              key={service._id}
              service={service.service}
              onDelete={this.fetchServices}
            >
              {service}
            </Service>
          ))
        )}
      </main>
    )
  }
}

export default Services
