import React from "react"
import { useQuery, useMutation } from "@apollo/client"
import gql from "graphql-tag"
import { Formik, Form, ErrorMessage, Field } from "formik"
import * as Yup from "yup"
import { TextField, Button } from "@material-ui/core"
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
  const { error, loading, data } = useQuery(BookMarksQuery)
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
        {error && "ERROR ..."}
        {loading && "LOADING ..."}
        {data &&
          data.bookmark.map(item => {
            return (
              <div className="bm-link" key={item.id}>
                <a href={item.url} target="_blank" rel="noreferrer">
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
          <Form onSubmit={formik.handleSubmit}>
            <div className="inputs-container">
              <div className="input-div">
                <Field
                  type="text"
                  as={TextField}
                  label="Title"
                  name="title"
                  id="standard-basic"
                />
                <ErrorMessage
                  name="title"
                  render={msg => <span className="errormsg">{msg}</span>}
                />
              </div>
              <div className="input-div">
                <Field
                  type="text"
                  as={TextField}
                  label="URL"
                  name="url"
                  id="standard-basic"
                />
                <ErrorMessage
                  name="url"
                  render={msg => <span className="errormsg">{msg}</span>}
                />
              </div>
              <div style={{ marginTop: "5px" }}>
                <Button type="submit" variant="contained" color="primary">
                  Add Bookmark
                </Button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}
