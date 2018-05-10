import * as React from 'react';
import './style.css';

interface IProps {
  readonly children: React.ReactNode
}

class TextField extends React.PureComponent<IProps> {
  public render(): React.ReactNode {
    const {children} = this.props;

    return (
      <label className="text-field">
        {children}
        <input className="text-field__input" type="text" />
      </label>
    )
  }
}

export default TextField
