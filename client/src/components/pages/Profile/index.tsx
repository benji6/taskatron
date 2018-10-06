import { ButtonGroup, Card } from 'eri'
import * as React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { getUserService } from '../../../api'
import {
  userEmailSelector,
  userFirstNameSelector,
  userLastNameSelector,
  userPostcodeSelector,
} from '../../../selectors'
import { IServiceDocument } from '../../../shared/types'
import IStore from '../../../types/IStore'
import ServiceCard from './ServiceCard'

interface IProps {
  email: string
  firstName: string
  lastName: string
  postcode: string
  radius: number
}

interface IState {
  error: boolean
  noService: boolean
  service?: IServiceDocument
}

class Service extends React.PureComponent<IProps> {
  public state: IState = {
    error: false,
    noService: false,
    service: undefined,
  }

  public handleDelete = () => {
    this.setState({
      error: false,
      noService: true,
      service: undefined,
    })
  }

  public fetchService = async () => {
    try {
      const service = await getUserService()
      this.setState({
        service,
      })
    } catch (e) {
      if (e.message === '404') return this.setState({ noService: true })
      this.setState({ error: true })
    }
  }

  public componentDidMount() {
    this.fetchService()
  }

  public render() {
    const { email, firstName, lastName, postcode } = this.props
    const { error, noService, service } = this.state as IState

    return (
      <main>
        <Card>
          <h3>My details</h3>
          <p>These are your personal details (only you can see these):</p>
          <ul>
            <li>First name: {firstName}</li>
            <li>Last name: {lastName}</li>
            <li>Email: {email}</li>
            <li>Postcode: {postcode}</li>
          </ul>
          <ButtonGroup>
            <Link className="e-button e-button--primary" to="/profile/user">
              Edit
            </Link>
          </ButtonGroup>
        </Card>
        <p>
          {noService && (
            <>
              <Link to="/profile/service">Add your service here</Link>.
            </>
          )}
        </p>
        {error ? (
          <p e-util="negative">Oops, there was an error, please try again.</p>
        ) : (
          service && (
            <ServiceCard key={service._id} onDelete={this.handleDelete}>
              {service}
            </ServiceCard>
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
})

export default connect(mapStateToProps)(Service)
