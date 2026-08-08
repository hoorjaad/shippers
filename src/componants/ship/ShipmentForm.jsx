import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PickupAddress from "./steps/PickupAddress";
import DeliveryAddress from "./steps/DeliveryAddress";
import AdditionalServices from "./steps/AdditionalServices";
import Dimension from "./steps/Dimension";
import SelectQuote from "./steps/SelectQuote";
import BookShipment from "./steps/BookShipment";
import PrintLabel from "./steps/PrintLabel";
import { saveShipmentRecord } from "../../utils/shipmentStorage";
import { removeFromCart } from "../../store/cartSlice";

const createCarrierQuotes = (packages) => {
  const totalWeight = packages.reduce(
    (total, item) => total + (Number(item.weight) || 0),
    0,
  );
  const basePrice = 12 + totalWeight * 1.35;
  const carriers = [
    { carrier: "DHL", service: "Express Worldwide", factor: 1.42, days: 2 },
    { carrier: "FedEx", service: "International Economy", factor: 1.18, days: 4 },
    { carrier: "UPS", service: "Worldwide Saver", factor: 1.3, days: 3 },
    { carrier: "Purolator", service: "Ground", factor: 0.95, days: 5 },
  ];

  return carriers.map((item, index) => ({
    id: `${item.carrier}-${Date.now()}-${index}`,
    carrier: item.carrier,
    service: item.service,
    deliveryDays: item.days + Math.floor(Math.random() * 2),
    price: Number(
      (basePrice * item.factor + 4 + Math.random() * 12).toFixed(2),
    ),
  }));
};
const steps = [
  "Pickup Address",
  "Delivery Address",
  "Additional Services",
  "Dimension & Weight",
  "Select Quote",
  "Book Shipment",
  "Print Label",
];

const addressStorageKeys = {
  pickup: "hajex-pickup-addresses",
  delivery: "hajex-delivery-addresses",
};

const loadSavedAddresses = (storageKey) => {
  if (typeof window === "undefined") return [];

  try {
    const savedAddresses = JSON.parse(localStorage.getItem(storageKey));
    return Array.isArray(savedAddresses) ? savedAddresses : [];
  } catch {
    return [];
  }
};

function ShipmentForm() {
  const dispatch = useDispatch();
  const supplyCartItems = useSelector((state) => state.cart.items);
  const [currentStep, setCurrentStep] = useState(0);
  const [addressesCollapsed, setAddressesCollapsed] = useState(false);
  const [pickupAddressBook, setPickupAddressBook] = useState(() =>
    loadSavedAddresses(addressStorageKeys.pickup),
  );
  const [deliveryAddressBook, setDeliveryAddressBook] = useState(() =>
    loadSavedAddresses(addressStorageKeys.delivery),
  );
  const [quotes, setQuotes] = useState([]);
  useEffect(() => {
    localStorage.setItem(
      addressStorageKeys.pickup,
      JSON.stringify(pickupAddressBook),
    );
  }, [pickupAddressBook]);

  useEffect(() => {
    localStorage.setItem(
      addressStorageKeys.delivery,
      JSON.stringify(deliveryAddressBook),
    );
  }, [deliveryAddressBook]);
  const [formData, setFormData] = useState({
    pickupAddress: {
      name: "",
      company: "",
      attention: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      postalCode: "",
      country: "",
      state: "",
      timeOpen: "",
      timeClose: "",
      date: "",
      instructions: "",
      reference: "",
    },
    pickupAddressSaved: false,

    deliveryAddress: {
      name: "",
      company: "",
      attention: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      postalCode: "",
      country: "",
      state: "",
      timeOpen: "",
      timeClose: "",
      date: "",
      instructions: "",
      reference: "",
    },
    deliveryAddressSaved: false,

    services: [],
    supplies: [],

    packages: [
      {
        id: "package-1",
        name: "",
        length: "",
        width: "",
        height: "",
        weight: "",
        description: "",
        saved: false,
      },
    ],

    selectedQuote: null,
    booking: null,
    labelUrl: "",
  });

  const updateSupplies = (suppliesList) => {
    setFormData((prev) => ({
      ...prev,
      supplies: suppliesList,
    }));
  };

  const updatePickupAddress = (address) => {
    setFormData((prevData) => ({
      ...prevData,
      pickupAddress: {
        ...prevData.pickupAddress,
        ...address,
      },
      pickupAddressSaved: false,
    }));
  };
  const updateDeliveryAddress = (address) => {
    setFormData((prevData) => ({
      ...prevData,
      deliveryAddress: {
        ...prevData.deliveryAddress,
        ...address,
      },
      deliveryAddressSaved: false,
    }));
  };
  const savePickupAddress = () => {
    setPickupAddressBook((addresses) => [
      ...addresses,
      { id: `pickup-${Date.now()}`, address: { ...formData.pickupAddress } },
    ]);
    setFormData((previousData) => ({
      ...previousData,
      pickupAddressSaved: true,
    }));
  };
  const saveDeliveryAddress = () => {
    setDeliveryAddressBook((addresses) => [
      ...addresses,
      { id: `delivery-${Date.now()}`, address: { ...formData.deliveryAddress } },
    ]);
    setFormData((previousData) => ({
      ...previousData,
      deliveryAddressSaved: true,
    }));
  };
  const selectPickupAddress = (savedAddress) => {
    setFormData((previousData) => ({
      ...previousData,
      pickupAddress: { ...savedAddress },
      pickupAddressSaved: true,
    }));
  };
  const selectDeliveryAddress = (savedAddress) => {
    setFormData((previousData) => ({
      ...previousData,
      deliveryAddress: { ...savedAddress },
      deliveryAddressSaved: true,
    }));
  };
  const editPickupAddress = () => {
    setFormData((previousData) => ({ ...previousData, pickupAddressSaved: false }));
  };
  const editDeliveryAddress = () => {
    setFormData((previousData) => ({ ...previousData, deliveryAddressSaved: false }));
  };
  const clearPickupAddress = () => {
    setFormData((previousData) => ({
      ...previousData,
      pickupAddress: Object.fromEntries(
        Object.keys(previousData.pickupAddress).map((key) => [key, ""]),
      ),
      pickupAddressSaved: false,
    }));
  };
  const clearDeliveryAddress = () => {
    setFormData((previousData) => ({
      ...previousData,
      deliveryAddress: Object.fromEntries(
        Object.keys(previousData.deliveryAddress).map((key) => [key, ""]),
      ),
      deliveryAddressSaved: false,
    }));
  };
  const toggleService = (serviceId) => {
    setFormData((previousData) => {
      const isAlreadySelected = previousData.services.includes(serviceId);

      const updatedServices = isAlreadySelected
        ? previousData.services.filter((service) => service !== serviceId)
        : [...previousData.services, serviceId];

      return {
        ...previousData,
        services: updatedServices,
      };
    });
  };
  const updatePackage = (packageId, event) => {
    const { name, value } = event.target;
    setFormData((previousData) => ({
      ...previousData,
      packages: previousData.packages.map((item) =>
        item.id === packageId ? { ...item, [name]: value, saved: false } : item,
      ),
    }));
  };
  const savePackage = (packageId) => {
    setFormData((previousData) => ({
      ...previousData,
      packages: previousData.packages.map((item) =>
        item.id === packageId ? { ...item, saved: true } : item,
      ),
    }));
  };
  const duplicatePackage = (packageId) => {
    setFormData((previousData) => {
      const source = previousData.packages.find((item) => item.id === packageId);
      if (!source) return previousData;
      return {
        ...previousData,
        packages: [
          ...previousData.packages,
          {
            ...source,
            id: `package-${Date.now()}`,
            name: source.name ? `${source.name} Copy` : "",
            saved: false,
          },
        ],
      };
    });
  };
  const addPackage = () => {
    setFormData((previousData) => ({
      ...previousData,
      packages: [
        ...previousData.packages,
        {
          id: `package-${Date.now()}`,
          name: "",
          length: "",
          width: "",
          height: "",
          weight: "",
          description: "",
          saved: false,
        },
      ],
    }));
  };
  const deletePackage = (packageId) => {
    setFormData((previousData) => ({
      ...previousData,
      packages: previousData.packages.filter((item) => item.id !== packageId),
    }));
  };
  const submitShipment = async () => {
    if (formData.booking || !formData.selectedQuote) return;
    const booking = await saveShipmentRecord(formData, supplyCartItems);
    setFormData((previousData) => ({ ...previousData, booking }));
    setCurrentStep(6);
  };
  const handleReset = () => {
    setFormData({
      pickupAddress: { name: "", company: "", attention: "", email: "", phone: "", address: "", city: "", postalCode: "", country: "", state: "", timeOpen: "", timeClose: "", date: "", instructions: "", reference: "" },
      pickupAddressSaved: false,
      deliveryAddress: { name: "", company: "", attention: "", email: "", phone: "", address: "", city: "", postalCode: "", country: "", state: "", timeOpen: "", timeClose: "", date: "", instructions: "", reference: "" },
      deliveryAddressSaved: false,
      services: [],
      packages: [{ id: `package-${Date.now()}`, name: "", length: "", width: "", height: "", weight: "", description: "", saved: false }],
      selectedQuote: null,
      booking: null,
      labelUrl: "",
    });
    setCurrentStep(0);
  };
  const handleNext = () => {
    if (currentStep <= 3) {
      const detailsComplete = [0, 1, 2, 3].every(isStepComplete);
      if (!detailsComplete) return;

      setQuotes(createCarrierQuotes(formData.packages));
      setFormData((previousData) => ({
        ...previousData,
        selectedQuote: null,
      }));
      setCurrentStep(4);
      return;
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  const isStepComplete = (stepIndex) => {
    const pickup = formData.pickupAddress;
    const delivery = formData.deliveryAddress;

    switch (stepIndex) {
      case 0:
        return Boolean(pickup.address.trim());

      case 1:
        return Boolean(delivery.address.trim());

      case 2:
        return formData.services.length > 0;

      case 3:
        return formData.packages.some(
          (item) =>
            Number(item.length) > 0 &&
            Number(item.width) > 0 &&
            Number(item.height) > 0 &&
            Number(item.weight) > 0,
        );

      case 4:
        return formData.selectedQuote !== null;

      case 5:
        return formData.booking !== null;

      case 6:
        return Boolean(formData.labelUrl);

      default:
        return false;
    }
  };
  const renderStepContent = () => {
    // Show the shipment details area during steps 1–4
    if (currentStep >= 0 && currentStep <= 3) {
      return (
        <div className="space-y-3">
          {/* Pickup and delivery cards */}
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <PickupAddress
                address={formData.pickupAddress}
                updateAddress={updatePickupAddress}
                saved={formData.pickupAddressSaved}
                saveAddress={savePickupAddress}
                editAddress={editPickupAddress}
                clearAddress={clearPickupAddress}
                collapsed={addressesCollapsed}
                toggleCollapsed={() => setAddressesCollapsed((value) => !value)}
                savedAddresses={pickupAddressBook}
                selectSavedAddress={selectPickupAddress}
              />
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <DeliveryAddress
                address={formData.deliveryAddress}
                updateAddress={updateDeliveryAddress}
                saved={formData.deliveryAddressSaved}
                saveAddress={saveDeliveryAddress}
                editAddress={editDeliveryAddress}
                clearAddress={clearDeliveryAddress}
                collapsed={addressesCollapsed}
                toggleCollapsed={() => setAddressesCollapsed((value) => !value)}
                savedAddresses={deliveryAddressBook}
                selectSavedAddress={selectDeliveryAddress}
              />
            </div>
          </div>

          {/* Additional services */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <AdditionalServices
              selectedServices={formData.services}
              toggleService={toggleService}
            />
          </div>

          {/* Dimensions and weight with Supplies Option */}
          <Dimension
            packages={formData.packages}
            updatePackage={updatePackage}
            savePackage={savePackage}
            duplicatePackage={duplicatePackage}
            deletePackage={deletePackage}
            addPackage={addPackage}
            selectedSupplies={formData.supplies}
            updateSupplies={updateSupplies}
          />
        </div>
      );
    }

    switch (currentStep) {
      case 4:
        return (
          <SelectQuote
            quotes={quotes}
            selectedQuote={formData.selectedQuote}
            supplyCartItems={supplyCartItems}
            onSelect={(quote) =>
              setFormData((previousData) => ({
                ...previousData,
                selectedQuote: quote,
              }))
            }
          />
        );

      case 5:
        return (
          <BookShipment
            formData={formData}
            onSubmit={submitShipment}
            supplies={supplyCartItems}
            removeSupply={(productId) => dispatch(removeFromCart(productId))}
          />
        );

      case 6:
        return <PrintLabel formData={formData} onReset={handleReset} />;

      default:
        return null;
    }
  };

  return (
    <div>
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white px-2 py-2 shadow-sm">
        <div className="flex min-w-[680px] items-start">
          {steps.map((step, index) => {
            const isCompleted = isStepComplete(index);
            const isActive = currentStep === index;

            return (
              <React.Fragment key={step}>
                <button
                  type="button"
                  onClick={() => setCurrentStep(index)}
                  className="flex w-24 flex-col items-center sm:w-28"
                >
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-full border text-[10px] font-semibold transition ${isCompleted
                        ? "border-blue-600 bg-blue-600 text-white"
                        : isActive
                          ? "border-blue-600 bg-white text-blue-600"
                          : "border-gray-300 bg-white text-gray-400"
                      }`}
                  >
                    {isCompleted ? "✓" : index + 1}
                  </div>

                  <p
                    className={`mt-1 text-center text-[10px] font-medium sm:text-[11px] ${isCompleted || isActive
                        ? "text-blue-600"
                        : "text-gray-500"
                      }`}
                  >
                    {step}
                  </p>
                </button>

                {index < steps.length - 1 && (
                  <div
                    className={`mt-4 h-[2px] flex-1 transition ${isCompleted ? "bg-blue-600" : "bg-gray-200"
                      }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
      <div className="mt-3">
        {renderStepContent()}
      </div>
      <div className="mt-3 flex justify-between">
        <button
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-40"
          disabled={currentStep === 0}
          onClick={handlePrevious}
        >
          Previous
        </button>
        <button
          className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-40"
          disabled={
            currentStep === steps.length - 1 ||
            (currentStep <= 3 && ![0, 1, 2, 3].every(isStepComplete)) ||
            (currentStep === 4 && !formData.selectedQuote) ||
            (currentStep === 5 && !formData.booking)
          }
          onClick={handleNext}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default ShipmentForm;
