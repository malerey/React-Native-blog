import React from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableHighlight, Modal } from 'react-native';
import { Container, Item, Form, Input, Button, Label } from "native-base";
import * as firebase from "firebase";
import config from './helpers/config'

firebase.initializeApp(config);

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      authenticatedUser: false,
      isLoading: false,
      modalVisible: false,
    };
  }

  
  SignUp = (email, password) => {
    try {
      firebase.auth().createUserWithEmailAndPassword(email, password);
    } catch (error) {
      console.log(error.toString(error));
    }
  };

  SignIn = (email, password) => {
    try {
      firebase.auth().signInWithEmailAndPassword(email, password);
      firebase.auth().onAuthStateChanged(user => {

        this.getInfo()
      })
    } catch (error) {
      console.log(error.toString(error));
    }
  };


  getInfo = () => {
    this.setState({ isLoading: true })
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
        this.formatData(data)
      });


  }

  formatData = data => {
    const entries = data.items.filter((e, i) => {
      return e.sys.contentType.sys.id === 'blogPost'
    })
    const authors = data.items.filter((e, i) => {
      return e.sys.contentType.sys.id === 'person'
    })
    data.includes.Asset.map((asset, i) => {
      entries.map((entry, j) => {
        if (asset.sys.id === entry.fields.heroImage.sys.id) entry.fields.heroImage.link = asset.fields
      })
      authors.map((author, k) => {
        if (asset.sys.id === author.fields.image.sys.id) author.fields.image.sys.link = asset.fields
      })
    })
    entries.map((entry, i) => {
      authors.map(author => {
        if (entry.fields.author.sys.id === author.sys.id) entries[i].author = author
      })
    })
    this.setState({
      entries: entries,
      isLoading: false,
      authenticatedUser: true
    })
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  setBlogEntry(item) {
    this.setState({ blogEntry: item });
  }


  render() {
    return (
      <Container style={styles.container}>
        {this.state.authenticatedUser
          ? <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.header_title}>List of Entries</Text>
            </View>
            <ScrollView>
              {
                this.state.entries.map((item, i) =>
                  <TouchableHighlight
                    onPress={() => {
                      this.setModalVisible(true)
                      this.setBlogEntry(item)
                    }}
                  >
                    <View style={styles.list_item}>
                      <Image
                        style={styles.profile_pic}
                        source={{ uri: `https:${item.fields.heroImage.link.file.url}` }}
                        alt={item.fields.heroImage.link.description}
                      />
                      <View style={styles.item_description}>
                        <Text style={styles.item_name}>{item.fields.title}</Text>
                        <Text style={styles.item_author}>Author: {item.author.fields.name}</Text>
                      </View>
                    </View>
                  </TouchableHighlight>
                )
              }
            </ScrollView>
            <Modal
              animationType="slide"
              transparent={false}
              visible={this.state.modalVisible}
              onRequestClose={() => { this.setModalVisible(false); }}
            >
              <View style={styles.modal_cont}>
                <View style={styles.modal_header}>
                  <TouchableHighlight
                    style={styles.close_modal}
                    onPress={() => { this.setModalVisible(false); }}
                  >
                    <Image
                      style={styles.close_modal}
                      source={require('./helpers/back.png')}
                    />
                  </TouchableHighlight>
                </View>
                <ScrollView>
                  <View style={styles.modal_main}>
                    {this.state.blogEntry && this.state.blogEntry.fields
                      ?
                      <>
                        <Image
                          style={styles.modal_img}
                          source={{ uri: `https:${this.state.blogEntry.fields.heroImage.link.file.url}` }}
                          alt={this.state.blogEntry.fields.heroImage.link.description}
                        />
                        <View styles={styles.modal_title_cont}>
                          <Text style={styles.modal_title}>{this.state.blogEntry.fields.title}</Text>
                          <Text style={styles.modal_subtitle}>{this.state.blogEntry.fields.description}</Text>
                        </View>
                        <View style={styles.list_item}>
                          <Image
                            style={styles.profile_pic}
                            source={{ uri: `https:${this.state.blogEntry.author.fields.image.sys.link.file.url}` }}
                            alt={this.state.blogEntry.author.fields.image.sys.link.description}
                          />
                          <View style={styles.item_description}>
                            <Text style={styles.item_name}>{this.state.blogEntry.author.fields.name}</Text>
                            <Text style={styles.item_author}>{this.state.blogEntry.author.fields.title}</Text>
                          </View>
                        </View>
                        <View>
                            <Text style={styles.modal_body}>{this.state.blogEntry.fields.body}</Text>
                            
                          </View>
                      </>
                      :
                      <Text>Loading...</Text>
                    }
                  </View>
                </ScrollView>
              </View>
            </Modal>
          </View>
          :
          <Form style={{ backgroundColor: "#fff" }}>
            <Item floatingLabel>
              <Label>Email</Label>
              <Input
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={email => this.setState({ email })}
              />
            </Item>
            <Item floatingLabel>
              <Label>Password</Label>
              <Input
                secureTextEntry={true}
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={password => this.setState({ password })}
              />
            </Item>
            <Button full rounded
              onPress={() => this.SignIn(this.state.email, this.state.password)}
            >
              <Text>SignIn</Text>
            </Button>
            <Button full rounded success style={{ marginTop: 20 }}
              onPress={() => this.SignUp(this.state.email, this.state.password)}>
              <Text>Signup</Text>
            </Button>
          </Form>
        }
      </Container>


    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#05101a',
  },
  header: {
    paddingTop: 80,
    paddingBottom: 10,
    backgroundColor: '#535353',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header_title: {
    fontWeight: 'bold',
    color: '#fff'
  },
  title: {
    color: '#fff',
    fontSize: 15,
  },
  list_item: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center'
  },
  profile_pic: {
    height: 50,
    width: 50,
    borderRadius: 50,
    marginLeft: 20,
  },
  item_description: {
    marginLeft: 10
  },
  item_name: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15
  },
  item_author: {
    color: '#b3b3b3',
    fontSize: 12
  },
  modal_cont: {
    paddingTop: 30,
    flex: 1,
    backgroundColor: '#05101a',
  },
  modal_header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20
  },
  close_modal: {
    width: 20,
    height: 20,
    marginLeft: 10,
    marginRight: 10
  },
  modal_main: {
    flex: 1,
    backgroundColor: '#05101a',
  },
  modal_img: {
    marginTop: 20,
    marginBottom: 10,
    height: 200,
    width: '100%',
    flex: 1,
    alignSelf: 'center'
  },
  modal_title_cont: {
    flex: 1,
  },
  modal_title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 20,
    marginRight: 20
  },
  modal_subtitle: {
    fontSize: 20,
    color: '#fff',
    marginLeft: 20,
    marginRight: 20
  },
  modal_body: {
    fontSize: 16,
    color: '#fff',
    margin: 20,
  },
  modal_author: {
    color: '#b3b3b3',
    fontSize: 9,
    letterSpacing: 1
  }
});

