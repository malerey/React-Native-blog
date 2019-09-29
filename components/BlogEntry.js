import React from 'react';
import {Text, View, Image, TouchableHighlight } from 'react-native';

export default BlogEntry = props => {
  const { styles, item } = props
  return (
    <TouchableHighlight
      onPress={() => {props.setBlogEntry(props.item); props.setModalVisible(true)}}
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