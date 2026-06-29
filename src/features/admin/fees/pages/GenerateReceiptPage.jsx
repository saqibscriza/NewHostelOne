import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/Card";
import { Button } from "../../../../components/ui/button";
import { ArrowRight, Clock, User } from "lucide-react";
import { Link } from "react-router-dom";
import { Download } from "lucide-react";
import { getFeeReceipt } from "../../../../utils/utils";
import { useSearchParams } from "react-router-dom";

export default function GenerateReceiptPage() {

const [receiptData, setReceiptData] = useState(null);
const [searchParams] = useSearchParams();
const transactionId = searchParams.get("transactionId");

const myFeeReceipt = async () => {
  try {
    const response = await getFeeReceipt(transactionId);
    console.log("RECEIPT =>", response);

    setReceiptData(response);
  } catch (error) {
    console.error("Error fetching fee receipt:", error);
  }
};
useEffect(() => {
  console.log("USE EFFECT RUN");
  console.log("Transaction ID =>", transactionId);

  if (transactionId) {
    myFeeReceipt();
  }
}, [transactionId]);

console.log("Transaction ID =>", transactionId);
console.log("Receipt Data =>", receiptData);

  return (
    <div className="max-w-7xl mx-auto pb-8">
      {/* ReceiptHeader */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Generate Receipt</h1>
        <p className="text-muted-foreground text-base mt-2">
          Generate receipt for completed booking or payment
        </p>
      </div>
      <Button className="bg-foreground hover:bg-foreground/90 text-background flex items-center gap-2 h-11 px-6 rounded-lg cursor-pointer">
        <Download className="w-4 h-4" />
        Download
      </Button>
    </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="lg:col-span-2">
          {/* ReceiptDocument */}
          <Card className="border-border shadow-sm rounded-xl h-full bg-card text-card-foreground">
                <CardContent className="p-8 sm:p-12">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-12">
                    <div>
                      {/* Logo placeholder */}
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-foreground rounded-md flex items-center justify-center">
                          <span className="text-background font-bold text-xl">S</span>
                        </div>
                        <span className="text-2xl font-bold text-foreground tracking-tight">Scriza</span>
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>Ground Floor, Logix Park (Supreme Work),</p>
                        <p>A-4-5, A Block, Sector 16, Noida, Uttar</p>
                        <p>Pradesh 201301</p>
                      </div>
                    </div>
                    <div className="text-left sm:text-right">
                      <h2 className="text-2xl font-bold text-foreground mb-4 uppercase tracking-wide">Payment Receipt</h2>
                      <div className="space-y-1">
                        <p className="text-base font-bold text-foreground">#{receiptData?.feeId}</p>
                        <p className="text-sm text-muted-foreground">Date: {receiptData?.paymentDate}</p>
                      </div>
                    </div>
                  </div>
          
                  {/* Info Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
                    <div>
                      <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Student Information</h3>
                      <p className="text-base font-bold text-foreground mb-1">{receiptData?.studentName}</p>
                      <p className="text-sm text-muted-foreground">ID: {receiptData?.studentId}</p>
                      <p className="text-sm text-muted-foreground">Room: {receiptData?.roomNumber}</p>
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Transaction Details</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Method:</span>
                          <span className="font-bold text-foreground">{receiptData?.paymentMethod}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Status:</span>
                          <span className="px-2 py-0.5 bg-muted text-foreground text-[10px] font-bold rounded-md tracking-wider uppercase">{receiptData?.status}</span>
                        </div>
                      </div>
                    </div>
                  </div>
          
                  {/* Table */}
                  <div className="mb-8">
                    <div className="flex justify-between items-center py-3 px-4 bg-muted/30 rounded-t-lg border-b border-border">
                      <span className="text-xs font-bold text-foreground uppercase tracking-wider">Description</span>
                      <span className="text-xs font-bold text-foreground uppercase tracking-wider">Amount</span>
                    </div>
                    <div className="divide-y divide-border">
                      <div className="flex justify-between items-center py-4 px-4">
                        <span className="text-sm text-foreground">Room Rent (Monthly)</span>
                        <span className="text-sm font-bold text-foreground">₹{receiptData?.roomRent}</span>
                      </div>
                      <div className="flex justify-between items-center py-4 px-4">
                        <span className="text-sm text-foreground">Mess Charges</span>
                        <span className="text-sm font-bold text-foreground">₹{receiptData?.messCharges}</span>
                      </div>
                      <div className="flex justify-between items-center py-4 px-4">
                        <span className="text-sm text-foreground">Electricity & Utility</span>
                        <span className="text-sm font-bold text-foreground">₹{receiptData?.electricityCharges}</span>
                      </div>
                      <div className="flex justify-between items-center py-4 px-4">
                        <span className="text-sm text-foreground">Late Fee Penalty</span>
                        <span className="text-sm font-bold text-foreground">₹{receiptData?.lateFee}</span>
                      </div>
                    </div>
                  </div>
          
                  {/* Total */}
                  <div className="bg-muted/30 rounded-xl p-6 flex justify-between items-center mb-16">
                    <span className="text-base font-bold text-foreground uppercase tracking-wider">Total Paid</span>
                    <span className="text-3xl font-bold text-foreground">₹{receiptData?.totalAmount}</span>
                  </div>
          
                  {/* Footer */}
                  <div className="flex flex-col sm:flex-row justify-between items-end gap-6 pt-8 border-t border-border">
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>Receipt generated on: 20 Oct 2023, 14:45 PM</p>
                      <p>Computer generated receipt, no signature required.</p>
                    </div>
                    <div className="text-right">
                      <div className="w-40 h-px bg-border mb-2 ml-auto"></div>
                      <p className="text-xs font-bold text-foreground">Authorized Signatory</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
        </div>


      {/* ReceiptSideBar */}
      <div className="lg:col-span-1">
      <div className="space-y-6">
      {/* Payment Summary */}
      <Card className="border-border shadow-sm rounded-xl bg-card text-card-foreground">
        <CardHeader className="p-6 pb-4">
          <CardTitle className="text-sm font-bold uppercase tracking-wider">Payment Summary</CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0 space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Transaction ID</span>
              <span className="text-sm font-bold text-foreground">{receiptData?.transactionId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Billing Cycle</span>
              <span className="text-sm font-bold text-foreground">{receiptData?.billingCycle}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Late Days</span>
              <span className="text-sm font-bold text-foreground">{receiptData?.lateDays} Days</span>
            </div>
          </div>
          <Link to={`/admin/fees/history?studentId=${receiptData?.studentId}`} className="block w-full">
            <Button variant="outline" className="w-full bg-muted/50 hover:bg-muted border-none text-foreground font-bold flex items-center justify-center gap-2 h-11 cursor-pointer">
              <Clock className="w-4 h-4" />
              View Payment History
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Need Help */}
      <Card className="border-border shadow-sm rounded-xl bg-card text-card-foreground">
        <CardContent className="p-6 space-y-4">
          <h3 className="text-base font-bold text-foreground">Need Help?</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            If there's any discrepancy in the receipt, please contact support immediately.
          </p>
          <button className="text-sm font-bold text-foreground flex items-center gap-1 hover:underline">
            Open Support Ticket <ArrowRight className="w-4 h-4" />
          </button>
        </CardContent>
      </Card>

      {/* Student Profile */}
      <Card className="border-border shadow-sm rounded-xl bg-foreground text-background">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-6">
            {/* <div className="w-12 h-12 rounded-full bg-background/20 flex items-center justify-center shrink-0">
              <User className="w-6 h-6 text-background" />
            </div> */}
            <div className="w-12 h-12 rounded-full bg-background/20 flex items-center justify-center shrink-0 overflow-hidden">
  {receiptData?.studentPhoto ? (
    <img
      src={receiptData.studentPhoto}
      alt={receiptData.studentName}
      className="w-full h-full object-cover"
    />
  ) : (
    <User className="w-6 h-6 text-background" />
  )}
</div>
            <div>
              <h4 className="text-base font-bold">{receiptData?.studentName}</h4>
              <p className="text-sm text-background/70">{receiptData?.studentCourse}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-background/10 rounded-lg p-3">
              <p className="text-xs text-background/70 mb-1">Room Status</p>
              <p className="text-sm font-bold">{receiptData?.roomStatus}</p>
            </div>
            <div className="bg-background/10 rounded-lg p-3">
              <p className="text-xs text-background/70 mb-1">Dues Left</p>
              <p className="text-sm font-bold">₹{receiptData?.pendingAmount}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
        </div>
      </div>
    </div>
  );
}
