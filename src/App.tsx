import { useState, useCallback } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Package, 
  Scissors, 
  FileText, 
  Plus, 
  BarChart3,
  Menu,
  X,
  Check,
  AlertCircle
} from 'lucide-react';
import type { Pedido, Molde } from '@/types';
import { usePedidos, useMoldes } from '@/hooks/useStorage';
import FormularioPedido from '@/sections/FormularioPedido';
import AreaCorte from '@/sections/AreaCorte';
import AdminMoldes from '@/sections/AdminMoldes';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';

function App() {
  const [activeTab, setActiveTab] = useState('nuevo-pedido');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  const { 
    pedidos, 
    crearPedido, 
    cambiarEstadoPedido, 
    getEstadisticas: getPedidosStats 
  } = usePedidos();

  const { 
    moldes, 
    crearMolde, 
    eliminarMolde, 
    buscarMoldePorVehiculo,
    getEstadisticas: getMoldesStats 
  } = useMoldes();

  // Estadísticas
  const pedidosStats = getPedidosStats();
  const moldesStats = getMoldesStats();

  // Crear pedido con búsqueda automática de molde
  const handleCrearPedido = useCallback((pedidoData: Omit<Pedido, 'id' | 'fechaCreacion' | 'estado'>) => {
    // Buscar si existe molde para este vehículo
    const moldeExistente = buscarMoldePorVehiculo(pedidoData.vehiculo);
    
    const nuevoPedido = crearPedido({
      ...pedidoData,
      moldeAsociado: moldeExistente
    });

    if (moldeExistente) {
      toast.success('¡Pedido creado exitosamente!', {
        description: `Se encontró y asoció automáticamente el molde para ${pedidoData.vehiculo.marca} ${pedidoData.vehiculo.modelo}.`,
        duration: 5000,
      });
    } else {
      toast.success('Pedido creado exitosamente', {
        description: `Pedido ${nuevoPedido.id} creado. No se encontró molde para este vehículo.`,
        duration: 5000,
      });
    }

    // Cambiar a la pestaña de pedidos
    setActiveTab('area-corte');
  }, [crearPedido, buscarMoldePorVehiculo]);

  // Cambiar estado de pedido
  const handleCambiarEstado = useCallback((id: string, nuevoEstado: Pedido['estado']) => {
    cambiarEstadoPedido(id, nuevoEstado);
    
    const estadoLabels: Record<string, string> = {
      'pendiente': 'Pendiente',
      'en_corte': 'En Corte',
      'en_confeccion': 'En Confección',
      'terminado': 'Terminado',
      'entregado': 'Entregado'
    };

    toast.info(`Estado actualizado`, {
      description: `El pedido ${id} ahora está: ${estadoLabels[nuevoEstado]}`,
    });
  }, [cambiarEstadoPedido]);

  // Crear molde
  const handleCrearMolde = useCallback((moldeData: Omit<Molde, 'id' | 'fechaSubida'>) => {
    crearMolde(moldeData);
    toast.success('Molde subido exitosamente', {
      description: `El molde para ${moldeData.vehiculo.marca} ${moldeData.vehiculo.modelo} (${moldeData.vehiculo.año}) ha sido guardado.`,
      duration: 5000,
    });
  }, [crearMolde]);

  // Eliminar molde
  const handleEliminarMolde = useCallback((id: string) => {
    eliminarMolde(id);
    toast.success('Molde eliminado', {
      description: 'El molde ha sido eliminado de la biblioteca.',
    });
  }, [eliminarMolde]);

  // Menú de navegación
  const menuItems = [
    { 
      id: 'nuevo-pedido', 
      label: 'Nuevo Pedido', 
      icon: Plus,
      description: 'Crear un nuevo pedido de forros'
    },
    { 
      id: 'area-corte', 
      label: 'Área de Corte', 
      icon: Scissors,
      description: 'Gestionar pedidos y descargar moldes',
      badge: pedidosStats.pendientes > 0 ? pedidosStats.pendientes : undefined
    },
    { 
      id: 'moldes', 
      label: 'Biblioteca de Moldes', 
      icon: FileText,
      description: 'Administrar patrones de corte PDF',
      badge: moldesStats.total
    },
    { 
      id: 'estadisticas', 
      label: 'Estadísticas', 
      icon: BarChart3,
      description: 'Ver métricas del negocio'
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" richColors />

      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <Scissors className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">ForrosPro</h1>
                <p className="text-xs text-gray-500">Sistema de Gestión de Cojinería</p>
              </div>
            </div>

            {/* Stats rápidas - Desktop */}
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg">
                <Package className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">
                  {pedidosStats.pendientes} pedidos pendientes
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-lg">
                <FileText className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-900">
                  {moldesStats.total} moldes
                </span>
              </div>
            </div>

            {/* Menú móvil */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Menú móvil desplegable */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <div className="px-4 py-3 space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === item.id 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                  {item.badge !== undefined && (
                    <Badge variant={activeTab === item.id ? 'default' : 'secondary'} className="ml-auto">
                      {item.badge}
                    </Badge>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                    activeTab === item.id 
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-200' 
                      : 'bg-white hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-white' : 'text-gray-500'}`} />
                  <div className="flex-1">
                    <span className="font-medium block">{item.label}</span>
                    <span className={`text-xs ${activeTab === item.id ? 'text-blue-100' : 'text-gray-400'}`}>
                      {item.description}
                    </span>
                  </div>
                  {item.badge !== undefined && (
                    <Badge 
                      variant={activeTab === item.id ? 'secondary' : 'default'}
                      className={activeTab === item.id ? 'bg-white/20 text-white' : ''}
                    >
                      {item.badge}
                    </Badge>
                  )}
                </button>
              ))}
            </div>
          </aside>

          {/* Área de contenido */}
          <div className="flex-1 min-w-0">
            {/* Tab: Nuevo Pedido */}
            {activeTab === 'nuevo-pedido' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Nuevo Pedido</h2>
                    <p className="text-gray-500">Complete el formulario para crear un nuevo pedido de forros</p>
                  </div>
                </div>
                <FormularioPedido 
                  onSubmit={handleCrearPedido}
                />
              </div>
            )}

            {/* Tab: Área de Corte */}
            {activeTab === 'area-corte' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Área de Corte</h2>
                    <p className="text-gray-500">Gestione los pedidos y descargue los moldes para corte</p>
                  </div>
                </div>
                <AreaCorte 
                  pedidos={pedidos}
                  onCambiarEstado={handleCambiarEstado}
                />
              </div>
            )}

            {/* Tab: Biblioteca de Moldes */}
            {activeTab === 'moldes' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Biblioteca de Moldes</h2>
                    <p className="text-gray-500">Administre los patrones de corte PDF para cada vehículo</p>
                  </div>
                </div>
                <AdminMoldes 
                  moldes={moldes}
                  onCrearMolde={handleCrearMolde}
                  onEliminarMolde={handleEliminarMolde}
                />
              </div>
            )}

            {/* Tab: Estadísticas */}
            {activeTab === 'estadisticas' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Estadísticas</h2>
                    <p className="text-gray-500">Métricas y análisis del negocio</p>
                  </div>
                </div>

                {/* Estadísticas de pedidos */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
                    <CardContent className="p-6">
                      <p className="text-sm opacity-80">Pedidos Pendientes</p>
                      <p className="text-4xl font-bold">{pedidosStats.pendientes}</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    <CardContent className="p-6">
                      <p className="text-sm opacity-80">En Proceso</p>
                      <p className="text-4xl font-bold">
                        {pedidosStats.enCorte + pedidosStats.enConfeccion}
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                    <CardContent className="p-6">
                      <p className="text-sm opacity-80">Terminados</p>
                      <p className="text-4xl font-bold">{pedidosStats.terminados}</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-gray-500 to-gray-600 text-white">
                    <CardContent className="p-6">
                      <p className="text-sm opacity-80">Entregados</p>
                      <p className="text-4xl font-bold">{pedidosStats.entregados}</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Estadísticas de moldes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Moldes por Tipo de Vehículo</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {Object.entries(moldesStats.porTipo)
                          .sort((a, b) => b[1] - a[1])
                          .map(([tipo, count]) => (
                            <div key={tipo} className="flex items-center justify-between">
                              <span>{tipo}</span>
                              <div className="flex items-center gap-3">
                                <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-blue-500 rounded-full"
                                    style={{ width: `${(count / moldesStats.total) * 100}%` }}
                                  />
                                </div>
                                <Badge>{count}</Badge>
                              </div>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Top Marcas con Moldes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {moldesStats.topMarcas.map(([marca, count]) => (
                          <div key={marca} className="flex items-center justify-between">
                            <span>{marca}</span>
                            <div className="flex items-center gap-3">
                              <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-green-500 rounded-full"
                                  style={{ width: `${(count / moldesStats.total) * 100}%` }}
                                />
                              </div>
                              <Badge>{count}</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Resumen general */}
                <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <CardContent className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                      <div>
                        <p className="text-5xl font-bold">{pedidosStats.total}</p>
                        <p className="text-lg mt-2 opacity-90">Total Pedidos</p>
                      </div>
                      <div>
                        <p className="text-5xl font-bold">{moldesStats.total}</p>
                        <p className="text-lg mt-2 opacity-90">Moldes en Biblioteca</p>
                      </div>
                      <div>
                        <p className="text-5xl font-bold">
                          {pedidosStats.total > 0 
                            ? Math.round((pedidosStats.entregados / pedidosStats.total) * 100) 
                            : 0}%
                        </p>
                        <p className="text-lg mt-2 opacity-90">Tasa de Entrega</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Dialog de bienvenida */}
      <Dialog open={showWelcome} onOpenChange={setShowWelcome}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <Scissors className="w-6 h-6 text-white" />
              </div>
              ¡Bienvenido a ForrosPro!
            </DialogTitle>
            <DialogDescription className="text-base">
              Su sistema completo de gestión para cojinería de autos
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Alert className="bg-blue-50 border-blue-200">
              <Check className="w-4 h-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>Su activo más importante:</strong> Los moldes PDF que el sistema relaciona automáticamente con cada vehículo.
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <h4 className="font-semibold">¿Qué puede hacer con ForrosPro?</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Plus className="w-4 h-4 text-green-500 mt-0.5" />
                  <span><strong>Crear pedidos</strong> con datos del cliente, vehículo y fotos de los asientos</span>
                </li>
                <li className="flex items-start gap-2">
                  <Scissors className="w-4 h-4 text-blue-500 mt-0.5" />
                  <span><strong>Gestionar el área de corte</strong> con descarga automática de moldes</span>
                </li>
                <li className="flex items-start gap-2">
                  <FileText className="w-4 h-4 text-orange-500 mt-0.5" />
                  <span><strong>Construir su biblioteca de moldes</strong> para todos los vehículos de Colombia</span>
                </li>
                <li className="flex items-start gap-2">
                  <BarChart3 className="w-4 h-4 text-purple-500 mt-0.5" />
                  <span><strong>Ver estadísticas</strong> y métricas de su negocio en tiempo real</span>
                </li>
              </ul>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-800">Consejo importante</p>
                  <p className="text-sm text-yellow-700">
                    Comience subiendo los moldes PDF de sus vehículos más comunes. 
                    El sistema los relacionará automáticamente con los pedidos futuros.
                  </p>
                </div>
              </div>
            </div>

            <Button 
              onClick={() => setShowWelcome(false)} 
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700"
            >
              Comenzar a usar ForrosPro
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Componente Card simplificado
function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border ${className}`}>
      {children}
    </div>
  );
}

function CardHeader({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`p-6 pb-0 ${className}`}>
      {children}
    </div>
  );
}

function CardTitle({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <h3 className={`text-lg font-semibold ${className}`}>
      {children}
    </h3>
  );
}

function CardContent({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
}

export default App;
