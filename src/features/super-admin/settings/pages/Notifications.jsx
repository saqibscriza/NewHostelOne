import { useState } from "react";
import { Button } from "../../../../components/ui/button";
import {
  Monitor,
  Mail,
  Bell,
  Building2,
  Settings2,
  Users,
  BedDouble,
  RefreshCw,
} from "lucide-react";

const tabs = [
  { label: "System Alerts", icon: Monitor },
  { label: "Email Notifications", icon: Mail },
  { label: "Push Notifications", icon: Bell },
];

// (data unchanged)

export default function Notifications() {
  const [activeTab, setActiveTab] = useState("System Alerts");
  const [toggles, setToggles] = useState({
    hostelReg: true,
    subExpiring: true,
    maintenance: false,
    security: true,
    welcome: true,
    birthday: true,
    payment: false,
    rent: true,
    occupancy: false,
    stock: true,
    booking: true,
    checkout: true,
    fireAlarm: false,
    emergency: true,
    staffShift: false,
    maintenanceDone: true,
  });

  const handleToggle = (key) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const getCurrentSettings = () => {
    if (activeTab === "System Alerts") return alertSettings;
    if (activeTab === "Email Notifications") return emailSettings;
    return pushSettings;
  };

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Notification Settings
        </h1>
        <p className="text-sm text-muted-foreground">
          Configure how you receive important system events and alerts.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b border-border">
        {tabs.map((tab) => {
          const Icon = tab.icon;

          return (
            <button
              key={tab.label}
              onClick={() => setActiveTab(tab.label)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all
                ${
                  activeTab === tab.label
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Sections */}
      <div className="space-y-4">
        {getCurrentSettings().map((section) => {
          const Icon = section.icon;

          return (
            <div
              key={section.category}
              className="bg-card rounded-xl border border-border overflow-hidden"
            >
              {/* Section Header */}
              <div className="flex items-center gap-2 px-6 py-4 bg-muted border-b border-border">
                <Icon className="w-4 h-4 text-muted-foreground" />
                <p className="text-sm font-semibold text-foreground">
                  {section.category}
                </p>
              </div>

              {/* Items */}
              {section.items.map((item, index) => (
                <div
                  key={item.key}
                  className={`flex items-center justify-between px-6 py-5 ${
                    index !== section.items.length - 1
                      ? "border-b border-border"
                      : ""
                  }`}
                >
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {item.label}
                    </p>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {item.desc}
                    </p>
                  </div>

                  {/* Toggle */}
                  <button
                    onClick={() => handleToggle(item.key)}
                    className={`w-12 h-6 rounded-full transition-all ${
                      toggles[item.key] ? "bg-primary" : "bg-muted"
                    }`}
                  >
                    <span
                      className={`block w-5 h-5 bg-card rounded-full shadow transition-transform mx-0.5
                        ${
                          toggles[item.key] ? "translate-x-6" : "translate-x-0"
                        }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-3 pt-2">
        <Button variant="outline">Reset to Default</Button>

        <Button className="bg-primary text-primary-foreground hover:opacity-90">
          Save Notification Preferences
        </Button>
      </div>
    </div>
  );
}
