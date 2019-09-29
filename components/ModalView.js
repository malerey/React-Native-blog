import React from 'react';
import { Text, View, ScrollView, Image, TouchableHighlight, Modal } from 'react-native';
import Markdown from 'react-native-markdown-renderer';


export default ModalView = props => {
  const { styles, blogEntry } = props
  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={props.modalVisible}
      onRequestClose={() => { props.setModalVisible(false); }}
    >
      <View style={styles.modal_cont}>
        <View style={styles.modal_header}>
          <TouchableHighlight
            style={styles.close_modal}
            onPress={() => { props.setModalVisible(false); }}
          >
            <Image
              style={styles.close_modal}
              source={require('../helpers/back.png')}
            />
          </TouchableHighlight>
        </View>
        <ScrollView>
          <View style={styles.modal_main}>
            {blogEntry && blogEntry.fields
              ?
              <>
                <Image
                  style={styles.modal_img}
                  source={{ uri: `https:${blogEntry.fields.heroImage.link.file.url}` }}
                  alt={blogEntry.fields.heroImage.link.description}
                />
                <View styles={styles.modal_title_cont}>
                  <Text style={styles.modal_title}>{blogEntry.fields.title}</Text>
                  <Text style={styles.modal_subtitle}>{blogEntry.fields.description}</Text>
                </View>
                <View style={styles.list_item}>
                  <View style={styles.item_description}>
                    <Text style={styles.item_name}>{blogEntry.author.fields.name}</Text>
                    <Text style={styles.item_author}>{blogEntry.author.fields.title}</Text>
                  </View>
                </View>
                <View style={styles.modal_body}>
                  <Markdown >{blogEntry.fields.body}</Markdown>

                </View>
              </>
              :
              <Text>Loading...</Text>
            }
          </View>
        </ScrollView>
      </View>
    </Modal>
  )
}