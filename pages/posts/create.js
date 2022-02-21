import {useState} from "react";
import {
  useQuery,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { request, gql } from "graphql-request";

// This will work
const CreateTodo = () => {
  const mutation = useMutation(formData => {
    return fetch('/api', formData)
  })
  const onSubmit = event => {
    event.preventDefault()
    mutation.mutate(new FormData(event.target))
  }

  return <form onSubmit={onSubmit}>...</form>
}


function App() {
  const mutation = useMutation(newTodo => {
    return axios.post('/todos', newTodo)
  })

  return (
    <div>
      {mutation.isLoading ? (
        'Adding todo...'
      ) : (
        <>
          {mutation.isError ? (
            <div>An error occurred: {mutation.error.message}</div>
          ) : null}

          {mutation.isSuccess ? <div>Todo added!</div> : null}

          <button
            onClick={() => {
              mutation.mutate({ id: new Date(), title: 'Do Laundry' })
            }}
          >
            Create Todo
          </button>
        </>

      )}
    </div>
  )
}


const [postTodo, { status: postStatus }] = useMutation(
  async (value) =>
    fetch('/api/todos', {
      method: 'POST',
      body: JSON.stringify(value)
    })
      .then((res) => res.json())
      .then(refetch),
  {
    onSuccess: () => {
      queryCache.refetchQueries('todos');
      // other cache invalidation queries and state updates
    }
  }
);


// https://tkdodo.eu/blog/mastering-mutations-in-react-query
// https://github.com/weibenfalk/react-query-graphql/blob/main/src/App.js
// https://www.swyx.io/react-query-miragejs-crud