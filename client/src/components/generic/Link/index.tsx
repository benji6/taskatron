import * as React from 'react'
import { Link as RRLink, LinkProps } from 'react-router-dom'
import './style.css'

class Link extends React.PureComponent<LinkProps> {
  public render() {
    return <RRLink {...this.props} className="link" />
  }
}

export default Link
