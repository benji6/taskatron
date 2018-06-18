import * as React from 'react'
import { Link as RRLink } from 'react-router-dom'
import './style.css'

interface IProps {
  to: string
}

class Link extends React.PureComponent<IProps> {
  public render() {
    return <RRLink {...this.props} className="link" />
  }
}

export default Link
