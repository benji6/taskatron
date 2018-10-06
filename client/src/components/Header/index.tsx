import { Header as EriHeader, MenuButton } from 'eri'
import * as React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { userFirstNameSelector } from '../../selectors'
import IStore from '../../types/IStore'

interface IProps {
  firstName?: string
  onMenuOpen(): void
}

class Header extends React.PureComponent<IProps> {
  public render() {
    const { firstName, onMenuOpen } = this.props

    return (
      <EriHeader>
        <h1>
          <Link className="header__heading-link" to="/">
            Taskatron
          </Link>
        </h1>
        {Boolean(firstName) && <MenuButton onClick={onMenuOpen} />}
      </EriHeader>
    )
  }
}

const mapStateToProps = (state: IStore) => ({
  firstName: userFirstNameSelector(state),
})

export default connect(mapStateToProps)(Header)
