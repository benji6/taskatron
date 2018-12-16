import { Button, ButtonGroup, ImageUpload, Spinner } from 'eri'
import {
  Field,
  FieldProps,
  Form,
  Formik,
  FormikActions,
  FormikProps,
} from 'formik'
import * as React from 'react'
import { Mutation, Query } from 'react-apollo'
import { Link, match, Redirect } from 'react-router-dom'
import { maxImageSize } from 'shared/constants'
import { putServiceImage } from '../../../api'
import { getFieldError, serviceImageUrl } from '../../../utils'
import mutation from './mutation'
import query from './query'

interface IFormValues {
  image?: File
}

interface IProps {
  match: match<{ id: string }>
}

interface IState {
  submittedSuccessfully: boolean
}

export default class EditServiceImage extends React.PureComponent<IProps> {
  public hasUnmounted = false

  public state: IState = {
    submittedSuccessfully: false,
  }

  public componentWillUnmount() {
    this.hasUnmounted = true
  }

  public render() {
    const { id } = this.props.match.params
    const { submittedSuccessfully } = this.state

    if (submittedSuccessfully) return <Redirect to="/profile" />

    const initialValues = {
      image: undefined,
    }

    return (
      <Query fetchPolicy="network-only" query={query} variables={{ id }}>
        {({ loading, error, data }) => (
          <Mutation
            mutation={mutation}
            variables={{ id, imagePath: `${id}/image.jpg` }}
          >
            {updateService => {
              const handleSubmit = async (
                values: IFormValues,
                actions: FormikActions<IFormValues>,
              ) => {
                const image = values.image as File

                await putServiceImage({ id, image })
                await updateService()

                if (this.hasUnmounted) return

                actions.setSubmitting(false)

                this.setState({ submittedSuccessfully: true })
              }

              return (
                <Formik
                  initialValues={initialValues}
                  onSubmit={handleSubmit}
                  validate={this.validate}
                  render={({
                    isSubmitting,
                    setValues,
                    values,
                  }: FormikProps<IFormValues>) => (
                    <Form noValidate>
                      <h2>Edit image</h2>
                      <h3>Current image</h3>
                      {loading ? (
                        <Spinner variation="page" />
                      ) : error ? (
                        <p e-util="center negative">
                          Oops, there was an error loading your image.
                        </p>
                      ) : (
                        <img
                          alt="your service image"
                          src={serviceImageUrl(data.service.imagePath)}
                        />
                      )}
                      <h3>Choose a new image</h3>
                      <Field
                        name="image"
                        render={({
                          field: { value, ...field },
                          form,
                        }: FieldProps<IFormValues>) => (
                          <ImageUpload
                            {...field}
                            error={getFieldError(form, 'image')}
                            label="Image"
                            onChange={({
                              target,
                            }: React.ChangeEvent<HTMLInputElement>) =>
                              setValues({
                                ...values,
                                [target.name]: target.files && target.files[0],
                              })
                            }
                          />
                        )}
                      />
                      <ButtonGroup>
                        <Button disabled={isSubmitting}>Save</Button>
                        <Link to="/profile">Cancel</Link>
                      </ButtonGroup>
                    </Form>
                  )}
                />
              )
            }}
          </Mutation>
        )}
      </Query>
    )
  }

  private validate = ({ image }: IFormValues) => {
    if (!image) return { image: 'Please select an image to upload' }

    if (image.size > maxImageSize) {
      return {
        image: `Image must be less than ${maxImageSize / 1e6}MB, but is ${(
          image.size / 1e6
        ).toFixed(2)}MB`,
      }
    }

    return {}
  }
}
