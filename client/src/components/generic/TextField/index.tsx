import * as classnames from 'classnames';
import * as React from 'react';
import './style.css';

interface IProps {
  readonly children: React.ReactNode
  readonly error?: string
  readonly onChange: (_: any) => void
  readonly type?: 'email'
}

class TextField extends React.PureComponent<IProps> {
  public render(): React.ReactNode {
    const {children, error, ...rest} = this.props;

    const inputClassName = classnames('text-field__input', {
      ['text-field__input--error']: Boolean(error)
    })

    return (
      <label className="text-field">
        <div className="text-field__label">{children}</div>
        <input className={inputClassName} type="text" {...rest}/>
        {error && <div className="text-field__error">{error}</div>}
      </label>
    )
  }
}

export default TextField
