import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, ActivityIndicator } from 'react-native';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            dataSource: null,
        };
    }

    componentDidMount() {
        return fetch('http://facebook.github.io/react-native/movies.json')
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    isLoading: false,
                    dataSource: responseJson.movies,
                    title:"Star Wars"
                })
            })

            .catch((error) => {
                console.log(error)
            });

    }
    render() {
        if (this.state.isLoading) {
            return (
                <View style={styles.container}>
                    <ActivityIndicator />
                </View>
            )
        } else {

            let movies = this.state.dataSource.map((val, key)=>{
                return <View key={key} style={styles.item}>
                            <Text>{val.title}</Text>
                        </View>       
            });
            return (
                <View style={styles.container}>
                    {movies}
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    item:{
        flex: 0
    }
});