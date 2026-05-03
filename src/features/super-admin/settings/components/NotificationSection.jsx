import { Card } from "../../../../components/ui/Card";
import { Switch } from "../../../../components/ui/switch";

export default function NotificationSection({ title, items }) {
  return (
    <Card className="rounded-xl overflow-hidden bg-card border border-border">
      {/* Header */}
      <div className="bg-muted px-4 py-3 font-semibold text-foreground">
        {title}
      </div>

      {/* Items */}
      {items.map((item, i) => (
        <div
          key={i}
          className="flex items-center justify-between px-4 py-4 border-t border-border"
        >
          <div>
            <p className="font-medium text-foreground">{item.title}</p>
            <p className="text-sm text-muted-foreground">{item.desc}</p>
          </div>

          <Switch checked={item.enabled} onCheckedChange={item.onChange} />
        </div>
      ))}
    </Card>
  );
}
