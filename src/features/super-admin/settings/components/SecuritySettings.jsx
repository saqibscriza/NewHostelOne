import { Card, CardContent } from "../../../../components/ui/Card";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";

export default function SecuritySettings() {
  return (
    <Card className="bg-card border border-border">
      <CardContent className="p-6 space-y-4">
        <h3 className="font-semibold text-lg text-foreground">Security</h3>

        <Input type="password" placeholder="New Password" />
        <Input type="password" placeholder="Confirm Password" />

        <Button className="bg-primary text-primary-foreground hover:opacity-90">
          Update Password
        </Button>
      </CardContent>
    </Card>
  );
}
