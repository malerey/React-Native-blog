import React from 'react';
import { Text, View, ScrollView } from 'react-native';
import { Button } from "native-base";
import BlogEntry from './BlogEntry';
import ModalView from './ModalView';
import formatData from '../helpers/formatData'

export default class PrivateContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      entries: [],
    };
  }

  componentDidMount() {
    const space_id = "ol6anbnvrzl6"
    const access_token = "bvsDVcVVS4_j5iBOEM4u0yOLH7VGvoZkZnuqWXqha7Y"
    const entries_link = `https://cdn.contentful.com/spaces/${space_id}/entries?access_token=${access_token}`
    fetch(entries_link, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
      .then(function (response) {
        return response.json();
      })
      .then(myJson => {
        const json = JSON.stringify(myJson)
        const data = JSON.parse(json)
        this.setData(data)
      });
  }

  setData = data => {
    const entries = formatData(data)
    this.setState({
      entries
    })
  }

  render() {

    const { styles, signOut } = this.props

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.header_title}>List of Entries</Text>
        </View>
        <ScrollView>
          {
            this.state.entries.map((item, i) =>
              <BlogEntry
                item={item}
                setModalVisible={this.props.setModalVisible}
                setBlogEntry={this.props.setBlogEntry}
                styles={styles}
              />
            )
          }

          <Button full rounded 
            style={{ margin: 20 }}
            onPress={signOut}
          >
            <Text>Log out</Text>
          </Button>
        </ScrollView>
        <ModalView
          styles={styles}
          blogEntry={this.props.blogEntry}
          modalVisible={this.props.modalVisible}
          setModalVisible={this.props.setModalVisible}
        />
      </View>
    )
  }
}