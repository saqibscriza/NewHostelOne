import { useState } from "react";
import PageHeader from "../../../../shared/components/PageHeader";
import NotificationSection from "../components/NotificationSection";

const TABS = ["System Alerts", "Email Notifications", "Push Notifications"];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("System Alerts");

  return (
    <div className="p-4 sm:p-6 space-y-6 bg-background min-h-screen">
      {/* Header */}
      <PageHeader
        title="Notification Settings"
        desc="Configure how you receive important system events and alerts across different channels."
      />

      {/* Tabs */}
      <div className="flex gap-6 border-b border-border text-sm">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 border-b-2 transition-all
              ${
                activeTab === tab
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "System Alerts" && <SystemAlerts />}
      {activeTab === "Email Notifications" && <EmailNotifications />}
      {activeTab === "Push Notifications" && <PushNotifications />}
    </div>
  );
}

/* ================= SYSTEM ALERTS ================= */

function SystemAlerts() {
  const [state, setState] = useState({
    registration: true,
    subscription: true,
    maintenance: false,
    security: true,
  });

  return (
    <div className="space-y-4">
      <NotificationSection
        title="Hostel Management"
        items={[
          {
            title: "New Hostel Registration",
            desc: "Receive alerts when a new hostel applies.",
            enabled: state.registration,
            onChange: () =>
              setState({ ...state, registration: !state.registration }),
          },
          {
            title: "Subscription Expiring",
            desc: "Alert for expiring subscriptions.",
            enabled: state.subscription,
            onChange: () =>
              setState({ ...state, subscription: !state.subscription }),
          },
        ]}
      />

      <NotificationSection
        title="System & Operations"
        items={[
          {
            title: "System Maintenance",
            desc: "Scheduled downtime alerts.",
            enabled: state.maintenance,
            onChange: () =>
              setState({ ...state, maintenance: !state.maintenance }),
          },
          {
            title: "Critical Security Alerts",
            desc: "Unauthorized access alerts.",
            enabled: state.security,
            onChange: () => setState({ ...state, security: !state.security }),
          },
        ]}
      />
    </div>
  );
}

/* ================= EMAIL ================= */

function EmailNotifications() {
  const [state, setState] = useState({
    welcome: true,
    birthday: true,
    payment: false,
    rent: true,
  });

  return (
    <div className="space-y-4">
      <NotificationSection
        title="User Engagement"
        items={[
          {
            title: "Welcome Email",
            desc: "Send welcome email.",
            enabled: state.welcome,
            onChange: () => setState({ ...state, welcome: !state.welcome }),
          },
          {
            title: "Birthday Wishes",
            desc: "Send birthday emails.",
            enabled: state.birthday,
            onChange: () => setState({ ...state, birthday: !state.birthday }),
          },
        ]}
      />

      <NotificationSection
        title="Financial Alerts"
        items={[
          {
            title: "Payment Confirmation",
            desc: "Notify on payment success.",
            enabled: state.payment,
            onChange: () => setState({ ...state, payment: !state.payment }),
          },
          {
            title: "Rent Due Reminder",
            desc: "Send rent reminders.",
            enabled: state.rent,
            onChange: () => setState({ ...state, rent: !state.rent }),
          },
        ]}
      />
    </div>
  );
}

/* ================= PUSH ================= */

function PushNotifications() {
  const [state, setState] = useState({
    booking: true,
    checkout: true,
    shift: false,
    maintenance: true,
  });

  return (
    <div className="space-y-4">
      <NotificationSection
        title="Room & Bed Management"
        items={[
          {
            title: "New Booking Request",
            desc: "Notify on new booking.",
            enabled: state.booking,
            onChange: () => setState({ ...state, booking: !state.booking }),
          },
          {
            title: "Checkout Notification",
            desc: "Notify on checkout.",
            enabled: state.checkout,
            onChange: () => setState({ ...state, checkout: !state.checkout }),
          },
        ]}
      />

      <NotificationSection
        title="Operational Updates"
        items={[
          {
            title: "Staff Shift Reminders",
            desc: "Notify before shift change.",
            enabled: state.shift,
            onChange: () => setState({ ...state, shift: !state.shift }),
          },
          {
            title: "Maintenance Completed",
            desc: "Notify when done.",
            enabled: state.maintenance,
            onChange: () =>
              setState({ ...state, maintenance: !state.maintenance }),
          },
        ]}
      />
    </div>
  );
}
