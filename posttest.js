import React from 'react';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';

export default class FetchExample extends React.Component {

    constructor() {
        super();
        this.state = { text:''}
    }

   render() {
        return(
            <View style={StyleSheet.container}>
                <Button onPress={this._postData} title="Post Data"></Button>
                <Text style={styles.welcome}>{this.state.text}</Text>
            </View>
        );
    }

    _postData = async () => {
        this.setState({text:'CLicked'})
        fetch('http://192.168.0.97:8081/ticketingservice/rest/services/qr_info', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                qrcode : '11245245',
            }),
        })
        .then((response) => {
            //return response.text();
            return response.json()
        })
        .then((data)=>{
            console.log(data);
            //console.log(JSON.parse('{"status":"ok","result": [{}]}'));
            //console.log(JSON.parse(data));
            if (data.result.length > 0) {
                this.setState({text: data.result[0].bookingdate});
            } else {
                 Alert.alert("ERROR", "NOT FOUND");
            }
            
            //Alert.alert("OK", data.status);
        })
        .catch((err)=>{
            Alert.alert("ERROR");
            console.error(err);
        });
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    welcome:{
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    }
});
