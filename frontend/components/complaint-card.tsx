import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, MessageSquare, Calendar, Building2, Eye, ThumbsUp, ThumbsDown } from "lucide-react"

interface ComplaintCardProps {
  complaint: {
    id: number
    title: string
    company: string
    status: string
    date: string
    rating: number
    responses: number
    category: string
    excerpt: string
    helpful: number
    notHelpful: number
    views: number
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case "Resolvida":
      return "bg-green-100 text-green-800 border-green-200"
    case "Respondida":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "Em análise":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "Pendente":
      return "bg-red-100 text-red-800 border-red-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

function getCategoryColor(category: string) {
  const colors = {
    "E-commerce": "bg-purple-100 text-purple-800",
    Bancos: "bg-blue-100 text-blue-800",
    Telecomunicações: "bg-orange-100 text-orange-800",
    Varejo: "bg-green-100 text-green-800",
    Serviços: "bg-indigo-100 text-indigo-800",
    Transporte: "bg-red-100 text-red-800",
  }
  return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
        />
      ))}
      <span className="text-sm text-muted-foreground ml-1">({rating}/5)</span>
    </div>
  )
}

export function ComplaintCard({ complaint }: ComplaintCardProps) {
  return (
    <Card className="hover:shadow-md transition-all duration-200 hover:border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={getCategoryColor(complaint.category)} variant="secondary">
                {complaint.category}
              </Badge>
              <Badge className={getStatusColor(complaint.status)}>{complaint.status}</Badge>
            </div>
            <CardTitle className="text-lg mb-2 text-balance line-clamp-2">{complaint.title}</CardTitle>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{complaint.excerpt}</p>
            <div className="flex items-center flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center">
                <Building2 className="h-4 w-4 mr-1" />
                {complaint.company}
              </span>
              <span className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {new Date(complaint.date).toLocaleDateString("pt-BR")}
              </span>
              <span className="flex items-center">
                <MessageSquare className="h-4 w-4 mr-1" />
                {complaint.responses} respostas
              </span>
              <span className="flex items-center">
                <Eye className="h-4 w-4 mr-1" />
                {complaint.views} visualizações
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-3">
            <StarRating rating={complaint.rating} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span className="flex items-center">
              <ThumbsUp className="h-4 w-4 mr-1" />
              {complaint.helpful}
            </span>
            <span className="flex items-center">
              <ThumbsDown className="h-4 w-4 mr-1" />
              {complaint.notHelpful}
            </span>
          </div>
          <Button variant="outline" size="sm">
            Ver detalhes
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
