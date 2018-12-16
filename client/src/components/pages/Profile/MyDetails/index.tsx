import { ButtonGroup, Card } from 'eri'
import * as React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  userEmailSelector,
  userFirstNameSelector,
  userIdSelector,
  userLastNameSelector,
  userPostcodeSelector,
} from '../../../../selectors'
import IStore from '../../../../types/IStore'

interface IProps {
  email: string
  firstName: string
  lastName: string
  postcode: string
  userId: string
}

const MyDetails = ({ email, firstName, lastName, postcode }: IProps) => (
  <Card>
    <h3>My details</h3>
    <p>These are your personal details and can only be seen by you:</p>
    <ul>
      <li>
        <b>First name:</b> {firstName}
      </li>
      <li>
        <b>Last name:</b> {lastName}
      </li>
      <li>
        <b>Email:</b> {email}
      </li>
      <li>
        <b>Postcode:</b> {postcode}
      </li>
    </ul>
    <ButtonGroup>
      <Link className="e-button e-button--primary" to="/profile/user">
        Edit
      </Link>
    </ButtonGroup>
  </Card>
)

const mapStateToProps = (state: IStore) => ({
  email: userEmailSelector(state) as string,
  firstName: userFirstNameSelector(state) as string,
  lastName: userLastNameSelector(state) as string,
  postcode: userPostcodeSelector(state) as string,
  userId: userIdSelector(state) as string,
})

export default connect(mapStateToProps)(MyDetails)
