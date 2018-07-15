import * as React from 'react'
import './style.css'

interface IProps extends React.HTMLAttributes<HTMLHeadingElement> {
  variation?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

class Heading extends React.PureComponent<IProps> {
  public render(): React.ReactNode {
    const { variation: Variation = 'h1', ...rest } = this.props
    return <Variation {...rest} className="heading" />
  }
}

export default Heading
