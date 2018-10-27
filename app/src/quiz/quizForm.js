import React, { Component } from 'react';
import { Button, Form } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const UPVOTE = gql`
  mutation UpvoteImage($_id: String!, $choice: String!, $vessels: Boolean!) {
    upvote(_id: $_id, choice: $choice, vessels: $vessels)
  }
`;

class QuizForm extends Component {
  constructor(props) {
    super(props);
    this.state = { vessels: false, value: null };
  }

  loadPrevAnswer() {
    const { image, marksheet } = this.props;
    if (marksheet.length) {
      const index = marksheet.findIndex(e => e.image === image._id);
      if (index > -1) {
        const { choice: value, vessels } = marksheet[index];
        this.setState({
          value,
          vessels,
        });
      }
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
    const { image } = this.props;

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
                });
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
              {data && <pre>{data.upvote}</pre>}
            </Form>
          );
        }}
      </Mutation>
    );
  }
}

export default QuizForm;
