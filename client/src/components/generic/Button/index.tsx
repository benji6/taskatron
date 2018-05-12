import * as React from 'react'
import './style.css'

interface IProps {
  readonly children: React.ReactNode
  readonly disabled?: boolean
  readonly onClick?: (e: any) => void
  readonly type?: 'button'
  readonly variation?: 'primary' | 'secondary'
}

class Button extends React.PureComponent<IProps> {
  public static defaultProps = {
    variation: 'primary',
  }

  public render (): React.ReactNode {
    const {variation, ...rest} = this.props

    const className = `button button--${variation}`

    return (
      <button className={className} {...rest}/>
    )
  }
}

export default Button
