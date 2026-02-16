import { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Scissors, 
  Search, 
  Eye, 
  Download, 
  Check, 
  Clock, 
  Package,
  Truck,
  AlertCircle,
  FileText,
  Car,
  User,
  Phone,
  MapPin,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Filter
} from 'lucide-react';
import { ESTADOS_PEDIDO } from '@/types';
import type { Pedido } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AreaCorteProps {
  pedidos: Pedido[];
  onCambiarEstado: (id: string, estado: Pedido['estado']) => void;
}

export default function AreaCorte({ pedidos, onCambiarEstado }: AreaCorteProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState<Pedido['estado'] | 'todos'>('todos');
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState<Pedido | null>(null);
  const [previewFoto, setPreviewFoto] = useState<string | null>(null);
  const [currentFotoIndex, setCurrentFotoIndex] = useState(0);

  // Filtrar pedidos
  const pedidosFiltrados = useMemo(() => {
    let filtered = pedidos;

    // Filtrar por estado
    if (estadoFiltro !== 'todos') {
      filtered = filtered.filter(p => p.estado === estadoFiltro);
    }

    // Filtrar por búsqueda
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.id.toLowerCase().includes(query) ||
        p.cliente.nombre.toLowerCase().includes(query) ||
        p.cliente.telefono.includes(query) ||
        p.vehiculo.marca.toLowerCase().includes(query) ||
        p.vehiculo.modelo.toLowerCase().includes(query)
      );
    }

    // Ordenar por fecha (más recientes primero)
    return filtered.sort((a, b) => 
      new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime()
    );
  }, [pedidos, estadoFiltro, searchQuery]);

  // Estadísticas
  const estadisticas = useMemo(() => {
    return {
      total: pedidos.length,
      pendientes: pedidos.filter(p => p.estado === 'pendiente').length,
      enCorte: pedidos.filter(p => p.estado === 'en_corte').length,
      enConfeccion: pedidos.filter(p => p.estado === 'en_confeccion').length,
      terminados: pedidos.filter(p => p.estado === 'terminado').length,
      entregados: pedidos.filter(p => p.estado === 'entregado').length,
    };
  }, [pedidos]);

  // Obtener color y label del estado
  const getEstadoInfo = useCallback((estado: Pedido['estado']) => {
    return ESTADOS_PEDIDO.find(e => e.value === estado) || ESTADOS_PEDIDO[0];
  }, []);

  // Formatear fecha
  const formatFecha = useCallback((fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }, []);

  // Siguiente estado
  const getSiguienteEstado = useCallback((estadoActual: Pedido['estado']): Pedido['estado'] | null => {
    const estados: Pedido['estado'][] = ['pendiente', 'en_corte', 'en_confeccion', 'terminado', 'entregado'];
    const index = estados.indexOf(estadoActual);
    return index < estados.length - 1 ? estados[index + 1] : null;
  }, []);

  // Estado anterior
  const getEstadoAnterior = useCallback((estadoActual: Pedido['estado']): Pedido['estado'] | null => {
    const estados: Pedido['estado'][] = ['pendiente', 'en_corte', 'en_confeccion', 'terminado', 'entregado'];
    const index = estados.indexOf(estadoActual);
    return index > 0 ? estados[index - 1] : null;
  }, []);

  // Navegar fotos
  const nextFoto = useCallback(() => {
    if (pedidoSeleccionado && currentFotoIndex < pedidoSeleccionado.fotos.length - 1) {
      setCurrentFotoIndex(prev => prev + 1);
    }
  }, [pedidoSeleccionado, currentFotoIndex]);

  const prevFoto = useCallback(() => {
    if (currentFotoIndex > 0) {
      setCurrentFotoIndex(prev => prev - 1);
    }
  }, [currentFotoIndex]);

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">Total</p>
                <p className="text-2xl font-bold">{estadisticas.total}</p>
              </div>
              <Package className="w-8 h-8 opacity-50" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">Pendientes</p>
                <p className="text-2xl font-bold">{estadisticas.pendientes}</p>
              </div>
              <Clock className="w-8 h-8 opacity-50" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">En Corte</p>
                <p className="text-2xl font-bold">{estadisticas.enCorte}</p>
              </div>
              <Scissors className="w-8 h-8 opacity-50" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">En Confección</p>
                <p className="text-2xl font-bold">{estadisticas.enConfeccion}</p>
              </div>
              <Package className="w-8 h-8 opacity-50" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">Terminados</p>
                <p className="text-2xl font-bold">{estadisticas.terminados}</p>
              </div>
              <Check className="w-8 h-8 opacity-50" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-gray-500 to-gray-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">Entregados</p>
                <p className="text-2xl font-bold">{estadisticas.entregados}</p>
              </div>
              <Truck className="w-8 h-8 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar por ID, cliente, teléfono o vehículo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <Select value={estadoFiltro} onValueChange={(v) => setEstadoFiltro(v as Pedido['estado'] | 'todos')}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los estados</SelectItem>
                  {ESTADOS_PEDIDO.map((estado) => (
                    <SelectItem key={estado.value} value={estado.value}>
                      {estado.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de pedidos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scissors className="w-5 h-5" />
            Pedidos ({pedidosFiltrados.length})
          </CardTitle>
          <CardDescription>
            Gestione los pedidos y descargue los moldes para corte
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pedidosFiltrados.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No hay pedidos para mostrar</p>
              <p className="text-gray-400 text-sm">
                {searchQuery || estadoFiltro !== 'todos' 
                  ? 'Pruebe con otros filtros de búsqueda' 
                  : 'Los pedidos aparecerán aquí cuando se creen'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {pedidosFiltrados.map((pedido) => {
                const estadoInfo = getEstadoInfo(pedido.estado);
                const siguienteEstado = getSiguienteEstado(pedido.estado);
                const estadoAnterior = getEstadoAnterior(pedido.estado);

                return (
                  <div 
                    key={pedido.id} 
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Info principal */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-mono font-bold text-lg text-blue-600">
                            {pedido.id}
                          </span>
                          <Badge className={estadoInfo.color}>
                            {estadoInfo.label}
                          </Badge>
                          {pedido.moldeAsociado && (
                            <Badge variant="outline" className="border-green-500 text-green-600">
                              <FileText className="w-3 h-3 mr-1" />
                              Molde disponible
                            </Badge>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="font-medium">{pedido.cliente.nombre}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span>{pedido.cliente.telefono}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Car className="w-4 h-4 text-gray-400" />
                            <span>
                              {pedido.vehiculo.marca} {pedido.vehiculo.modelo} ({pedido.vehiculo.año})
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-500">
                              {formatFecha(pedido.fechaCreacion)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Acciones */}
                      <div className="flex flex-wrap items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setPedidoSeleccionado(pedido);
                            setCurrentFotoIndex(0);
                          }}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Ver Detalles
                        </Button>

                        {pedido.moldeAsociado && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-green-500 text-green-600 hover:bg-green-50"
                            onClick={() => {
                              // Simular descarga
                              const link = document.createElement('a');
                              link.href = pedido.moldeAsociado!.url;
                              link.download = pedido.moldeAsociado!.nombreArchivo;
                              link.click();
                            }}
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Descargar Molde
                          </Button>
                        )}

                        {/* Botones de cambio de estado */}
                        {estadoAnterior && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onCambiarEstado(pedido.id, estadoAnterior!)}
                            className="text-gray-500"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </Button>
                        )}

                        {siguienteEstado && (
                          <Button
                            size="sm"
                            onClick={() => onCambiarEstado(pedido.id, siguienteEstado)}
                            className="bg-gradient-to-r from-blue-600 to-blue-700"
                          >
                            {siguienteEstado === 'en_corte' && <Scissors className="w-4 h-4 mr-1" />}
                            {siguienteEstado === 'en_confeccion' && <Package className="w-4 h-4 mr-1" />}
                            {siguienteEstado === 'terminado' && <Check className="w-4 h-4 mr-1" />}
                            {siguienteEstado === 'entregado' && <Truck className="w-4 h-4 mr-1" />}
                            {ESTADOS_PEDIDO.find(e => e.value === siguienteEstado)?.label}
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de detalles del pedido */}
      <Dialog 
        open={!!pedidoSeleccionado} 
        onOpenChange={() => {
          setPedidoSeleccionado(null);
          setCurrentFotoIndex(0);
        }}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          {pedidoSeleccionado && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <span className="font-mono">{pedidoSeleccionado.id}</span>
                  <Badge className={getEstadoInfo(pedidoSeleccionado.estado).color}>
                    {getEstadoInfo(pedidoSeleccionado.estado).label}
                  </Badge>
                </DialogTitle>
                <DialogDescription>
                  Creado el {formatFecha(pedidoSeleccionado.fechaCreacion)}
                </DialogDescription>
              </DialogHeader>

              <ScrollArea className="max-h-[70vh]">
                <div className="space-y-6">
                  {/* Información del cliente */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <User className="w-5 h-5 text-blue-600" />
                      Información del Cliente
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                      <div>
                        <p className="text-sm text-gray-500">Nombre</p>
                        <p className="font-medium">{pedidoSeleccionado.cliente.nombre}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Teléfono</p>
                        <p className="font-medium">{pedidoSeleccionado.cliente.telefono}</p>
                      </div>
                      {pedidoSeleccionado.cliente.direccion && (
                        <div className="md:col-span-2">
                          <p className="text-sm text-gray-500">Dirección</p>
                          <p className="font-medium flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            {pedidoSeleccionado.cliente.direccion}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* Información del vehículo */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Car className="w-5 h-5 text-green-600" />
                      Información del Vehículo
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-lg">
                      <div>
                        <p className="text-sm text-gray-500">Tipo</p>
                        <p className="font-medium">{pedidoSeleccionado.vehiculo.tipo}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Marca</p>
                        <p className="font-medium">{pedidoSeleccionado.vehiculo.marca}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Modelo</p>
                        <p className="font-medium">{pedidoSeleccionado.vehiculo.modelo}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Año</p>
                        <p className="font-medium">{pedidoSeleccionado.vehiculo.año}</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Molde asociado */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-orange-600" />
                      Molde de Corte
                    </h3>
                    {pedidoSeleccionado.moldeAsociado ? (
                      <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-green-800">
                              {pedidoSeleccionado.moldeAsociado.nombreArchivo}
                            </p>
                            <p className="text-sm text-green-600">
                              Subido el {formatFecha(pedidoSeleccionado.moldeAsociado.fechaSubida)}
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            className="border-green-500 text-green-600 hover:bg-green-100"
                            onClick={() => {
                              const link = document.createElement('a');
                              link.href = pedidoSeleccionado.moldeAsociado!.url;
                              link.download = pedidoSeleccionado.moldeAsociado!.nombreArchivo;
                              link.click();
                            }}
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Descargar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Alert className="bg-yellow-50 border-yellow-200">
                        <AlertCircle className="w-4 h-4 text-yellow-600" />
                        <AlertDescription className="text-yellow-800">
                          No hay molde asociado a este pedido. 
                          El área de diseño debe crear y subir el molde para este vehículo.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>

                  <Separator />

                  {/* Fotos */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <ImageIcon className="w-5 h-5 text-purple-600" />
                      Fotos de los Asientos ({pedidoSeleccionado.fotos.length})
                    </h3>
                    
                    {pedidoSeleccionado.fotos.length > 0 && (
                      <div className="space-y-3">
                        {/* Preview principal */}
                        <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={pedidoSeleccionado.fotos[currentFotoIndex]}
                            alt={`Foto ${currentFotoIndex + 1}`}
                            className="w-full h-full object-contain cursor-pointer"
                            onClick={() => setPreviewFoto(pedidoSeleccionado.fotos[currentFotoIndex])}
                          />
                          
                          {pedidoSeleccionado.fotos.length > 1 && (
                            <>
                              <button
                                onClick={prevFoto}
                                disabled={currentFotoIndex === 0}
                                className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center disabled:opacity-30 hover:bg-black/70 transition-colors"
                              >
                                <ChevronLeft className="w-6 h-6" />
                              </button>
                              <button
                                onClick={nextFoto}
                                disabled={currentFotoIndex === pedidoSeleccionado.fotos.length - 1}
                                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center disabled:opacity-30 hover:bg-black/70 transition-colors"
                              >
                                <ChevronRight className="w-6 h-6" />
                              </button>
                            </>
                          )}
                          
                          <div className="absolute bottom-2 right-2 bg-black/50 text-white text-sm px-3 py-1 rounded-full">
                            {currentFotoIndex + 1} / {pedidoSeleccionado.fotos.length}
                          </div>
                        </div>

                        {/* Thumbnails */}
                        {pedidoSeleccionado.fotos.length > 1 && (
                          <div className="flex gap-2 overflow-x-auto pb-2">
                            {pedidoSeleccionado.fotos.map((foto, index) => (
                              <button
                                key={index}
                                onClick={() => setCurrentFotoIndex(index)}
                                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                                  index === currentFotoIndex 
                                    ? 'border-blue-500' 
                                    : 'border-transparent hover:border-gray-300'
                                }`}
                              >
                                <img
                                  src={foto}
                                  alt={`Thumbnail ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Notas */}
                  {pedidoSeleccionado.notas && (
                    <>
                      <Separator />
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Notas Adicionales</h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-gray-700 whitespace-pre-wrap">
                            {pedidoSeleccionado.notas}
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </ScrollArea>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de preview de foto */}
      <Dialog open={!!previewFoto} onOpenChange={() => setPreviewFoto(null)}>
        <DialogContent className="max-w-5xl max-h-[95vh] p-0">
          {previewFoto && (
            <img
              src={previewFoto}
              alt="Preview"
              className="w-full h-full object-contain max-h-[90vh]"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
