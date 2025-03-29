"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ArrowLeft,
  Search,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  BarChart3,
  TrendingUp,
  TrendingDown,
} from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"

export default function EventFeedbackPage() {
  const [selectedEvent, setSelectedEvent] = useState("all")

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container px-4 py-8 md:px-6">
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Home
            </Link>
            <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">Event Feedback Analysis</h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Analyze audience sentiment and feedback to improve future events
            </p>
          </div>

          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input type="text" placeholder="Search events" />
              <Button type="submit" size="icon">
                <Search className="h-4 w-4" />
                <span className="sr-only">Search</span>
              </Button>
            </div>

            <Select value={selectedEvent} onValueChange={setSelectedEvent}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Select event" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                <SelectItem value="summer-festival">Summer Music Festival</SelectItem>
                <SelectItem value="tech-conference">Tech Conference 2023</SelectItem>
                <SelectItem value="food-fair">International Food Fair</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Feedback Overview</CardTitle>
                <CardDescription>Summary of audience feedback and sentiment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="flex flex-col items-center justify-center space-y-2 rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
                    <div className="flex items-center space-x-2">
                      <ThumbsUp className="h-5 w-5 text-green-500" />
                      <span className="text-2xl font-bold">78%</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Positive Sentiment</p>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div className="bg-green-500 h-full" style={{ width: "78%" }}></div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center space-y-2 rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
                    <div className="flex items-center space-x-2">
                      <ThumbsDown className="h-5 w-5 text-red-500" />
                      <span className="text-2xl font-bold">12%</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Negative Sentiment</p>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div className="bg-red-500 h-full" style={{ width: "12%" }}></div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center space-y-2 rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="h-5 w-5 text-blue-500" />
                      <span className="text-2xl font-bold">1,245</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Total Feedback</p>
                    <div className="text-xs text-muted-foreground">+15% from previous events</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>Sentiment Trends</CardTitle>
                  <CardDescription>Feedback sentiment over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-[4/3] rounded-lg border bg-muted flex items-center justify-center">
                    <p className="text-muted-foreground">Sentiment trend chart</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>Feedback Categories</CardTitle>
                  <CardDescription>Distribution of feedback by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { category: "Event Organization", percentage: 32, trend: "up" },
                      { category: "Content Quality", percentage: 28, trend: "up" },
                      { category: "Venue & Facilities", percentage: 18, trend: "down" },
                      { category: "Staff & Service", percentage: 12, trend: "up" },
                      { category: "Value for Money", percentage: 10, trend: "down" },
                    ].map((item, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{item.category}</span>
                          <div className="flex items-center">
                            <span className="text-sm text-muted-foreground mr-1">{item.percentage}%</span>
                            {item.trend === "up" ? (
                              <TrendingUp className="h-3 w-3 text-green-500" />
                            ) : (
                              <TrendingDown className="h-3 w-3 text-red-500" />
                            )}
                          </div>
                        </div>
                        <div className="h-2 w-full rounded-full bg-muted">
                          <div className="h-2 rounded-full bg-primary" style={{ width: `${item.percentage}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Feedback Analysis</CardTitle>
                <CardDescription>Detailed analysis of audience feedback</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="comments">
                  <TabsList className="mb-4">
                    <TabsTrigger value="comments">Comments</TabsTrigger>
                    <TabsTrigger value="keywords">Keywords</TabsTrigger>
                    <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
                  </TabsList>

                  <TabsContent value="comments" className="mt-0 space-y-4">
                    {[
                      {
                        text: "The event was well organized and the speakers were excellent. I particularly enjoyed the networking opportunities.",
                        sentiment: "positive",
                        date: "2023-06-15",
                        event: "Tech Conference 2023",
                      },
                      {
                        text: "Great music selection, but the venue was too crowded and the lines for food and drinks were too long.",
                        sentiment: "mixed",
                        date: "2023-07-08",
                        event: "Summer Music Festival",
                      },
                      {
                        text: "The food variety was amazing! I discovered so many new cuisines. Will definitely attend next year.",
                        sentiment: "positive",
                        date: "2023-07-10",
                        event: "International Food Fair",
                      },
                      {
                        text: "The event started late and the sound system had issues. Very disappointing experience overall.",
                        sentiment: "negative",
                        date: "2023-06-18",
                        event: "Summer Music Festival",
                      },
                      {
                        text: "The workshops were informative and the hands-on sessions were very valuable. Great learning experience!",
                        sentiment: "positive",
                        date: "2023-06-23",
                        event: "Tech Conference 2023",
                      },
                    ].map((comment, i) => (
                      <div key={i} className="rounded-lg border p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <p className="text-sm">{comment.text}</p>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-muted-foreground">{comment.event}</span>
                              <span className="text-xs text-muted-foreground">•</span>
                              <span className="text-xs text-muted-foreground">{comment.date}</span>
                            </div>
                          </div>
                          <div
                            className={`rounded-full px-2 py-1 text-xs ${
                              comment.sentiment === "positive"
                                ? "bg-green-100 text-green-800"
                                : comment.sentiment === "negative"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {comment.sentiment}
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="flex justify-center">
                      <Button variant="outline">Load More Comments</Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="keywords" className="mt-0">
                    <div className="flex flex-wrap gap-2">
                      {[
                        { word: "Organized", count: 87, sentiment: "positive" },
                        { word: "Crowded", count: 64, sentiment: "negative" },
                        { word: "Excellent", count: 58, sentiment: "positive" },
                        { word: "Expensive", count: 52, sentiment: "negative" },
                        { word: "Informative", count: 49, sentiment: "positive" },
                        { word: "Fun", count: 45, sentiment: "positive" },
                        { word: "Late", count: 38, sentiment: "negative" },
                        { word: "Engaging", count: 36, sentiment: "positive" },
                        { word: "Innovative", count: 32, sentiment: "positive" },
                        { word: "Disappointing", count: 28, sentiment: "negative" },
                        { word: "Amazing", count: 27, sentiment: "positive" },
                        { word: "Valuable", count: 25, sentiment: "positive" },
                        { word: "Loud", count: 23, sentiment: "negative" },
                        { word: "Interactive", count: 22, sentiment: "positive" },
                        { word: "Inspiring", count: 21, sentiment: "positive" },
                        { word: "Confusing", count: 19, sentiment: "negative" },
                        { word: "Delicious", count: 18, sentiment: "positive" },
                        { word: "Uncomfortable", count: 17, sentiment: "negative" },
                        { word: "Professional", count: 16, sentiment: "positive" },
                        { word: "Overpriced", count: 15, sentiment: "negative" },
                      ].map((keyword, i) => (
                        <div
                          key={i}
                          className={`rounded-full px-3 py-1 text-sm ${
                            keyword.sentiment === "positive" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                          style={{ fontSize: `${Math.max(0.8, Math.min(1.5, 0.8 + keyword.count / 100))}rem` }}
                        >
                          {keyword.word} ({keyword.count})
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="suggestions" className="mt-0">
                    <div className="space-y-4">
                      <div className="rounded-lg border p-4">
                        <h3 className="text-sm font-medium">Improve Venue Facilities</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Based on feedback, consider improving bathroom facilities and adding more seating areas.
                        </p>
                        <div className="mt-2 flex items-center">
                          <BarChart3 className="mr-1 h-4 w-4 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">Mentioned in 32% of negative feedback</span>
                        </div>
                      </div>

                      <div className="rounded-lg border p-4">
                        <h3 className="text-sm font-medium">Reduce Wait Times</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Add more food and beverage stations to reduce lines and wait times.
                        </p>
                        <div className="mt-2 flex items-center">
                          <BarChart3 className="mr-1 h-4 w-4 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">Mentioned in 28% of negative feedback</span>
                        </div>
                      </div>

                      <div className="rounded-lg border p-4">
                        <h3 className="text-sm font-medium">Enhance Sound System</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Invest in better sound equipment and acoustics for music events.
                        </p>
                        <div className="mt-2 flex items-center">
                          <BarChart3 className="mr-1 h-4 w-4 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">Mentioned in 24% of negative feedback</span>
                        </div>
                      </div>

                      <div className="rounded-lg border p-4">
                        <h3 className="text-sm font-medium">Expand Workshop Options</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Add more interactive workshops and hands-on sessions for conferences.
                        </p>
                        <div className="mt-2 flex items-center">
                          <BarChart3 className="mr-1 h-4 w-4 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">Suggested in 18% of positive feedback</span>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

