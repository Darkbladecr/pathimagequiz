import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'semantic-ui-css/semantic.min.css';
import LoginForm from './login/login';
import Quiz from './quiz/quiz';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';
import { authControl } from './auth';

import { ApolloProvider } from 'react-apollo';
import ApolloClient from 'apollo-boost';

const client = new ApolloClient({
  uri: 'http://localhost:4000',
});

function PrivateRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        authControl.isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/',
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
}

ReactDOM.render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <Route path="/" exact component={LoginForm} />
      <PrivateRoute path="/quiz" component={Quiz} />
    </ApolloProvider>
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
