import * as React from 'react';
import {Main} from '../../generic';
import Header from '../../Header'

class Home extends React.PureComponent {
  public render (): React.ReactNode {
    return (
      <>
        <Header/>
        <Main>
          <p>This is home.</p>
        </Main>
      </>
    )
  }
}

export default Home
