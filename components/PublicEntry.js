import React from 'react';
import { Text, View, ScrollView, Image, TouchableHighlight, Modal } from 'react-native';
import Markdown from 'react-native-markdown-renderer';

export default PublicEntry = props => {
  const { styles, modalVisible, setModalVisible, blogEntry } = props
  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={modalVisible}
      onRequestClose={() => { setModalVisible(false); }}
    >
      <View style={styles.modal_cont}>
        <View style={styles.modal_header}>
          <TouchableHighlight
            style={styles.close_modal}
            onPress={() => { setModalVisible(false); }}
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
                <View style={styles.modal_body}>
                  <Markdown>{blogEntry.fields.body}</Markdown>
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