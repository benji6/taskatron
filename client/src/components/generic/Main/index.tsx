import * as React from 'react'
import './style.css'

class Main extends React.PureComponent<React.HTMLAttributes<HTMLMainElement>> {
  public render(): React.ReactNode {
    return <main {...this.props} className="main" />
  }
}

export default Main
