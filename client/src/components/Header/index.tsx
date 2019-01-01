import { Header as EriHeader, MenuButton } from 'eri'
import * as React from 'react'
import { Query } from 'react-apollo'
import { Link } from 'react-router-dom'
import { queryMyId } from '../../queries'

interface IProps {
  onMenuOpen(): void
}

const Header = ({ onMenuOpen }: IProps) => (
  <EriHeader>
    <h1>
      <Link className="header__heading-link" to="/">
        Cleanly
      </Link>
    </h1>
    <Query query={queryMyId}>
      {({ data }) =>
        data && data.me ? <MenuButton onClick={onMenuOpen} /> : null
      }
    </Query>
  </EriHeader>
)

export default Header
