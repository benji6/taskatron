import * as React from 'react'
import './style.css'

class Form extends React.PureComponent<
  React.FormHTMLAttributes<HTMLFormElement>
> {
  public render() {
    const { children, ...rest } = this.props

    return (
      <form {...rest} className="form">
        {this.props.children}
      </form>
    )
  }
}

export default Form
