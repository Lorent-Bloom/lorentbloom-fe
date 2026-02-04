import type { FlowStepConfig } from "./interface";

// Default flow step configuration
// This can be used as fallback if database steps are not available
// Or for initial seeding of the database
export const DEFAULT_FLOW_STEPS: FlowStepConfig[] = [
  {
    stepKey: "order_created",
    stepOrder: 1,
    name: "Order Created",
    description: "The rental order has been placed and confirmed.",
    triggeredBy: "system",
    requiredAction: "none",
    notifyParty: "both",
    nextStepId: 2,
  },
  {
    stepKey: "photos_sent",
    stepOrder: 2,
    name: "Photos Sent",
    description: "The owner sends photos of the product before shipping.",
    triggeredBy: "owner",
    requiredAction: "upload_images",
    notifyParty: "receiver",
    nextStepId: 3,
  },
  {
    stepKey: "money_sent",
    stepOrder: 3,
    name: "Money Sent",
    description: "Payment has been sent by the renter.",
    triggeredBy: "receiver",
    requiredAction: "upload_images",
    notifyParty: "owner",
    nextStepId: 4,
  },
  {
    stepKey: "money_received",
    stepOrder: 4,
    name: "Money Received",
    description: "Payment has been received by the owner.",
    triggeredBy: "owner",
    requiredAction: "confirm",
    notifyParty: "receiver",
    nextStepId: 5,
  },
  {
    stepKey: "package_sent",
    stepOrder: 5,
    name: "Package Sent",
    description: "The rental item has been shipped.",
    triggeredBy: "owner",
    requiredAction: "confirm",
    notifyParty: "receiver",
    nextStepId: 6,
  },
  {
    stepKey: "package_received",
    stepOrder: 6,
    name: "Package Received",
    description: "The rental item has been received by the renter.",
    triggeredBy: "receiver",
    requiredAction: "confirm",
    notifyParty: "owner",
    nextStepId: 7,
  },
  {
    stepKey: "package_sent_back",
    stepOrder: 7,
    name: "Package Sent Back",
    description: "The rental item has been returned by the renter.",
    triggeredBy: "receiver",
    requiredAction: "upload_images",
    notifyParty: "owner",
    nextStepId: 8,
  },
  {
    stepKey: "package_received_back",
    stepOrder: 8,
    name: "Package Received Back",
    description: "The rental item has been received back by the owner.",
    triggeredBy: "owner",
    requiredAction: "confirm",
    notifyParty: "receiver",
    nextStepId: null,
  },
];

// Step key to i18n key mapping
export const STEP_I18N_KEYS: Record<string, string> = {
  order_created: "orderCreated",
  photos_sent: "photosSent",
  money_sent: "moneySent",
  money_received: "moneyReceived",
  package_sent: "packageSent",
  package_received: "packageReceived",
  package_sent_back: "packageSentBack",
  package_received_back: "packageReceivedBack",
};
