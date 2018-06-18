import * as classnames from 'classnames'
import * as React from 'react'
import './style.css'

interface IProps {
  ground?: boolean
  page?: boolean
}

class Spinner extends React.PureComponent<IProps> {
  public render() {
    const { ground, page } = this.props

    const className = classnames('spinner', {
      'spinner--ground': ground,
      'spinner--page': page,
    })

    return <span className={className} />
  }
}

export default Spinner
