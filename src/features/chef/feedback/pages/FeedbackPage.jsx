import React from "react";
import {
  Star,
  MessageSquare,
  Smile,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent } from "../../../../components/ui/Card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { Badge } from "../../../../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../admin/Table";

export default function FeedbackPage() {
  const feedbacks = Array(4).fill({
    studentName: "Sandeep Sharma",
    date: "12 June 2026",
    mealName: "Grilled Salmon",
    mealType: "Non-Veg",
    rating: 4,
    sentiment: "POSITIVE",
    comment: "The salmon was perfectly cooked and season...",
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          Feedback Analysis
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Real-time sentiment and quality analysis from the dining hall.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-border shadow-sm rounded-2xl bg-card">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-4">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Overall Rating
                </p>
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-foreground">
                      4.2
                    </span>
                    <span className="text-sm font-semibold text-muted-foreground">
                      / 5.0
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-2 text-green-600 dark:text-green-500 text-sm font-semibold">
                    <TrendingUp className="w-4 h-4" />
                    <span>+0.3 from last week</span>
                  </div>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 flex items-center justify-center">
                <Star className="w-5 h-5 fill-current" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm rounded-2xl bg-card">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-4">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Total Feedbacks
                </p>
                <div>
                  <div className="text-3xl font-bold text-foreground">
                    1,284
                  </div>
                  <p className="text-sm font-medium text-muted-foreground mt-2">
                    Last 30 days active response
                  </p>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm rounded-2xl bg-card">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Positive Sentiment
              </p>
              <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                <Smile className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-foreground mb-4">88%</div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-[#0f1419] dark:bg-white h-2 rounded-full"
                  style={{ width: "88%" }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rating Distribution */}
      <Card className="border-border shadow-sm rounded-2xl bg-card">
        <CardContent className="p-6">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-6">
            Rating Distribution
          </p>
          <div className="space-y-4">
            {[
              { stars: 5, percent: 65 },
              { stars: 4, percent: 20 },
              { stars: 3, percent: 10 },
              { stars: 2, percent: 3 },
              { stars: 1, percent: 2 },
            ].map((item) => (
              <div key={item.stars} className="flex items-center gap-4">
                <span className="text-sm font-medium text-foreground w-12">
                  {item.stars} Star
                </span>
                <div className="flex-1 bg-muted rounded-full h-2.5">
                  <div
                    className="bg-slate-700 dark:bg-slate-300 h-2.5 rounded-full"
                    style={{ width: `${item.percent}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-muted-foreground w-10 text-right">
                  {item.percent}%
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-2 border-y border-border">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-semibold text-foreground mr-2">
            Filter by:
          </span>
          <Select defaultValue="all-rating">
            <SelectTrigger className="w-[140px] bg-transparent border-border rounded-xl h-10">
              <SelectValue placeholder="All Rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-rating">All Rating</SelectItem>
              <SelectItem value="5-star">5 Stars</SelectItem>
              <SelectItem value="4-star">4 Stars</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="all-category">
            <SelectTrigger className="w-[150px] bg-transparent border-border rounded-xl h-10">
              <SelectValue placeholder="All Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-category">All Category</SelectItem>
              <SelectItem value="dairy">Dairy</SelectItem>
              <SelectItem value="protein">Protein</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="last-7-days">
            <SelectTrigger className="w-[150px] bg-transparent border-border rounded-xl h-10">
              <SelectValue placeholder="Last 7 Days" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last-7-days">Last 7 Days</SelectItem>
              <SelectItem value="last-30-days">Last 30 Days</SelectItem>
              <SelectItem value="all-time">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <button className="text-sm font-bold text-foreground hover:underline">
          Clear all filters
        </button>
      </div>

      {/* Detailed Feedback Table */}
      <Card className="border border-border shadow-sm rounded-2xl overflow-hidden bg-card">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">
            Detailed Feedback
          </h2>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/10 border-b border-border">
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs font-bold text-muted-foreground h-14 pl-6">
                  Student & Date
                </TableHead>
                <TableHead className="text-xs font-bold text-muted-foreground h-14">
                  Meal Details
                </TableHead>
                <TableHead className="text-xs font-bold text-muted-foreground h-14">
                  Rating
                </TableHead>
                <TableHead className="text-xs font-bold text-muted-foreground h-14">
                  Sentiment
                </TableHead>
                <TableHead className="text-xs font-bold text-muted-foreground h-14 pr-6">
                  Comments
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {feedbacks.map((item, index) => (
                <TableRow
                  key={index}
                  className="border-border hover:bg-muted/30 transition-colors"
                >
                  <TableCell className="pl-6 py-5">
                    <div className="font-bold text-[14px] text-foreground">
                      {item.studentName}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {item.date}
                    </div>
                  </TableCell>
                  <TableCell className="py-5">
                    <div className="font-bold text-[14px] text-foreground">
                      {item.mealName}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {item.mealType}
                    </div>
                  </TableCell>
                  <TableCell className="py-5">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < item.rating ? "fill-foreground text-foreground" : "text-muted-foreground"}`}
                        />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="py-5">
                    <Badge
                      variant="secondary"
                      className="bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200 text-[10px] font-bold uppercase tracking-wider py-1 px-2.5"
                    >
                      {item.sentiment}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-5 pr-6 w-[400px]">
                    <p className="text-sm text-muted-foreground mb-1">
                      {item.comment}
                    </p>
                    <button className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline">
                      Read More
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-transparent">
          <span className="text-sm font-medium text-muted-foreground">
            Showing 1 to 4 of 24 feedbacks
          </span>
          <div className="flex items-center gap-1.5">
            <button className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg transition-colors cursor-not-allowed opacity-50">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#0f1419] dark:bg-white text-white dark:text-black text-sm font-bold shadow-sm">
              1
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg text-foreground hover:bg-muted text-sm font-medium">
              2
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg text-foreground hover:bg-muted text-sm font-medium">
              3
            </button>
            <span className="px-2 text-muted-foreground">...</span>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg text-foreground hover:bg-muted text-sm font-medium">
              6
            </button>
            <button className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
