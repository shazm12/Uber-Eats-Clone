import { DataStore } from "aws-amplify";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useState, useEffect } from "react";
import { Courier, Order, OrderStatus, User } from "../../models";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useRef } from "react";

const OrderLiveUpdates = ({ id }) => {
  const [order, setOrder] = useState(null);
  const [courier, setCourier] = useState(null);
  const [user , setUser] = useState(null);

  const mapRef = useRef(null);

  useEffect(() => {
    DataStore.query(Order, id).then(setOrder);
  }, []);

  useEffect(() => {
    if (!order) {
      return;
    }
    const subscription = DataStore.observe(Order, order.id).subscribe((msg) => {
      if (msg.opType === "UPDATE") {
        setOrder(msg.element);
      }
    });

    return () => subscription.unsubscribe();
  }, [order]);

  useEffect(() => {
    if (order?.orderCourierId) {
      DataStore.query(Courier, order.orderCourierId).then(setCourier);
    }
  }, [order?.orderCourierId]);

  useEffect(() => {
    if (courier?.lng && courier?.lat) {
      mapRef.current.animateToRegion({
        latitude: courier.lat,
        longitude: courier.lng,
        latitudeDelta: 0.007,
        longitudeDelta: 0.007,
      });
    }
  }, [courier?.lng, courier?.lat]);

  useEffect(() => {
    if (!courier) {
      return;
    }
    const subscription = DataStore.observe(Courier, courier.id).subscribe(
      (msg) => {
        if (msg.opType === "UPDATE") {
          setCourier(msg.element);
        }
      }
    );
    return () => subscription.unsubscribe();
  }, [courier]);

  console.log(order);


  useEffect(() => {
    DataStore.query(User, order?.userID).then(setUser);
  }, []);

  if (!order || !user) {
    return <ActivityIndicator size={"large"} color="gray" />;
  }

  console.log(user);

  const showOrderStatus = () => {
    if(order?.status === OrderStatus.NEW) {
      return `${order?.Restaurant?.name} is preparaing you order...`;
    }
    else if( order?.status === OrderStatus.ACCEPTED) {
      return `To be Delivered by : ${courier?.name}`;
    }
    else if( order?.status === OrderStatus.READY_FOR_PICK_UP) {
      return "Looking for someone to pick up...";
    }
  }

  return (
    <View>
          <View style={styles.statusBox}>
            <Text style={styles.statusText}>{showOrderStatus()}</Text>
          </View>
      <MapView 
        style={styles.map} 
        ref={mapRef} 
        showsUserLocation
        initialRegion={{
          latitude: user?.lat,
          longitude: user?.lng,
          latitudeDelta: 0.08,
          longitudeDelta: 0.08
        }}
      >

        
      {/*  Currently not working becuase the user state is not
            getting updated properly by Datastore */}

        {/* <Marker
            coordinate={{ latitude: user?.lat, longitude: user?.lng }}
          >
            <View
              style={{
                padding: 5,
                backgroundColor: "green",
                borderRadius: 40,
              }}
            >
              <FontAwesome5 name="home" size={24} color="white" />
            </View>
          </Marker> */}


        {courier?.lat && (
          <Marker
            coordinate={{ latitude: courier.lat, longitude: courier.lng }}
          >
            <View
              style={{
                padding: 5,
                backgroundColor: "green",
                borderRadius: 40,
              }}
            >
              <FontAwesome5 name="motorcycle" size={24} color="white" />
            </View>
          </Marker>
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: "100%",
  },
  statusBox: {
    width: "100%",
    alignItems: "center",
    height: "9%",
    justifyContent:"center",
    backgroundColor: "white"
  },
  statusText: {
    fontSize: 18,
    fontWeight: "bold",
    textShadowColor: 'rgba(170,170,170, 0.75)',
    textShadowOffset: {width: 3, height: 3},
    textShadowRadius: 8

  }
});

export default OrderLiveUpdates;
