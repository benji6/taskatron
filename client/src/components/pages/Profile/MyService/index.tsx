import { Card } from 'eri'
import * as React from 'react'
import ServiceDetails from './ServiceDetails'
import ServiceImage from './ServiceImage'

interface IProps {
  children: any
}

export default class MyService extends React.PureComponent<IProps> {
  public render() {
    const {
      children: { id },
    } = this.props

    return (
      <Card>
        <h3>My Service</h3>
        <p>
          These are the details of your service that people can view and search
          for:
        </p>
        <ServiceImage id={id} />
        <ServiceDetails>{this.props.children}</ServiceDetails>
      </Card>
    )
  }
}
