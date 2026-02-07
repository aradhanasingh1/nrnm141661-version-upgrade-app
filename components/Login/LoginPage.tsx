import React from 'react'
import Router from 'next/router'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

interface State {
  email: string
  password: string
  error: string | null
  loading: boolean
}

class LoginPage extends React.Component<{}, State> {
  state: State = {
    email: '',
    password: '',
    error: null,
    loading: false
  }

  handleChange = (name: keyof State) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    this.setState({ [name]: event.target.value } as unknown as Pick<State, keyof State>)
  }

  render() {
    return <div>Login</div>
  }
}

export default LoginPage
