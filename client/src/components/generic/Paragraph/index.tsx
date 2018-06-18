import * as classnames from 'classnames'
import * as React from 'react'
import './style.css'

interface IProps {
  readonly children: React.ReactNode
  readonly center?: boolean
}

class Paragraph extends React.PureComponent<IProps> {
  public render(): React.ReactNode {
    const { center, ...rest } = this.props
    const className = classnames('paragraph', {
      'paragraph--center': center,
    })

    return <p {...rest} className={className} />
  }
}

export default Paragraph
