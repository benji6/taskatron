import * as React from 'react'
import { Query } from 'react-apollo'
import { Link } from 'react-router-dom'
import { queryMyId } from '../../../queries'
import Search from './Search'

const Home = () => (
  <>
    <Query query={queryMyId}>
      {({ error, loading }) => {
        if (loading) return null
        if (!error || !error.message.includes('User is not logged in')) {
          return null
        }
        return (
          <p e-util="center">
            <Link to="sign-up">Join us</Link>, or{' '}
            <Link to="sign-in">sign in</Link> to list your cleaning service!
          </p>
        )
      }}
    </Query>
    <Search />
  </>
)

export default Home
