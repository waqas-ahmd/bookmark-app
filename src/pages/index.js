import React from "react"
import { useQuery, useMutation } from "@apollo/client"
import gql from "graphql-tag"
import { Formik, Form, ErrorMessage, Field } from "formik"
import * as Yup from "yup"
import TextField from "@material-ui/core/TextField"
import "./style.css"

const BookMarksQuery = gql`
  {
    bookmark {
      id
      title
      url
    }
  }
`
const addBookmarkMutation = gql`
  mutation addBookMark($title: String!, $url: String!) {
    addBookMark(title: $title, url: $url) {
      title
    }
  }
`

export default function Home() {
  const { data } = useQuery(BookMarksQuery)
  const [addBookMark] = useMutation(addBookmarkMutation)
  const initVals = {
    title: "",
    url: "",
  }
  const addBMs = values => {
    addBookMark({
      variables: {
        title: values.title,
        url: values.url,
      },
      refetchQueries: [{ query: BookMarksQuery }],
    })
  }
  const valSch = Yup.object({
    title: Yup.string().required("Required"),
    url: Yup.string().required("Required"),
  })

  return (
    <div>
      <div className="bm-links">
        {data &&
          data.bookmark.map(item => {
            return (
              <div className="bm-link" key={item.id}>
                <a href={item.url} target="_blank">
                  {item.title}
                </a>
              </div>
            )
          })}
      </div>

      <Formik
        initialValues={initVals}
        onSubmit={addBMs}
        validationSchema={valSch}
      >
        {formik => (
          <div className="inputs">
            <Form onSubmit={formik.handleSubmit}>
              <div>
                <Field
                  type="text"
                  as={TextField}
                  variant="outlined"
                  label="Title"
                  name="title"
                  id="title"
                />
                <ErrorMessage
                  name="title"
                  render={msg => <span style={{ color: "red" }}>{msg}</span>}
                />
              </div>
              <div>
                <Field
                  type="text"
                  as={TextField}
                  variant="outlined"
                  label="URL"
                  name="url"
                  id="url"
                />
                <ErrorMessage
                  name="url"
                  render={msg => <span style={{ color: "red" }}>{msg}</span>}
                />
              </div>
              <div>
                <button type="submit">Add Bookmark</button>
              </div>
            </Form>
          </div>
        )}
      </Formik>
    </div>
  )
}
