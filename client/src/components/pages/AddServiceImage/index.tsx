import { Button, ButtonGroup, ImageUpload } from 'eri'
import {
  Field,
  FieldProps,
  Form,
  Formik,
  FormikActions,
  FormikProps,
} from 'formik'
import * as React from 'react'
import { Mutation } from 'react-apollo'
import { Link, match, Redirect } from 'react-router-dom'
import { maxImageSize } from 'shared/constants'
import { postServiceImage } from '../../../api'
import { getFieldError } from '../../../utils'
import mutation from './mutation'

interface IFormValues {
  image?: File
}

interface IProps {
  match: match<{ id: string }>
}

interface IState {
  submittedSuccessfully: boolean
}

export default class AddServiceImage extends React.PureComponent<IProps> {
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
      <Mutation mutation={mutation}>
        {updateService => {
          const handleSubmit = async (
            values: IFormValues,
            actions: FormikActions<IFormValues>,
          ) => {
            const image = values.image as File
            const { imagePath } = await postServiceImage({ id, image })
            await updateService({
              variables: { id, imagePath },
            })
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
                  <h2>Add image</h2>
                  <p>
                    Add an image for people to see when searching for a cleaner
                  </p>
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
