import React, { Component } from 'react';
import { View, StyleSheet, Button, Alert } from 'react-native';
import { Constants, MapView, Location, Permissions } from 'expo';

export default class App extends Component {
  state = {
    mapRegion: { latitude: 37.78825, longitude: -122.4324},
    locationResult: null
  };

  componentDidMount() {
    this._getLocationAsync();
  }

  _handleMapRegionChange = mapRegion => {
    this.setState({ mapRegion });
  };

  _handleButtonPress = () => {
    Alert.alert(
      'Boton de prueba',
      'el bambi es muy gay',
    );
  };

  _getLocationAsync = async () => {
   let { status } = await Permissions.askAsync(Permissions.LOCATION);
   if (status !== 'granted') {
     this.setState({
       locationResult: 'Permission to access location was denied',
     });
   }

   let location = await Location.getCurrentPositionAsync({});
   let locationParsed = location;
   let latitude = locationParsed.coords.latitude
   let longitude = locationParsed.coords.longitude
   this.setState({
     locationResult: location,
     mapRegion: {latitude, longitude}
   });
 };

  render() {
    return (
      <View style={styles.container}>

        <MapView
          style={{ alignSelf: 'stretch', height: '80%'}}
          region={this.state.mapRegion}
          onRegionChange={this._handleMapRegionChange}
        >
          <MapView.Marker
            coordinate={this.state.mapRegion}
            title={'Tu ubicación'}
            description={'descripcion ubicación'}
          />
        </MapView>

        <Button
          title="Aceptar"
          onPress={this._handleButtonPress}
        />

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
  },
});
