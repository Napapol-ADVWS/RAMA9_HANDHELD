import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Alert,
  Picker,
  Modal,
} from 'react-native';
import { Image, Input, Card, Button } from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';

export default class App extends Component {

  constructor(props) {
    super(props);
    this.barcodeTextInput = null;
    this.state = {
      text: "",
      barcodeText: "",
      count: 5,
      codeList: [
      ],
      check: "check-in",
      event: "ไม่ระบุ",
      settingVisible: false,
      serverUrl: "http://192.168.0.197",
    }
    this.loadSetting();
  }

  loadSetting = async () => {
    try {
      var serverUrl = await AsyncStorage.getItem('serverUrl');
      if (serverUrl != null) {
        this.state.serverUrl = serverUrl;
      } else {
        this.state.serverUrl = "http://192.168.0.197";
      }
    } catch (error) {
      this.state.serverUrl = "http://192.168.0.197";
      console.error(error);
    }

  }

  onInputKeyPress = (e) => {

  }

  onSubmitEditing = (e) => {
    console.debug(e.nativeEvent);

    var qrcode = e.nativeEvent.text;

    this.setState({ barcodeText: "" });
    this.barcodeTextInput.focus();
    //console.debug(this.barcodeTextInput);
    fetch(this.state.serverUrl + '/ticketingservice/rest/services/getQrSummary', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        qrcode: qrcode,
      }),
    })
      .then((response) => {
        //return response.text();
        return response.json()
      })
      .then((data) => {
        console.log("Got data")
        console.log(data);
        //console.log(JSON.parse('{"status":"ok","result": [{}]}'));
        //console.log(JSON.parse(data));
        if (data.result.length > 0) {
          console.log("Result more than 0");
          this.setState({ text: data.result[0].bookingdate });
          var codeList = this.state.codeList;
          codeList.push({ code: qrcode, ticket: data.result[0].qrcode_count, bookingdate: data.result[0].bookingdate });
          this.setState({ codeList: codeList });
        } else {
          Alert.alert("ERROR", "NOT FOUND");
        }

        //Alert.alert("OK", data.status);
      })
      .catch((err) => {
        Alert.alert("ERROR");
        console.error(err);
      });

  }
  _onPressButton = () => {
    var codeList = this.state.codeList;
    fetch(this.state.serverUrl + '/ticketingservice/rest/services/submitQrCheck', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pos: "0001",
        type: this.state.check,
        ticketList: codeList,
      }),
    })
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        console.log(data);
        if (data.status == 'ok') {
          this.setState({ codeList: [] });
          Alert.alert("Success");
        }
      })
      .catch((err) => {
        Alert.alert("ERROR");
        console.error(err);
      });

    //alert('You tapped the button!')
  }
  _onPressCheckIn = () => {
    this.setState({ check: "check-in" })
    console.log(this.state.check)
  }
  _onPressCheckOut = () => {
    this.setState({ check: "check-out" })
    console.log(this.state.check)
  }
  _onPressCheckInGroup = () => {
    this.setState({ check: "check-in-group" })
    console.log(this.state.check)
  }
  _onPressCheckOutGroup = () => {
    this.setState({ check: "check-out-group" })
    console.log(this.state.check)
  }

  onCloseSetting = async () => {
    await AsyncStorage.setItem('serverUrl', this.state.serverUrl);
    this.setState({ settingVisible: false });
  }

  render() {

    return (
      <SafeAreaView>
        <ScrollView>
          {/*<ImageBackground source={require('./app/image/bg4.jpg')}
            style={styles.container}>*/}
          <View style={styles.container2}>
            <Image
              source={require('./app/image/logo1.png')}
              style={{ width: 300, height: 85 }}
            />
          </View>
          <Card>
            <View>
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <View style={{ width: 240, height: 50 }}>
                  <View style={{ borderColor: 'gray', borderWidth: 1, height: 50, marginBottom: 10 }}>
                    <Picker
                      selectedValue={this.state.event}
                      style={{ height: 50, width: 200, borderWidth: 1 }}
                      onValueChange={(itemValue, itemIndex) =>
                        this.setState({ event: itemValue })
                      }>
                      <Picker.Item label="ค่าเข้าชม" value="ค่าเข้าชม" />
                      <Picker.Item label="Dome Big Bang" value="Dome Big Bang" />
                      <Picker.Item label="4 D ชีวิตบนพื้นทราย" value="4 D ชีวิตบนพื้นทราย" />
                      <Picker.Item label="Enjoy Maker Space" value="Enjoy Maker Space" />
                      <Picker.Item label="Science Lab" value="Science Lab" />
                      <Picker.Item label="Science Show" value="Science Show" />
                      <Picker.Item label="Walk Rally" value="Walk Rally" />
                      <Picker.Item label="Trail" value="Trail" />
                    </Picker>
                  </View>
                </View>
                <Button
                  icon={{ name: 'settings', type: 'material-community', color: '#FFF', size: 32 }}
                  onPress={() => { this.setState({ settingVisible: !this.state.settingVisible }); }}
                />
              </View>
              <Modal visible={this.state.settingVisible}>
                <View>
                  <Card title="Settings">
                    <Text>Server URL</Text>
                    <Input
                      value={this.state.serverUrl}
                      onChangeText={(txt) => this.setState({ serverUrl: txt })}                      
                    />
                    <Button title="Close" onPress={this.onCloseSetting}></Button>
                  </Card>
                </View>
              </Modal>
              <View style={styles.alternativeLayoutButtonContainer}>
                <Button
                  icon={{ name: 'account-check', type: 'material-community', color: '#FFF', size: 80 }}
                  onPress={this._onPressCheckIn}
                  containerStyle={this.state.check == 'check-in' ? styles.buttonCheckTypeContainerActive : styles.buttonCheckTypeContainerInactive}
                  buttonStyle={styles.buttonCheckType}
                />
                <Button
                  icon={{ name: 'account-multiple-check', type: 'material-community', color: '#FFF', size: 75 }}
                  onPress={this._onPressCheckInGroup}
                  containerStyle={this.state.check == 'check-in-group' ? styles.buttonCheckTypeContainerActive : styles.buttonCheckTypeContainerInactive}
                  buttonStyle={styles.buttonCheckType}
                />
              </View>
              <View style={styles.alternativeLayoutButtonContainer}>
                <Button
                  icon={{ name: 'account-minus', type: 'material-community', color: '#FFF', size: 75 }}
                  onPress={this._onPressCheckOut}
                  containerStyle={this.state.check == 'check-out' ? styles.buttonCheckTypeContainerActive : styles.buttonCheckTypeContainerInactive}
                  buttonStyle={styles.buttonCheckType}
                />
                {/*onPress={()=>{Alert.alert("ok","check-out"); this.setStatus({check: "check-out"})}}*/}
                <Button
                  icon={{ name: 'account-multiple-minus', type: 'material-community', color: '#FFF', size: 75 }}
                  onPress={this._onPressCheckOutGroup}
                  containerStyle={this.state.check == 'check-out-group' ? styles.buttonCheckTypeContainerActive : styles.buttonCheckTypeContainerInactive}
                  buttonStyle={styles.buttonCheckType}
                />
              </View>
              <View style={styles.container2}>
                <Text style={{ fontSize: 15 }}>STATUS : <Text style={{ color: 'red' }}>{this.state.check}</Text> Ticket: <Text style={{ color: 'red' }}>{this.state.codeList.length}</Text></Text>
              </View>
              <View style={styles.inputContainer}>
                {/*<TextInput underlineColorAndroid="transparent" style={styles.input}*/}
                <Input
                  placeholder='Barcode Number...'
                  value={this.state.barcodeText}
                  ref={(input) => { this.barcodeTextInput = input; }}
                  onChangeText={(txt) => this.state.barcodeText = txt}
                  onKeyPress={this.onInputKeyPress}
                  onSubmitEditing={this.onSubmitEditing}
                  autoFocus={true}
                  blurOnSubmit={false}
                />
              </View>
              <View>
                <Button
                  containerStyle={{ backgroundColor: '#389FC1' }}
                  onPress={this._onPressButton}
                  buttonStyle={{ width: 300, height: 60, backgroundColor: '#00000000' }}
                  title="Submit"
                  color="#FFF"
                />
              </View>
              {
                this.state.codeList.map((item, index) => (
                  <Card>
                    <View>
                      <Text>{item.code}{'\n'}</Text>
                      <Text>{item.bookingdate}{'\n'}</Text>
                      <Text>{this.state.event}{'\n'}</Text>
                      <Text>ทั้งหมดจำนวน <Text style={{ color: 'green' }}>{item.ticket}</Text> ใบ</Text>
                    </View>
                  </Card>
                ))
              }

            </View>
          </Card>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  buttonCheckType: {
    width: 140,
    height: 64,
    backgroundColor: '#00000000'
  },
  buttonCheckTypeContainerActive: {
    backgroundColor: '#389FC1'
  },
  buttonCheckTypeContainerInactive: {
    backgroundColor: '#777777'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 30,
    paddingBottom: 150
  },
  container2: {
    alignItems: 'center',
    fontSize: 10,
  },
  buttonContainer: {
    margin: 20,
    color: '#FFF'
  },
  alternativeLayoutButtonContainer: {
    margin: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  logo: {
    color: 'white',
    fontSize: 30,
    fontStyle: 'italic',
    fontWeight: 'bold',
    textShadowColor: '#252525',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 15,
    paddingBottom: 50,
  },
  logo2: {
    color: 'green',
    fontSize: 30,
    fontStyle: 'italic',
    fontWeight: 'bold',
    textShadowColor: '#252525',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 15,
  },
  inputContainer: {
    margin: 10,
    marginBottom: 10,
    padding: 0,
    paddingBottom: 10,
    alignSelf: 'stretch',
    borderWidth: 1,
    borderColor: '#FFF',
    backgroundColor: 'rgba(255,255,255,0.2)'
  },
  inputContainer2: {
    margin: 10,
    marginBottom: 0,
    padding: 20,
    paddingBottom: 10,
    alignSelf: 'stretch',
    borderWidth: 1,
    borderColor: '#fff',
    backgroundColor: 'rgba(255,255,255,0.2)'
  },
  input: {
    fontSize: 16,
    height: 40,
    padding: 10,
    marginBottom: 10,
    backgroundColor: 'rgba(255,255,255,1)',
  },
  scrollView: {
    backgroundColor: 'pink',
    marginHorizontal: 80,
  },
});
