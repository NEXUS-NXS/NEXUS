import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, Eye, Bookmark, Share2, ArrowLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { newsArticles } from "@/lib/news-data"

interface ArticlePageProps {
  params: {
    articleId: string
  }
}

export default function ArticlePage({ params }: ArticlePageProps) {
  const article = newsArticles.find((a) => a.id === params.articleId)

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Article not found</h1>
          <p className="mt-2">The article you're looking for doesn't exist.</p>
          <Link href="/news" passHref>
            <Button className="mt-4">Back to News</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Get related articles (same category, excluding current)
  const relatedArticles = newsArticles.filter((a) => a.category === article.category && a.id !== article.id).slice(0, 3)

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/news" passHref>
            <Button variant="ghost" className="mb-2">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to News
            </Button>
          </Link>
        </div>

        <article className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Article Header */}
          <div className="relative h-80 w-full">
            <Image
              src={article.image || "/placeholder.svg?height=400&width=800"}
              alt={article.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 text-white">
              <Badge className="mb-2 bg-emerald-500">{article.category}</Badge>
              <h1 className="text-3xl font-bold mb-2">{article.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{formatDate(article.publishedAt)}</span>
                </div>
                <div className="flex items-center">
                  <Eye className="h-4 w-4 mr-1" />
                  <span>{article.views.toLocaleString()} views</span>
                </div>
              </div>
            </div>
          </div>

          {/* Article Content */}
          <div className="p-6 md:p-8">
            {/* Author Info */}
            <div className="flex items-center mb-6">
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src={article.author.avatar || "/placeholder.svg"} alt={article.author.name} />
                <AvatarFallback>{article.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{article.author.name}</div>
                <div className="text-sm text-gray-500">{article.author.title}</div>
              </div>
              <div className="ml-auto flex space-x-2">
                <Button variant="outline" size="sm">
                  <Bookmark className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            {/* Article Body */}
            <div className="prose max-w-none">
              <p className="text-lg font-medium text-gray-700 mb-4">{article.excerpt}</p>

              {article.content.split("\n\n").map((paragraph, index) => (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              ))}

              {/* This would be replaced with actual article content */}
              <div className="my-8 p-6 bg-gray-50 rounded-lg border">
                <h3 className="text-lg font-medium mb-4">Key Takeaways</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    Insurance premiums are expected to rise by 5-7% in the coming year due to inflation and increased
                    claim frequency.
                  </li>
                  <li>Regulatory changes will require more transparent pricing models from insurers.</li>
                  <li>
                    Technology adoption is accelerating, with 65% of insurers planning to increase their digital
                    transformation budgets.
                  </li>
                  <li>
                    Climate risk is becoming a central concern for actuaries and risk managers across the industry.
                  </li>
                </ul>
              </div>

              <p>
                As the industry continues to evolve, professionals will need to stay informed about these trends and
                develop the skills necessary to navigate the changing landscape. Continuing education and professional
                development will be key to success in this dynamic environment.
              </p>
            </div>

            {/* Tags */}
            <div className="mt-8">
              <div className="text-sm font-medium text-gray-500 mb-2">Related Topics:</div>
              <div className="flex flex-wrap gap-2">
                {["Insurance Trends", "Risk Management", "Digital Transformation", "Regulation", "Market Analysis"].map(
                  (tag) => (
                    <Badge key={tag} variant="secondary" className="rounded-full">
                      {tag}
                    </Badge>
                  ),
                )}
              </div>
            </div>
          </div>
        </article>

        {/* Related Articles */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArticles.map((relatedArticle) => (
              <Card key={relatedArticle.id} className="overflow-hidden">
                <div className="relative h-40 w-full">
                  <Image
                    src={relatedArticle.image || "/placeholder.svg?height=160&width=320"}
                    alt={relatedArticle.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <Badge variant="outline" className="mb-2">
                    {relatedArticle.category}
                  </Badge>
                  <Link href={`/news/${relatedArticle.id}`} className="hover:text-emerald-600">
                    <h3 className="font-bold mb-2 line-clamp-2">{relatedArticle.title}</h3>
                  </Link>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{formatDate(relatedArticle.publishedAt)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-center mt-8">
            <Link href="/news" passHref>
              <Button variant="outline">
                View All Articles
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(date)
}
