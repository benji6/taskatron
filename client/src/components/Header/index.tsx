import * as React from 'react'
import { Link } from 'react-router-dom'

class Header extends React.PureComponent {
  public render(): React.ReactNode {
    return (
      <header>
        <h1>
          <Link className="header__heading-link" to="/">
            Taskatron
          </Link>
        </h1>
      </header>
    )
  }
}

export default Header
