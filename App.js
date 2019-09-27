import React from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableHighlight, Modal } from 'react-native';
import { Container, Item, Form, Input, Button, Label } from "native-base";
import Markdown from 'react-native-markdown-renderer';
import * as firebase from "firebase";
import config from './helpers/config';
import publicContent from './helpers/mock'

firebase.initializeApp(config);

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      authenticatedUser: false,
      modalVisible: false,
      entries: [],
      blogEntry: "",
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
      firebase.auth().onAuthStateChanged(() => {
        this.getInfo()
        this.setState({ authenticatedUser: true })

      })
    } catch (error) {
      console.log(error.toString(error));
    }
  };


  getInfo = () => {
    this.setState({ blogEntry: "" })
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
      entries
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
          ? 
          <View style={styles.container}>
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

              <Button full rounded style={{ margin: 20 }}
                onPress={() => this.setState({authenticatedUser: false})}
              >
                <Text>Log out</Text>
              </Button>
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
                        <View style={styles.modal_body}>
                          <Markdown >{this.state.blogEntry.fields.body}</Markdown>

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
          <Form style={styles.form}>
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
              onPress={() => this.SignIn(this.state.email, this.state.password)}
            >
              <Text>SignIn</Text>
            </Button>
            <Button full rounded success style={{ margin: 20 }}
              onPress={() => this.SignUp(this.state.email, this.state.password)}>
              <Text>Signup</Text>
            </Button>
            <Button full rounded warning style={{ margin: 20 }}
              onPress={() => {
                this.setModalVisible(true)
                this.setBlogEntry(publicContent)
              }}
            >
              <Text>Access public content</Text>
            </Button>
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
                      </>
                      :
                      <Text>Loading...</Text>
                    }
                  </View>
                </ScrollView>
              </View>
            </Modal>
          </Form>

        }
      </Container>


    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  form: {
    justifyContent: 'space-between',
  },
  header: {
    paddingTop: 80,
    paddingBottom: 10,
    backgroundColor: '#FFC125',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header_title: {
    fontWeight: 'bold',
  },
  title: {
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
    fontWeight: 'bold',
    fontSize: 15
  },
  item_author: {
    fontSize: 12
  },
  modal_cont: {
    paddingTop: 30,
    flex: 1,
  },
  modal_header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  close_modal: {
    width: 20,
    height: 20,
    margin: 10
  },
  modal_main: {
    flex: 1,
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
    marginLeft: 20,
    marginRight: 20
  },
  modal_subtitle: {
    fontSize: 20,
    marginLeft: 20,
    marginRight: 20
  },
  modal_author: {
    fontSize: 9,
    letterSpacing: 1
  },
  modal_body: {
    padding: 20,
    paddingTop: 0,
  }
});

