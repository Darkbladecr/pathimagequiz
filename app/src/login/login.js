import React, { Component } from 'react';
import {
  Button,
  Form,
  Grid,
  Header,
  Message,
  Segment,
} from 'semantic-ui-react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { authControl } from '../auth';
import { Redirect } from 'react-router-dom';
import ScreenLoader from '../loader';
// import withRouter from 'react-router-dom/withRouter';

const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password)
  }
`;

// const SuccessfulSignIn = withRouter(({ history, data }) => {
//   authControl.signin(data.login).then(message => {
//     console.log(message);
//     history.push('/quiz');
//   });
// });

class LoginForm extends Component {
  state = { username: '', password: '', loggedIn: false, loading: true };
  handleChange = (e, { name, value }) => this.setState({ [name]: value });

  componentDidMount() {
    authControl.checkToken().then(loggedIn => {
      this.setState({ loggedIn, loading: false });
    });
  }

  render() {
    const { username, password, loggedIn, loading } = this.state;
    if (loggedIn) {
      return (
        <Redirect
          to={{
            pathname: '/quiz',
          }}
        />
      );
    }
    return (
      <Mutation mutation={LOGIN}>
        {(login, { error, data }) => {
          if (loading) {
            return <ScreenLoader />;
          }
          return (
            <div className="login-form">
              <style>{`
          body > div,
          body > div > div,
          body > div > div > div.login-form {
            height: 100%;
          }
        `}</style>
              <Grid
                textAlign="center"
                style={{ height: '100%' }}
                verticalAlign="middle"
              >
                <Grid.Column style={{ maxWidth: 450 }}>
                  <Header as="h2" color="blue" textAlign="center">
                    Log-in to your account
                  </Header>
                  <Form
                    size="large"
                    error={!!error}
                    onSubmit={e => {
                      e.preventDefault();
                      login({
                        variables: {
                          username,
                          password,
                        },
                      });
                    }}
                  >
                    <Segment stacked>
                      <Form.Input
                        fluid
                        icon="user"
                        iconPosition="left"
                        placeholder="E-mail address"
                        name="username"
                        value={username}
                        onChange={this.handleChange}
                      />
                      <Form.Input
                        fluid
                        icon="lock"
                        iconPosition="left"
                        placeholder="Password"
                        type="password"
                        name="password"
                        value={password}
                        onChange={this.handleChange}
                      />

                      <Button type="submit" color="blue" fluid size="large">
                        Login
                      </Button>
                    </Segment>
                    {error &&
                      error.graphQLErrors.map(({ message }, i) => (
                        <Message
                          error
                          header="Error"
                          key={i}
                          content={message}
                        />
                      ))}
                    {/* {data && <SuccessfulSignIn data={data} />} */}
                    {data &&
                      authControl.signin(data.login) && (
                        <Redirect
                          to={{
                            pathname: '/quiz',
                          }}
                        />
                      )}
                  </Form>
                </Grid.Column>
              </Grid>
            </div>
          );
        }}
      </Mutation>
    );
  }
}

export default LoginForm;
