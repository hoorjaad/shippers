const serviceGroups = [
  {
    id: "ship-package",
    title: "Ship a Package",
    description: "For boxes, parcels, and individual items.",
    accent: "blue",
    services: [
      { id: "package-signature", title: "Signature Required" },
      { id: "package-residential", title: "Residential Delivery" },
      { id: "package-insurance", title: "Shipment Insurance" },
    ],
  },
  {
    id: "ship-pallet",
    title: "Ship a Pallet",
    description: "For freight secured and transported on a pallet.",
    accent: "amber",
    services: [
      { id: "pallet-signature", title: "Signature Required" },
      { id: "pallet-tailgate-pickup", title: "Tailgate Pickup" },
      { id: "pallet-tailgate-delivery", title: "Tailgate Delivery" },
    ],
  },
];

function AdditionalServices({ selectedServices, toggleService }) {
  const toggleGroup = (group) => {
    const isSelected = selectedServices.includes(group.id);

    if (isSelected) {
      toggleService(group.id);
      group.services.forEach((service) => {
        if (selectedServices.includes(service.id)) toggleService(service.id);
      });
      return;
    }

    serviceGroups.forEach((otherGroup) => {
      if (otherGroup.id === group.id) return;

      if (selectedServices.includes(otherGroup.id)) {
        toggleService(otherGroup.id);
      }

      otherGroup.services.forEach((service) => {
        if (selectedServices.includes(service.id)) toggleService(service.id);
      });
    });

    toggleService(group.id);
  };

  return (
    <div>
      <div className="mb-3">
        <h2 className="text-sm font-bold text-slate-800">Shipping service</h2>
        <p className="text-xs text-slate-500">
          Select a shipment type, then choose the services you need.
        </p>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        {serviceGroups.map((group) => {
          const isGroupSelected = selectedServices.includes(group.id);
          const isBlue = group.accent === "blue";

          return (
            <section
              key={group.id}
              className={`overflow-hidden rounded-xl border transition ${
                isGroupSelected
                  ? isBlue
                    ? "border-blue-300 bg-blue-50/30"
                    : "border-amber-300 bg-amber-50/30"
                  : "border-slate-200 bg-white"
              }`}
            >
              <label className="flex cursor-pointer items-center gap-3 border-b border-slate-100 px-4 py-3">
                <input
                  type="checkbox"
                  checked={isGroupSelected}
                  onChange={() => toggleGroup(group)}
                  className="h-4 w-4 shrink-0 accent-blue-600"
                />
                <span className="min-w-0">
                  <span className="block text-sm font-bold text-slate-800">
                    {group.title}
                  </span>
                  <span className="block text-[11px] text-slate-500">
                    {group.description}
                  </span>
                </span>
              </label>

              <div className="grid gap-1.5 p-3 sm:grid-cols-3">
                {group.services.map((service) => {
                  const isSelected = selectedServices.includes(service.id);

                  return (
                    <label
                      key={service.id}
                      className={`flex items-center gap-2 rounded-lg border px-2.5 py-2 text-[11px] font-medium transition ${
                        !isGroupSelected
                          ? "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-400"
                          : isSelected
                            ? isBlue
                              ? "cursor-pointer border-blue-200 bg-blue-100 text-blue-700"
                              : "cursor-pointer border-amber-200 bg-amber-100 text-amber-700"
                            : "cursor-pointer border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        disabled={!isGroupSelected}
                        onChange={() => toggleService(service.id)}
                        className="h-3.5 w-3.5 shrink-0 accent-blue-600"
                      />
                      <span>{service.title}</span>
                    </label>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

export default AdditionalServices;
