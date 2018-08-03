import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from 'components/NavBar.jsx';
import Event from 'layouts/Event.jsx';
import EventList from 'layouts/EventList.jsx';
import Login from 'layouts/Login.jsx';
import NewEvent from 'layouts/NewEvent.jsx';
import Register from 'layouts/Register.jsx';
import Welcome from 'layouts/Welcome.jsx';
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Container } from 'reactstrap';
import eventListReducer from 'reducers/eventListReducer.js';
import eventReducer from 'reducers/eventReducer.js';
import userReducer from 'reducers/userReducer.js';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import thunk from 'redux-thunk';

const store = createStore(combineReducers({ EventList: eventListReducer, Event: eventReducer, User: userReducer }), applyMiddleware(thunk));

class App extends Component {

    render() {
        return (
            <Provider store={store}>
                <Router>
                    <div>
                        <header>
                            <NavBar />
                        </header>
                        <Container fluid={false}>
                            <Switch>
                                <Route exact path="/event/:id" component={Event} />
                                <Route exact path="/events/new" component={NewEvent} />
                                <Route exact path="/events" component={EventList} />
                                <Route exact path="/login" component={Login} />
                                <Route exact path="/register" component={Register} />
                                <Route exact path="/" component={Welcome} />
                            </Switch>
                        </Container>
                    </div>
                </Router>
            </Provider>
        );
    }
}

export default App;
