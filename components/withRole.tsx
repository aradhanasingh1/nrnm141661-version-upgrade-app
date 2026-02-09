import React from "react"
import Router from "next/router"

export default function withRole(Wrapped: any, roles: string[]) {
  return class extends React.Component<any, any> {
    state = { loading: true }

    async componentDidMount() {
      try {
        const res = await fetch("/api/profile")
        const data = await res.json()

        if (!res.ok) {
          Router.push("/")
          return
        }

        const role = data.user?.role
        if (!roles.includes(role)) {
          Router.push("/")
          return
        }

        this.setState({ loading: false })
      } catch (err) {
        Router.push("/")
      }
    }

    render() {
      if (this.state.loading) return <div>Loading...</div>
      return <Wrapped {...this.props} />
    }
  }
}
