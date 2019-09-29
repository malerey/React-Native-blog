import React from 'react';
import { StyleSheet } from 'react-native';
import { Container } from "native-base";
import * as firebase from "firebase";
import PrivateContent from './components/PrivateContent';
import PublicContent from './components/PublicContent';
import config from './helpers/config';

firebase.initializeApp(config);

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      authenticatedUser: false,
      modalVisible: false, 
      blogEntry: ''
    };
  }

  signUp = (email, password) => {
    try {
      firebase.auth().createUserWithEmailAndPassword(email, password);
    } catch (error) {
      console.log(error.toString(error));
    }
  };

  signIn = (email, password) => {
    try {
      firebase.auth().signInWithEmailAndPassword(email, password);
      firebase.auth().onAuthStateChanged(() => {
        this.setState({ authenticatedUser: true })

      })
    } catch (error) {
      console.log(error.toString(error));
    }
  };

  signOut = () => {
    this.setState({ authenticatedUser: false })
  }

  setModalVisible = visible => {
    this.setState({ modalVisible: visible });
  }

  setBlogEntry = item => {
    this.setState({ blogEntry: item });
  }


  render() {
    return (
      <Container style={styles.container}>
        {this.state.authenticatedUser
          ?
          <PrivateContent
            styles={styles}
            entries={this.state.entries}
            modalVisible={this.state.modalVisible}
            setModalVisible={this.setModalVisible}
            blogEntry={this.state.blogEntry}
            setBlogEntry={this.setBlogEntry}
            signOut={this.signOut}
          />
          :
          <PublicContent
            styles={styles}
            modalVisible={this.state.modalVisible}
            setModalVisible={this.setModalVisible}
            blogEntry={this.state.blogEntry}
            setBlogEntry={this.setBlogEntry}
            signIn={this.signIn}
            signUp={this.signUp}
          />

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

