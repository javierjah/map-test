import React, { Component } from 'react';
import { View, StyleSheet, Button, Alert, FlatList, Text, TouchableHighlight } from 'react-native';
import { Constants, MapView, Location, Permissions } from 'expo';
import customMarker from './assets/marker.png'

export default class App extends Component {
  state = {
    mapRegion: {
      latitude: -33.454402,
      longitude: -70.560250,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
      name: 'Tu ubicación actual'
    },
    locationResult: null,
    corsList: [],
  };

  componentDidMount() {
    fetch('http://maps-api-dev.us-west-2.elasticbeanstalk.com/api/maps')
      .then((res) => {
        if (res.ok) {
          return res.json()
        }
        return false
      })
      .then((res) => {
        const corsList = res.map((map, i) => {
          map.key = i
          map.cords[0].latitudeDelta = 0.0922
          map.cords[0].longitudeDelta = 0.0922
          return map;
        })

        this.setState({corsList})
      })
      .catch((err) => console.log(err))

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

 _onPress (region) {
  this.setState({mapRegion: region.cords[0]})
 }

  render() {
    return (
      <View style={styles.container}>

        <MapView
          style={{ alignSelf: 'stretch', height: '50%'}}
          region={this.state.mapRegion}
          onRegionChange={this._handleMapRegionChange}
        >
          <MapView.Marker
            coordinate={this.state.mapRegion}
            image={customMarker}
            title={'Tu ubicación'}
            description={'descripcion ubicación'}
          />
        </MapView>

        <View style={{ alignSelf: 'stretch', height: '50%'}}>
          <View style={styles.container}>
            <FlatList
              data={this.state.corsList}
              renderItem={({item}) => <TouchableHighlight key={item.id} onPress={() => this._onPress(item)} underlayColor='rgba(50, 69, 88, 0.8)'><Text style={styles.item}>{item.name}</Text></TouchableHighlight>}
            />
          </View>
        </View>
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
  container: {
    flex: 1,
    paddingTop: 22
   },
   item: {
     padding: 10,
     fontSize: 18,
     height: 44,
   },
});

