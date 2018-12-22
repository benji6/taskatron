import { Button, ButtonGroup } from 'eri'
import * as React from 'react'
import { Query } from 'react-apollo'
import query from './query'
import Search from './Search'

const Home = () => (
  <>
    <Query query={query}>
      {({ error, loading }) => {
        if (loading) return null
        if (!error || !error.message.includes('User is not logged in')) {
          return null
        }
        return (
          <ButtonGroup>
            <Button to="sign-up">Join us!</Button>
            <Button to="sign-in" variant="secondary">
              Sign in
            </Button>
          </ButtonGroup>
        )
      }}
    </Query>
    <Search />
  </>
)

export default Home
