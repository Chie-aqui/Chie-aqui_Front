import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, UserIcon, MessageSquare } from "lucide-react"
import Link from "next/link";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ResponseInfo {
  id: number;
  descricao: string;
  data_criacao: string;
  status_resolucao: string;
}

interface ComplaintCardProps {
  complaint: {
    id: number
    titulo: string
    descricao: string
    status: string // Updated to reflect new backend status: ABERTA or ENCERRADA
    data_criacao: string
    usuario_consumidor_nome: string;
    empresa_razao_social: string;
    resposta?: ResponseInfo | null;
  };
  userType?: string; // Add userType prop
}

function getStatusColor(status: string) {
  switch (status) {
    case "Resolvida": // This refers to RespostaReclamacao.status_resolucao
      return "bg-green-100 text-green-800 border-green-200"
    case "Não Resolvida": // This refers to RespostaReclamacao.status_resolucao
      return "bg-red-100 text-red-800 border-red-200"
    case "Em Análise": // This refers to RespostaReclamacao.status_resolucao
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "Aberta": // This refers to Reclamacao.status
      return "bg-red-100 text-red-800 border-red-200"
    case "Encerrada": // This refers to Reclamacao.status
      return "bg-gray-100 text-gray-800 border-gray-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

export function ComplaintCard({ complaint, userType }: ComplaintCardProps) {
  const isValidDate = (dateString: string) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  };

  return (
    <Card className="hover:shadow-md transition-all duration-200 hover:border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={getStatusColor(complaint.status)}>{complaint.status}</Badge>
            </div>
            <CardTitle className="text-lg mb-2 text-balance line-clamp-2">{complaint.titulo}</CardTitle>
            <CardDescription className="text-sm text-gray-500">Empresa: {complaint.empresa_razao_social}</CardDescription>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{complaint.descricao}</p>
            <div className="flex items-center flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center">
                <UserIcon className="h-4 w-4 mr-1" />
                {complaint.usuario_consumidor_nome}
              </span>
              <span className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {isValidDate(complaint.data_criacao)
                  ? format(new Date(complaint.data_criacao), 'dd/MM/yyyy', { locale: ptBR })
                  : 'Data inválida'}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {complaint.resposta && isValidDate(complaint.resposta.data_criacao) && (
          <div className="mt-4 border-t pt-4">
            <h4 className="text-md font-semibold mb-2">Resposta da Empresa:</h4>
            <p className="text-sm text-muted-foreground line-clamp-3 mb-2">{complaint.resposta.descricao}</p>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Status: {complaint.resposta.status_resolucao}</span>
              <span>
                {format(new Date(complaint.resposta.data_criacao), 'dd/MM/yyyy', { locale: ptBR })}
              </span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-4 space-x-2">
          <Link href={`/reclamacao/${complaint.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              Ver Detalhes
            </Button>
          </Link>
          {userType === "company" && complaint.status === 'ABERTA' && (
            <Link href={`/empresa/dashboard/responder/${complaint.id}`} className="flex-1">
              <Button variant="default" size="sm" className="w-full bg-blue-500 hover:bg-blue-600">
                Responder
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
