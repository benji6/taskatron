import * as React from 'react'
import Spinner from '../Spinner'
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
    const {children, disabled, variation, ...rest} = this.props

    const className = `button button--${variation}`

    return (
      <button className={className} disabled={disabled} {...rest}>
        {disabled ? (
          <Spinner />
        ) : (
          children
        )}
      </button>
    )
  }
}

export default Button
