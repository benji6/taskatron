import * as React from 'react';
import {
  Button,
  Link,
  Main,
  Paragraph,
} from '../../generic';

class Home extends React.PureComponent {
  public render (): React.ReactNode {
    return (
      <>
        <Main>
          <Paragraph>This is home.</Paragraph>
          <Link to="sign-up"><Button>Join us!</Button></Link>
        </Main>
      </>
    )
  }
}

export default Home
