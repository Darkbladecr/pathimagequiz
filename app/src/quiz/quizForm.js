import React, { Component } from 'react';
import { Button, Form } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { toast } from 'react-toastify';
import { authControl } from '../auth';
import { IMAGES_QUERY } from './quizQuery';

const UPVOTE = gql`
  mutation UpvoteImage($_id: String!, $choice: String!, $vessels: Boolean!) {
    upvote(_id: $_id, choice: $choice, vessels: $vessels) {
      image
      choice
      vessels
    }
  }
`;

const updateCacheUpvote = (cache, { data: { upvote } }) => {
  console.log(upvote);
  const { _id } = authControl.decoded;
  const { user, images } = cache.readQuery({
    query: IMAGES_QUERY,
    variables: { _id },
  });
  const found = user.marksheet.findIndex(e => e.image === upvote.image);
  if (found > -1) {
    user.marksheet[found] = upvote;
  } else {
    user.marksheet = [...user.marksheet, upvote];
  }
  cache.writeQuery({
    query: IMAGES_QUERY,
    data: {
      user,
      images,
    },
    variables: { _id },
  });
};

class QuizForm extends Component {
  state = { vessels: false, value: null };

  loadPrevAnswer() {
    const { image, marksheet } = this.props;
    if (marksheet.length > 0) {
      const index = marksheet.findIndex(e => e.image === image._id);
      if (index > -1) {
        const { choice: value, vessels } = marksheet[index];
        this.setState({
          value,
          vessels,
        });
      } else {
        this.setState({ vessels: false, value: null });
      }
    } else {
      this.setState({ vessels: false, value: null });
    }
  }

  componentDidMount() {
    this.loadPrevAnswer();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.qNum !== this.props.qNum) {
      this.loadPrevAnswer();
    }
  }

  handleChange = (e, { value }) => this.setState({ value });
  toggle = () => this.setState({ vessels: !this.state.vessels });

  render() {
    const { value, vessels } = this.state;
    const { image, changeQuestion } = this.props;

    return (
      <Mutation mutation={UPVOTE}>
        {(upvote, { error, data }) => {
          return (
            <Form
              onSubmit={e => {
                e.preventDefault();
                upvote({
                  variables: {
                    _id: image._id,
                    choice: value,
                    vessels,
                  },
                  optimisticResponse: {
                    upvote: {
                      image: image._id,
                      choice: value,
                      vessels,
                      __typename: 'Marksheet',
                    },
                  },
                  update: updateCacheUpvote,
                });
                toast('Answer saved.');
                changeQuestion(1);
              }}
            >
              <Form.Radio
                label="Normal/Low grade IN (A)"
                value="a"
                checked={value === 'a'}
                onChange={this.handleChange}
              />
              <Form.Radio
                label="High grade IN/lamina propria (B1)"
                value="b1"
                checked={value === 'b1'}
                onChange={this.handleChange}
              />
              <Form.Radio
                label="Muscularis mucosa/Submucosa 1 (B2)"
                value="b2"
                checked={value === 'b2'}
                onChange={this.handleChange}
              />
              <Form.Radio
                label="Submucosa 2 or deeper (B3)"
                value="b3"
                checked={value === 'b3'}
                onChange={this.handleChange}
              />
              <Form.Checkbox
                label="Were deep submucosal vessels visible in this image?"
                checked={vessels}
                onChange={this.toggle}
              />
              <Button type="submit" disabled={!value}>
                Submit
              </Button>
            </Form>
          );
        }}
      </Mutation>
    );
  }
}

export default QuizForm;
