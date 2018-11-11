import React, { Component } from 'react';
import { Menu, Icon, Divider, Button, Grid, Image } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import { authControl } from '../auth';
import { withRouter } from 'react-router-dom';
import ScreenLoader from '../loader';
import QuizForm from './quizForm';

const IMAGES_QUERY = gql`
  query QuizQuery($_id: String!) {
    images {
      _id
      url
    }
    user(_id: $_id) {
      marksheet {
        image
        choice
        vessels
      }
    }
  }
`;

const SignOutButton = withRouter(({ history }) => (
  <Button
    icon
    labelPosition="right"
    onClick={() => {
      authControl.signout();
      history.push('/');
    }}
  >
    Sign Out
    <Icon name="log out" />
  </Button>
));

class Quiz extends Component {
  state = { qNum: 0 };

  changeQuestion(num) {
    this.setState({ qNum: this.state.qNum + num });
  }

  render() {
    const { qNum } = this.state;
    const { _id, username } = authControl.decoded;

    return (
      <Query query={IMAGES_QUERY} variables={{ _id }}>
        {({ loading, error, data }) => {
          if (loading) return <ScreenLoader />;
          if (error) return `${error.message}`;
          const { marksheet } = data.user;
          const { images } = data;
          const totalQuestions = images.length;

          return (
            <div className="quizForm">
              <Menu fixed="top">
                <Menu.Item>
                  <h3>
                    <Icon name="user md" /> {username}
                  </h3>
                </Menu.Item>
                <Menu.Item>
                  <Button
                    labelPosition="left"
                    icon="left chevron"
                    content="Previous"
                    disabled={qNum === 0}
                    onClick={() => this.changeQuestion(-1)}
                  />
                </Menu.Item>
                <Menu.Item header>
                  Qustion {qNum + 1} of {totalQuestions}
                </Menu.Item>
                <Menu.Item>
                  <Button
                    labelPosition="right"
                    icon="right chevron"
                    content="Next"
                    disabled={qNum === totalQuestions - 1}
                    onClick={() => this.changeQuestion(1)}
                  />
                </Menu.Item>
                {qNum !== marksheet.length && (
                  <Menu.Item>
                    <Button
                      labelPosition={qNum < marksheet.length ? 'right' : 'left'}
                      icon={
                        qNum < marksheet.length
                          ? 'angle double right'
                          : 'angle double left'
                      }
                      content="Continue"
                      onClick={() =>
                        this.changeQuestion(marksheet.length - qNum)
                      }
                    />
                  </Menu.Item>
                )}
                <Menu.Menu position="right">
                  <Menu.Item>
                    <SignOutButton />
                  </Menu.Item>
                </Menu.Menu>
              </Menu>
              <Grid centered columns={2}>
                <Grid.Column>
                  <Image centered src={`images/${images[qNum].url}`} />
                  <Divider hidden />
                </Grid.Column>
              </Grid>
              <Grid centered columns={2}>
                <Grid.Column>
                  <p>
                    Using the JES IPCL <b>AB</b> classification, please predict
                    the lesion histology based on the observed patterns of IPCLs
                    seen in this image:
                  </p>
                  <QuizForm
                    qNum={qNum}
                    image={images[qNum]}
                    marksheet={marksheet}
                    changeQuestion={num => this.changeQuestion(num)}
                  />
                </Grid.Column>
              </Grid>
              <ToastContainer
                autoClose={3000}
                transition={Slide}
                hideProgressBar
                pauseOnHover={false}
              />
            </div>
          );
        }}
      </Query>
    );
  }
}

export default Quiz;
