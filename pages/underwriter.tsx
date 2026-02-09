import React from "react"
import withRole from "../components/withRole"

class Underwriter extends React.Component {
  render() {
    return <div>Underwriter Dashboard</div>
  }
}

export default withRole(Underwriter, ["UNDERWRITER"])
