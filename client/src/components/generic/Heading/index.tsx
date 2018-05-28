import * as React from 'react';
import './style.css';

interface IProps {
  children: React.ReactNode
  variation?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

class Heading extends React.PureComponent<IProps> {
  public render (): React.ReactNode {
    const {
      children,
      variation: Variation = 'h1'
    } = this.props;

    return (
      <Variation className="heading">{children}</Variation>
    )
  }
}

export default Heading
