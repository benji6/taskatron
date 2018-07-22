import * as React from 'react'

class Option extends React.PureComponent<
  React.OptionHTMLAttributes<HTMLOptionElement>
> {
  public render() {
    return <option {...this.props} />
  }
}

export default Option
