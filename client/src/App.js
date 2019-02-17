import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";

class App extends Component {
  state = {
    isAuthenticated: false,
    user: {},
    loading: false,
  }

  setCurrentUser = (decoded) => {
    this.setState({ isAuthenticated: decoded.name.length > 0, user: decoded });
  }

  removeCurrentUser = () => {
    this.setState({ isAuthenticated: false, user: {} });
  }

  render() {
    return (
      <Router>
        <div className="App">
          <Navbar />
          <Route exact path="/" render={(props) => <Landing removeCurrentUser={this.removeCurrentUser} isAuthenticated={this.state.isAuthenticated} user={this.state.user} {...props} /> } />
          <Route exact path="/register" component={Register} />
          <Route exact path="/login" render={(props) => <Login setCurrentUser={this.setCurrentUser} {...props} />} />
        </div>
      </Router>
    );
  }
}

export default App;