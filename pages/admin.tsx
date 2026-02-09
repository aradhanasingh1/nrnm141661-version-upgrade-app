import React from "react"
import withRole from "../components/withRole"

class Admin extends React.Component {
  render() {
    return <div>Admin Dashboard</div>
  }
}

export default withRole(Admin, ["ADMIN"])
