export type Reminder = {
  date: string;
  note: string;
};

export type CallReminder = {
  id: string;
  date: string;
  connected: boolean;
  note: string;
};

export type Escalation = {
  status: "None" | "Escalated";
  date?: string;
};

export type OrderRow = {
  id: string;
  orderId: string;
  customerId: string;
  customerNickName: string;
  orderType: string;
  mobileNumber: string;
  remainingPayment: number;
  promisedDeliveryDate: string;
  receivedAtShowroom?: string;
  delayInDays: number;
  quantity: number;
  r1?: Reminder;
  r2?: Reminder;
  r3?: Reminder;
  callReminders: CallReminder[];
  escalation?: Escalation;
};

export type RemainderFilterOption = "No" | "R1" | "R2" | "R3" | "Call";
