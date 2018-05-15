import * as React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {isLoggedInSelector} from '../../selectors';
import IStore from '../../types/IStore';

import './style.css'

interface IProps {
  readonly isLoggedIn: boolean
}

class Header extends React.PureComponent<IProps> {
  public render (): React.ReactNode {
    const {isLoggedIn} = this.props

    return (
      <header className="header">
        <h1 className="header__heading">
          <Link className="header__heading-link" to="/">mu</Link>
        </h1>
        <div className="header__profile">
          { isLoggedIn ? (
            "username"
          ) : (
            <Link className="header__link" to="sign-in">
              Sign in
            </Link>
          ) }
        </div>
        <div className="header__sign-up">
          <Link className="header__link" to="sign-up">
            Join us
          </Link>
        </div>
      </header>
    )
  }
}

const mapStateToProps = (state: IStore): IProps => ({
  isLoggedIn: isLoggedInSelector(state)
})

export default connect(mapStateToProps)(Header)
