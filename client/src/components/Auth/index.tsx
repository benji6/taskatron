import * as React from 'react'
import { connect } from 'react-redux'
import { userAuth } from '../../actions'

interface IProps {
  handleMount: typeof userAuth
}

class Auth extends React.PureComponent<IProps> {
  public componentDidMount() {
    this.props.handleMount()
  }

  public render() {
    return null
  }
}

const mapDispatchToProps = {
  handleMount: userAuth,
}

export default connect(
  null,
  mapDispatchToProps,
)(Auth)
