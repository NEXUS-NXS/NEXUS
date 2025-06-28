import type { Metadata } from "next"
import TutorialDetailPageClient from "./TutotialDetailClient"

export const metadata: Metadata = {
  title: "Interactive Tutorial | Nexus Learning Hub",
  description: "Step-by-step interactive tutorial with hands-on exercises.",
}

interface PageProps {
  params: {
    tutorialId: string
  }
}

export default function TutorialDetailPage({ params }: PageProps) {
  return <TutorialDetailPageClient params={params} />
}
