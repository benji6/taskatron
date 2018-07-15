import * as classnames from 'classnames'
import * as React from 'react'
import './style.css'

interface IProps extends React.HTMLAttributes<HTMLParagraphElement> {
  readonly textCenter?: boolean
}

class Paragraph extends React.PureComponent<IProps> {
  public render(): React.ReactNode {
    const { textCenter, ...rest } = this.props
    const className = classnames('paragraph', {
      'paragraph--center': textCenter,
    })

    return <p {...rest} className={className} />
  }
}

export default Paragraph
