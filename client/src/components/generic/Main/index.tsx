import * as React from 'react'
import './style.css'

interface IProps {
  children: React.ReactNode
}

class Main extends React.PureComponent<IProps> {
  public render(): React.ReactNode {
    const { children } = this.props

    return <main className="main">{children}</main>
  }
}

export default Main
