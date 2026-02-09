import React from "react"
import withRole from "../components/withRole"

class Applications extends React.Component {
  render() {
    return <div>Applications Page</div>
  }
}

export default withRole(Applications, ["USER", "UNDERWRITER", "ADMIN"])
