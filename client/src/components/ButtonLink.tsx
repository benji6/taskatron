import { Button } from 'eri'
import { LocationDescriptorObject, Path } from 'history' // tslint:disable-line no-implicit-dependencies
import * as React from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'

type Props = RouteComponentProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    history: History
    sentiment?: 'negative'
    to?: LocationDescriptorObject | Path
    variant?: 'primary' | 'secondary'
  }

const ButtonLink = ({
  history,
  location,
  match,
  onClick,
  staticContext,
  to,
  ...rest
}: Props) => (
  <Button
    {...rest}
    onClick={e => {
      if (onClick) onClick(e)
      if (to) history.push(to as Path)
    }}
  />
)

export default withRouter(ButtonLink)
