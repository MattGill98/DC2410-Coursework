import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from 'components/NavBar.jsx';
import Event from 'layouts/Event.jsx';
import Events from 'layouts/Events.jsx';
import NewEvent from 'layouts/NewEvent.jsx';
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Container } from 'reactstrap';
import eventReducer from 'reducers/eventReducer.js';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';

const store = createStore(eventReducer, applyMiddleware(thunk));

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
                            <Route path="/events" component={Events} />
                            <Route path="/" component={Events} />
                        </Switch>
                    </Router>
                </Container>
            </Provider>
        );
    }
}

export default App;
