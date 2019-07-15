import React, { Component } from 'react';
import init from 'react_native_mqtt';
import CircularSlider from './utils/CircularSlider'
import { AsyncStorage, StyleSheet, Text, View } from 'react-native';

init({
  size: 10000,
  storageBackend: AsyncStorage,
  defaultExpires: 1000 * 3600 * 24,
  enableCache: true,
  sync: {},
});

const styles = StyleSheet.create({
  container: {
      display: 'flex',
      alignItems: 'center',
    backgroundColor: '#3D3D3D',
    width: '100%',
    height: '100%',
  },
  status: {
      marginBottom: 100,
      color: '#EEE',
      fontSize: 18,
      fontWeight: '600'

  },
  title: {
    marginTop: 30,
    color: '#EEE',
    fontSize: 22,
    fontWeight: '600'
  }
});

export default class MqttLog extends Component {
  constructor(props) {
    super(props);

    const client = new Paho.MQTT.Client('iot.eclipse.org', 443, 'BCI0112')
    client.onConnectionLost = this.onConnectionLost;
    client.connect({ onSuccess: this.onConnect, useSSL: true });

    this.state = {
      value: 0,
      text: 'Desconectado',
      client,
    };
  }

  pushText = entry => {
    this.setState({ text: entry });
  };

  onConnect = () => {
    this.pushText('Conectado');
  };

  onConnectionLost = responseObject => {
    if (responseObject.errorCode !== 0) {
      this.pushText(`connection lost: ${responseObject.errorMessage}`);
    }
  };

  onSendMessage = async () => {
    const { client } = this.state;
    console.log(this.state.value);
    await client.publish("SERVO", "" + this.state.value);
  }

  render() {
    const { text } = this.state;

    return (
      <View style={styles.container}>
        <Text  style={styles.title} >Exemplo MQTT</Text>
         <Text  style={styles.status} >Status: {text}</Text>
          <CircularSlider width={300} height={300} meterColor='#0044FF' textColor='#EEE'
              value={this.state.value} onValueChange={(value) => this.setState({ value })} onValueChangeEnd={this.onSendMessage}/>
      </View>
    );
  }
}
