"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Filter, X } from "lucide-react"

interface FilterProps {
  onFilterChange: (filters: any) => void
}

export function ComplaintFilters({ onFilterChange }: FilterProps) {
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)

  const handleStatusFilter = (status: string) => {
    const newFilters = activeFilters.includes(status)
      ? activeFilters.filter((f) => f !== status)
      : [...activeFilters, status]

    setActiveFilters(newFilters)
    onFilterChange({ status: newFilters })
  }

  const clearFilters = () => {
    setActiveFilters([])
    onFilterChange({})
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filtros
          {activeFilters.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeFilters.length}
            </Badge>
          )}
        </Button>

        {activeFilters.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-1" />
            Limpar filtros
          </Button>
        )}
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg bg-muted/30">
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <div className="flex flex-wrap gap-2">
              {["ABERTA", "Em Andamento", "Fechada"].map((status) => (
                <Button
                  key={status}
                  variant={activeFilters.includes(status) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleStatusFilter(status)}
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Ordenar por</label>
            <Select defaultValue="recent">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Mais recentes</SelectItem>
                <SelectItem value="oldest">Mais antigas</SelectItem>
                <SelectItem value="rating-high">Maior avaliação</SelectItem>
                <SelectItem value="rating-low">Menor avaliação</SelectItem>
                <SelectItem value="responses">Mais respostas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Categoria</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Todas as categorias" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                <SelectItem value="ecommerce">E-commerce</SelectItem>
                <SelectItem value="banking">Bancos</SelectItem>
                <SelectItem value="telecom">Telecomunicações</SelectItem>
                <SelectItem value="retail">Varejo</SelectItem>
                <SelectItem value="services">Serviços</SelectItem>
                <SelectItem value="transport">Transporte</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-muted-foreground">Filtros ativos:</span>
          {activeFilters.map((filter) => (
            <Badge key={filter} variant="secondary" className="flex items-center gap-1">
              {filter}
              <X className="h-3 w-3 cursor-pointer" onClick={() => handleStatusFilter(filter)} />
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
