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
        <h1 className="header__heading">mu</h1>
        <div className="header__profile">
          { isLoggedIn ? (
            "username"
          ) : (
            <Link className="header__sign-in" to="sign-in">
              Sign in
            </Link>
          ) }
        </div>
      </header>
    )
  }
}

const mapStateToProps = (state: IStore): IProps => ({
  isLoggedIn: isLoggedInSelector(state)
})

export default connect(mapStateToProps)(Header)
