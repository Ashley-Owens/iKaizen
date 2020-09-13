import React, { Component } from "react";
import withRouteProtection from "../auth/withRouteProtection";
import HabitList from "./HabitList";

class Dashboard extends Component {
  state = {
    habits: [
      {
        name: "This is habit 1",
        progress: 50,
        date: "10/24/1999",
        isBinary: false,
        isAsrchived: false,
        id: 1,
      },
      {
        name: "This is habit 2",
        progress: 75,
        date: "10/24/2000",
        isBinary: true,
        isAsrchived: false,
        id: 2,
      },
      {
        name: "This is habit 3",
        progress: 100,
        date: "10/24/2001",
        isBinary: false,
        isAsrchived: true,
        id: 3,
      },
    ],
  };

  render() {
    return (
      <div>
        <HabitList habits={this.state.habits} />
      </div>
    );
  }
}

export default withRouteProtection(Dashboard, { redirectTo: "/about" });
