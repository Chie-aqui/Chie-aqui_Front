import Image from "next/image";


export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Image
                  src="/chie_aqui_logo.png"  // caminho relativo à pasta public
                  alt="Logo"
                  width={96}                // equivalente a h-8
                  height={96}               // equivalente a w-8
                  className="rounded-lg object-cover"
                />
            </div>
            <p className="text-sm text-muted-foreground">
              Sua voz importa. Conectamos consumidores e empresas para soluções eficazes.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold">Para Consumidores</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="/reclamar" className="hover:text-primary transition-colors">
                  Fazer Reclamação
                </a>
              </li>
              <li>
                <a href="/empresas" className="hover:text-primary transition-colors">
                  Buscar Empresas
                </a>
              </li>
              <li>
                <a href="/ranking" className="hover:text-primary transition-colors">
                  Ranking
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold">Para Empresas</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="/empresa/cadastro" className="hover:text-primary transition-colors">
                  Cadastrar Empresa
                </a>
              </li>
              <li>
                <a href="/empresa/dashboard" className="hover:text-primary transition-colors">
                  Painel Empresa
                </a>
              </li>
              <li>
                <a href="/planos" className="hover:text-primary transition-colors">
                  Planos
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold">Suporte</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="/ajuda" className="hover:text-primary transition-colors">
                  Central de Ajuda
                </a>
              </li>
              <li>
                <a href="/contato" className="hover:text-primary transition-colors">
                  Contato
                </a>
              </li>
              <li>
                <a href="/termos" className="hover:text-primary transition-colors">
                  Termos de Uso
                </a>
              </li>
              <li>
                <a href="/privacidade" className="hover:text-primary transition-colors">
                  Privacidade
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Chie Aqui. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
