import { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { DataStore } from "aws-amplify";
import { Order,  Courier, BasketDish } from "../../models";


const BasketDishItem = ({ basketDish }) => {
  console.log(basketDish);
  const [dishes, setDishes] = useState();
  return (
    <View style={styles.row}>
      <View style={styles.quantityContainer}>
        <Text>{basketDish.quantity}</Text>
      </View>
      <Text style={{ fontWeight: "600" }}>{basketDish.Dish.name}</Text>
      <Text style={{ marginLeft: "auto" }}>$ {basketDish.Dish.price}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 15,
    paddingHorizontal: 10,
  },

  quantityContainer: {
    backgroundColor: "lightgray",
    paddingHorizontal: 5,
    paddingVertical: 2,
    marginRight: 10,
    borderRadius: 3,
  },
});

export default BasketDishItem;
