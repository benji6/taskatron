import * as React from 'react';
import {Main, Paragraph} from '../../generic';

class Home extends React.PureComponent {
  public render (): React.ReactNode {
    return (
      <>
        <Main>
          <Paragraph>This is home.</Paragraph>
        </Main>
      </>
    )
  }
}

export default Home
