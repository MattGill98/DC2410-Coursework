import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from 'components/NavBar.jsx';
import Event from 'layouts/Event.jsx';
import EventList from 'layouts/EventList.jsx';
import Login from 'layouts/Login.jsx';
import NewEvent from 'layouts/NewEvent.jsx';
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
                <Container fluid={true}>
                    <header>
                        <NavBar />
                    </header>
                    <Router>
                        <Switch>
                            <Route path="/event/:id" component={Event} />
                            <Route path="/events/new" component={NewEvent} />
                            <Route path="/events" component={EventList} />
                            <Route path="/login" component={Login} />
                            <Route path="/" component={EventList} />
                        </Switch>
                    </Router>
                </Container>
            </Provider>
        );
    }
}

export default App;
