import React from "react";
import AddressCard from "./AddressCard";

export default function DeliveryAddress(props) {
  return <AddressCard type="delivery" {...props} />;
}
