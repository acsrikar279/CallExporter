//Example to get Call log in Android using React native app
import React, {Component} from 'react';
//Import React
import {
  Button,
  Platform,
  StyleSheet,
  Text,
  View,
  PermissionsAndroid,
  FlatList,
  Dimensions,
  ToastAndroid
} from 'react-native';
//Import all the basic component from React Native Library
import CallLogs from 'react-native-call-log';
import Share from 'react-native-share';
//Import library to access call log
const { Parser } = require('json2csv');
const fields = ['dateTime', 'duration', 'name', 'phoneNumber', 'rawType', 'timestamp','type'];
const opts = { fields };
const RNFS = require('react-native-fs');


export default class App extends Component {
  constructor(props) {
    super(props);
    //Make default blank array to store details
    this.state = {
      FlatListItems: [],
    };
  }
  componentDidMount = async () => {
    if (Platform.OS != 'ios') {
      try {
        const granted1 = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Call Log Write Example',
            message: 'Save your call logs',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        //Ask for runtime permission
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
          {
            title: 'Call Log Example',
            message: 'Access your call logs',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          CallLogs.loadAll().then(c => this.setState({FlatListItems: c}));
          CallLogs.load(3).then(c => console.log(c));
        } else {
          alert('Call Log permission denied');
        }
      } catch (e) {
        alert(e);
      }
    } else {
      alert(
        'Sorry! You can’t get call logs in iOS devices because of the security concern',
      );
    }
  };

  FlatListItemSeparator = () => {
    return (
      //Item Separator
      <View style={{height: 0.5, width: '100%', backgroundColor: '#C8C8C8'}} />
    );
  };

  shareSingleFile = async () => {
    let currrentDate = new Date();
    var date = currrentDate.getDate() ;
    var month = currrentDate.getMonth() + 1;
    var year = currrentDate.getFullYear();

    date = (date<10)?'0' + date : date;
    month = (month < 10) ? '0' + month : month;
    let fileName = 'export_' + year + month + date + '.csv';
    let filePath = 'file:///storage/emulated/0/Download/' + fileName;
    const shareOptions = {
      title: 'Share file',
      url: filePath,
      failOnCancel: false,
    };

    try {
      await CallLogs.loadAll().then( c => {
        const data = c;
        try {
          const parser = new Parser(opts);
          const csv = parser.parse(data);
          console.log(csv);
          var path = filePath;
          console.log(path);
          RNFS.writeFile(path, csv, 'utf8').then((success) => {console.log('FILE WRITTEN!');}).catch((err) => {console.log(err.message);});
          ToastAndroid.showWithGravity(
            'File written to ' + path,
            ToastAndroid.SHORT,
            ToastAndroid.CENTER,
          );
        } catch (err) {
          console.error(err);
        }
      });
      const ShareResponse = await Share.open(shareOptions);
      console.log(JSON.stringify(ShareResponse));
    } catch (error) {
      console.log('Error =>', error);
    }
  };

  uploadAndFetchResult = async() =>{
    ToastAndroid.showWithGravity('Method under construction.', ToastAndroid.SHORT, ToastAndroid.CENTER);
  };

  render() {
    return (
      <View style={styles.MainContainer}>
        <Button onPress={this.shareSingleFile} title="Share CSV" />
        <View style={styles.emptySpace}></View>
        <Button onPress={this.uploadAndFetchResult} title="Upload and Get Result" />
        <FlatList
          data={this.state.FlatListItems}
          ItemSeparatorComponent={this.FlatListItemSeparator}
          renderItem={({item}) => (
            // Single Comes here which will be repeatative for the FlatListItems
            <View>
              <Text style={styles.item}>
                Name : {item.name ? item.name : 'NA'}
                {'\n'}
                DateTime : {item.dateTime}
                {'\n'}
                Duration : {item.duration}
                {'\n'}
                PhoneNumber : {item.phoneNumber}
                {'\n'}
                RawType : {item.rawType}
                {'\n'}
                Timestamp : {item.timestamp}
                {'\n'}
                Type : {item.type}
              </Text>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  MainContainer: {
    justifyContent: 'center',
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    marginTop: 30,
  },

  item: {
    padding: 10,
    fontSize: 18,
  },

  emptySpace: {
    height: 10,
    width: 20
  }
});
