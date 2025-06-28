import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, TrendingUp, Clock, Bookmark, Share2, ChevronRight, Mail } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { newsArticles } from "@/lib/news-data"

export default function NewsPage() {
  // Get featured articles (first 3)
  const featuredArticles = newsArticles.filter((article) => article.featured).slice(0, 3)

  // Get trending articles (most views)
  const trendingArticles = [...newsArticles].sort((a, b) => b.views - a.views).slice(0, 4)

  // Get latest articles
  const latestArticles = [...newsArticles]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 6)

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Industry News & Insights</h1>
          <p className="mt-3 text-xl text-gray-500">
            Stay updated with the latest trends and developments in insurance, finance, and actuarial science
          </p>
        </div>

        {/* Featured News Section */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {featuredArticles.map((article, index) => (
              <Card key={article.id} className={`overflow-hidden ${index === 0 ? "lg:col-span-2 lg:row-span-2" : ""}`}>
                <div className={`relative ${index === 0 ? "h-80" : "h-48"} w-full`}>
                  <Image
                    src={article.image || "/placeholder.svg?height=400&width=600"}
                    alt={article.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6 text-white">
                    <Badge className="mb-2 bg-emerald-500">{article.category}</Badge>
                    <h2 className={`font-bold ${index === 0 ? "text-2xl" : "text-xl"} mb-2`}>{article.title}</h2>
                    {index === 0 && <p className="text-gray-200 line-clamp-2">{article.excerpt}</p>}
                    <div className="flex items-center mt-2 text-sm">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{formatDate(article.publishedAt)}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="all">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <TabsList className="bg-white">
                  <TabsTrigger value="all">All News</TabsTrigger>
                  <TabsTrigger value="insurance">Insurance</TabsTrigger>
                  <TabsTrigger value="finance">Finance</TabsTrigger>
                  <TabsTrigger value="actuarial">Actuarial</TabsTrigger>
                </TabsList>

                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input placeholder="Search news..." className="pl-10" />
                </div>
              </div>

              <TabsContent value="all" className="mt-0 space-y-6">
                {latestArticles.map((article) => (
                  <NewsCard key={article.id} article={article} />
                ))}

                <div className="flex justify-center mt-8">
                  <Button variant="outline" className="gap-2">
                    Load More Articles
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="insurance" className="mt-0 space-y-6">
                {latestArticles
                  .filter((article) => article.category === "Insurance")
                  .map((article) => (
                    <NewsCard key={article.id} article={article} />
                  ))}
              </TabsContent>

              <TabsContent value="finance" className="mt-0 space-y-6">
                {latestArticles
                  .filter((article) => article.category === "Finance")
                  .map((article) => (
                    <NewsCard key={article.id} article={article} />
                  ))}
              </TabsContent>

              <TabsContent value="actuarial" className="mt-0 space-y-6">
                {latestArticles
                  .filter((article) => article.category === "Actuarial")
                  .map((article) => (
                    <NewsCard key={article.id} article={article} />
                  ))}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Trending Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center">
                  <TrendingUp className="h-5 w-5 text-emerald-600 mr-2" />
                  <CardTitle>Trending Now</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {trendingArticles.map((article, index) => (
                  <div key={article.id} className="flex gap-4">
                    <div className="flex-shrink-0 font-bold text-2xl text-gray-300">{index + 1}</div>
                    <div>
                      <Link href={`/news/${article.id}`} className="font-medium hover:text-emerald-600 line-clamp-2">
                        {article.title}
                      </Link>
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <Badge variant="outline" className="mr-2 text-xs">
                          {article.category}
                        </Badge>
                        <span>{formatDate(article.publishedAt)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Newsletter Signup */}
            <Card className="bg-emerald-50 border-emerald-100">
              <CardHeader>
                <CardTitle>Newsletter</CardTitle>
                <CardDescription>Get the latest news delivered to your inbox</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Input placeholder="Your email address" type="email" />
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                    <Mail className="mr-2 h-4 w-4" />
                    Subscribe
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {["Insurance", "Finance", "Actuarial", "Risk Management", "Investments", "Regulation"].map(
                    (category) => (
                      <Link
                        key={category}
                        href={`/news?category=${category.toLowerCase()}`}
                        className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-md"
                      >
                        <span>{category}</span>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </Link>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

interface NewsCardProps {
  article: (typeof newsArticles)[0]
}

function NewsCard({ article }: NewsCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <div className="relative h-48 md:h-auto md:w-64 flex-shrink-0">
          <Image
            src={article.image || "/placeholder.svg?height=240&width=320"}
            alt={article.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1 p-6">
          <CardHeader className="p-0 pb-2">
            <div className="flex items-center justify-between">
              <Badge variant="outline">{article.category}</Badge>
              <div className="text-sm text-gray-500 flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {formatDate(article.publishedAt)}
              </div>
            </div>
            <Link href={`/news/${article.id}`} className="hover:text-emerald-600">
              <CardTitle className="mt-2 text-xl">{article.title}</CardTitle>
            </Link>
          </CardHeader>
          <CardContent className="p-0 py-2">
            <p className="text-gray-600 line-clamp-2">{article.excerpt}</p>
          </CardContent>
          <CardFooter className="p-0 pt-4 flex items-center justify-between">
            <div className="flex items-center">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src={article.author.avatar || "/placeholder.svg"} alt={article.author.name} />
                <AvatarFallback>{article.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{article.author.name}</span>
            </div>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon">
                <Bookmark className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </div>
      </div>
    </Card>
  )
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(date)
}
