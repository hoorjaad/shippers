import React from "react";
import AddressCard from "./AddressCard";

export default function PickupAddress(props) {
  return <AddressCard type="pickup" {...props} />;
}
