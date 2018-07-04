import * as React from 'react'
import { Link } from 'react-router-dom'
import './style.css'

class Header extends React.PureComponent {
  public render(): React.ReactNode {
    return (
      <header className="header">
        <h1 className="header__heading">
          <Link className="header__heading-link" to="/">
            Taskatron
          </Link>
        </h1>
      </header>
    )
  }
}

export default Header
