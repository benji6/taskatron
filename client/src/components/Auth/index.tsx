import * as React from 'react'
import { connect } from 'react-redux'
import { userCheckSignedIn } from '../../actions'

interface IProps {
  handleMount: typeof userCheckSignedIn
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
  handleMount: userCheckSignedIn,
}

export default connect(
  null,
  mapDispatchToProps,
)(Auth)
