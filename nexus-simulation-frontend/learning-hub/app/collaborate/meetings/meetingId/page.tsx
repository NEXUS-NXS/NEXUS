import type { Metadata } from "next"
import MeetingDetailPageClient from "./MeetingDetailPageClient"

export const metadata: Metadata = {
  title: "Meeting Details | Nexus Learning Hub",
  description: "Detailed information about the selected meeting.",
}

interface PageProps {
  params: {
    meetingId: string
  }
}

export default function MeetingDetailPage({ params }: PageProps) {
  return <MeetingDetailPageClient params={params} />
}
