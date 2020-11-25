import React from "react"
import { useQuery, useMutation } from "@apollo/client"
import gql from "graphql-tag"
import "./style.css"

const BookMarksQuery = gql`
  {
    bookmark {
      id
      title
      url
      description
    }
  }
`
const addBookmarkMutation = gql`
  mutation addBookMark($title: String!, $url: String!, $description: String!) {
    addBookMark(title: $title, url: $url, description: $description) {
      title
    }
  }
`

export default function Home() {
  const { data } = useQuery(BookMarksQuery)
  const [addBookMark] = useMutation(addBookmarkMutation)
  let title, urlText, description
  const addBookmark = () => {
    console.log("adding bookmark")
    addBookMark({
      variables: {
        title: title.value,
        url: urlText.value,
        description: description.value,
      },
      refetchQueries: [{ query: BookMarksQuery }],
    })
  }

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
      <div className="inputs">
        <input
          type="text"
          placeholder="Title"
          ref={node => (title = node)}
        ></input>
        <input
          type="text"
          placeholder="URL"
          ref={node => (urlText = node)}
        ></input>
        <input
          type="text"
          placeholder="Description"
          ref={node => (description = node)}
        ></input>
      </div>
      <button onClick={addBookmark}>Add Bookmark</button>
    </div>
  )
}
