import { Header as EriHeader, MenuButton } from 'eri'
import * as React from 'react'
import { Query } from 'react-apollo'
import { Link } from 'react-router-dom'
import query from './query'

interface IProps {
  onMenuOpen(): void
}

const Header = ({ onMenuOpen }: IProps) => (
  <EriHeader>
    <h1>
      <Link className="header__heading-link" to="/">
        Taskatron
      </Link>
    </h1>
    <Query query={query}>
      {({ data }) => (data ? <MenuButton onClick={onMenuOpen} /> : null)}
    </Query>
  </EriHeader>
)

export default Header
