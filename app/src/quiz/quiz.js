import React, { Component } from 'react';
import {
  Divider,
  Dimmer,
  Loader,
  Button,
  Form,
  Grid,
  Image,
} from 'semantic-ui-react';
import gql from 'graphql-tag';
import { graphql, Query } from 'react-apollo';
import image from './image.png';

class QuizForm extends Component {
  state = { vessels: false, value: null };

  handleChange = (e, { value }) => this.setState({ value });
  toggle = () => this.setState({ vessels: !this.state.vessels });

  render() {
    const { value, vessels } = this.state;

    return (
      <Query query={ITEMS_QUERY}>
        {({ loading, error, data }) => {
          if (loading)
            return (
              <Dimmer active inverted>
                <Loader size="massive" content="Loading" inverted />
              </Dimmer>
            );
          if (error) return `Error! ${error.message}`;

          return (
            <div className="quizForm">
              <Grid centered columns={2}>
                <Grid.Column>
                  <Image src={image} />
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
                  <Form>
                    <Form.Field>
                      Selected value: <b>{this.state.value}</b>
                    </Form.Field>
                    <Form.Field>
                      <pre>{JSON.stringify(data, null, 2)}</pre>
                    </Form.Field>
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
                </Grid.Column>
              </Grid>
            </div>
          );
        }}
      </Query>
    );
  }
}

const ITEMS_QUERY = gql`
  query ItemsQuery {
    items {
      name
    }
  }
`;

export default graphql(ITEMS_QUERY)(QuizForm);