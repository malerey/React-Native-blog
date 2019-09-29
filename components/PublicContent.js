import React from 'react';
import { Text } from 'react-native';
import { Item, Form, Input, Button, Label } from "native-base";
import PublicEntry from './PublicEntry'
import publicContent from '../helpers/mock';

export default class PrivateContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: ""
    };
  }

  render() {
    const { styles, signIn, signUp } = this.props

    return (
      < Form style={styles.form} >
        <Item floatingLabel style={{ marginBottom: 20 }}>
          <Label>Email</Label>
          <Input
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={email => this.setState({ email })}
          />
        </Item>
        <Item floatingLabel style={{ marginBottom: 20 }}>
          <Label>Password</Label>
          <Input
            secureTextEntry={true}
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={password => this.setState({ password })}
          />
        </Item>
        <Button full rounded style={{ margin: 20 }}
          onPress={() => signIn(this.state.email, this.state.password)}
        >
          <Text>Sign In</Text>
        </Button>
        <Button full rounded success style={{ margin: 20 }}
          onPress={() => signUp(this.state.email, this.state.password)}>
          <Text>Sign Up</Text>
        </Button>
        <Button full rounded warning style={{ margin: 20 }}
          onPress={() => {
            this.props.setModalVisible(true)
            this.props.setBlogEntry(publicContent)
          }}
        >
          <Text>Access public content</Text>
        </Button>
        <PublicEntry
          styles={this.props.styles}
          modalVisible={this.props.modalVisible}
          setModalVisible={this.props.setModalVisible}
          blogEntry={this.props.blogEntry}
        />
      </Form >
    )
  }
}