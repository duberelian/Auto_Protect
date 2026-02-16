import { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  FileText, 
  Upload, 
  Search, 
  Trash2, 
  Download, 
  Plus,
  Car,
  AlertCircle,
  FolderOpen,
  Eye
} from 'lucide-react';
import { VEHICULOS_COLOMBIA, AÑOS_DISPONIBLES } from '@/types';
import type { Molde, Vehiculo } from '@/types';
import { useFileConverter } from '@/hooks/useStorage';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

interface AdminMoldesProps {
  moldes: Molde[];
  onCrearMolde: (molde: Omit<Molde, 'id' | 'fechaSubida'>) => void;
  onEliminarMolde: (id: string) => void;
}

export default function AdminMoldes({ moldes, onCrearMolde, onEliminarMolde }: AdminMoldesProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [previewMolde, setPreviewMolde] = useState<Molde | null>(null);

  // Estado para nuevo molde
  const [nuevoMolde, setNuevoMolde] = useState<{
    vehiculo: Vehiculo;
    archivo: File | null;
    notas: string;
  }>({
    vehiculo: {
      tipo: '',
      marca: '',
      modelo: '',
      año: new Date().getFullYear()
    },
    archivo: null,
    notas: ''
  });

  const { fileToBase64, converting } = useFileConverter();

  // Filtrar moldes
  const moldesFiltrados = useMemo(() => {
    if (!searchQuery.trim()) {
      return moldes.sort((a, b) => 
        new Date(b.fechaSubida).getTime() - new Date(a.fechaSubida).getTime()
      );
    }

    const query = searchQuery.toLowerCase();
    return moldes
      .filter(molde => 
        molde.vehiculo.marca.toLowerCase().includes(query) ||
        molde.vehiculo.modelo.toLowerCase().includes(query) ||
        molde.nombreArchivo.toLowerCase().includes(query) ||
        molde.vehiculo.tipo.toLowerCase().includes(query)
      )
      .sort((a, b) => 
        new Date(b.fechaSubida).getTime() - new Date(a.fechaSubida).getTime()
      );
  }, [moldes, searchQuery]);

  // Estadísticas
  const estadisticas = useMemo(() => {
    const porTipo = moldes.reduce((acc, molde) => {
      acc[molde.vehiculo.tipo] = (acc[molde.vehiculo.tipo] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const porMarca = moldes.reduce((acc, molde) => {
      acc[molde.vehiculo.marca] = (acc[molde.vehiculo.marca] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Top 5 marcas
    const topMarcas = Object.entries(porMarca)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return {
      total: moldes.length,
      porTipo,
      porMarca,
      topMarcas
    };
  }, [moldes]);

  // Obtener marcas según tipo
  const marcasDisponibles = useMemo(() => {
    if (!nuevoMolde.vehiculo.tipo) return [];
    const tipo = VEHICULOS_COLOMBIA.find(t => t.nombre === nuevoMolde.vehiculo.tipo);
    return tipo?.marcas || [];
  }, [nuevoMolde.vehiculo.tipo]);

  // Obtener modelos según marca
  const modelosDisponibles = useMemo(() => {
    if (!nuevoMolde.vehiculo.tipo || !nuevoMolde.vehiculo.marca) return [];
    const tipo = VEHICULOS_COLOMBIA.find(t => t.nombre === nuevoMolde.vehiculo.tipo);
    const marca = tipo?.marcas.find(m => m.nombre === nuevoMolde.vehiculo.marca);
    return marca?.modelos || [];
  }, [nuevoMolde.vehiculo.tipo, nuevoMolde.vehiculo.marca]);

  // Verificar si ya existe molde para este vehículo
  const moldeExistente = useMemo(() => {
    if (!nuevoMolde.vehiculo.tipo || !nuevoMolde.vehiculo.marca || !nuevoMolde.vehiculo.modelo || !nuevoMolde.vehiculo.año) {
      return null;
    }
    return moldes.find(m => 
      m.vehiculo.tipo === nuevoMolde.vehiculo.tipo &&
      m.vehiculo.marca === nuevoMolde.vehiculo.marca &&
      m.vehiculo.modelo === nuevoMolde.vehiculo.modelo &&
      m.vehiculo.año === nuevoMolde.vehiculo.año
    );
  }, [moldes, nuevoMolde.vehiculo]);

  // Manejar subida de archivo
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNuevoMolde(prev => ({ ...prev, archivo: file }));
    }
  };

  // Subir molde
  const handleSubmit = async () => {
    if (!nuevoMolde.archivo || !nuevoMolde.vehiculo.tipo || !nuevoMolde.vehiculo.marca || !nuevoMolde.vehiculo.modelo) {
      return;
    }

    const base64 = await fileToBase64(nuevoMolde.archivo);
    
    onCrearMolde({
      vehiculo: nuevoMolde.vehiculo,
      nombreArchivo: nuevoMolde.archivo.name,
      url: base64,
      notas: nuevoMolde.notas || undefined
    });

    // Resetear formulario
    setNuevoMolde({
      vehiculo: {
        tipo: '',
        marca: '',
        modelo: '',
        año: new Date().getFullYear()
      },
      archivo: null,
      notas: ''
    });
    setShowUploadDialog(false);
  };

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

  // Verificar si el formulario es válido
  const isFormValid = () => {
    return (
      nuevoMolde.vehiculo.tipo !== '' &&
      nuevoMolde.vehiculo.marca !== '' &&
      nuevoMolde.vehiculo.modelo !== '' &&
      nuevoMolde.vehiculo.año > 0 &&
      nuevoMolde.archivo !== null
    );
  };

  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">Total de Moldes</p>
                <p className="text-4xl font-bold">{estadisticas.total}</p>
              </div>
              <FolderOpen className="w-12 h-12 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Moldes por Tipo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(estadisticas.porTipo).slice(0, 4).map(([tipo, count]) => (
                <div key={tipo} className="flex items-center justify-between">
                  <span className="text-sm">{tipo}</span>
                  <Badge variant="secondary">{count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Top Marcas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {estadisticas.topMarcas.map(([marca, count]) => (
                <div key={marca} className="flex items-center justify-between">
                  <span className="text-sm">{marca}</span>
                  <Badge variant="secondary">{count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Acciones y búsqueda */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar por marca, modelo o nombre de archivo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Button 
              onClick={() => setShowUploadDialog(true)}
              className="bg-gradient-to-r from-green-600 to-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Subir Nuevo Molde
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de moldes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Biblioteca de Moldes ({moldesFiltrados.length})
          </CardTitle>
          <CardDescription>
            Gestione los patrones de corte PDF para cada vehículo
          </CardDescription>
        </CardHeader>
        <CardContent>
          {moldesFiltrados.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No hay moldes registrados</p>
              <p className="text-gray-400 text-sm">
                {searchQuery 
                  ? 'Pruebe con otra búsqueda' 
                  : 'Comience subiendo el primer molde para su biblioteca'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {moldesFiltrados.map((molde) => (
                <div 
                  key={molde.id} 
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setPreviewMolde(molde)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-700"
                        onClick={() => {
                          if (confirm('¿Está seguro de eliminar este molde?')) {
                            onEliminarMolde(molde.id);
                          }
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Car className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-sm">
                        {molde.vehiculo.marca} {molde.vehiculo.modelo}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {molde.vehiculo.tipo}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {molde.vehiculo.año}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 truncate" title={molde.nombreArchivo}>
                      {molde.nombreArchivo}
                    </p>
                    <p className="text-xs text-gray-400">
                      Subido: {formatFecha(molde.fechaSubida)}
                    </p>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-3"
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = molde.url;
                      link.download = molde.nombreArchivo;
                      link.click();
                    }}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Descargar
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog para subir molde */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Subir Nuevo Molde
            </DialogTitle>
            <DialogDescription>
              Complete la información del vehículo y seleccione el archivo PDF del molde
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[70vh]">
            <div className="space-y-6 pr-4">
              {/* Información del vehículo */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Car className="w-4 h-4" />
                  Información del Vehículo
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tipo de Vehículo</Label>
                    <Select 
                      value={nuevoMolde.vehiculo.tipo} 
                      onValueChange={(tipo) => setNuevoMolde(prev => ({
                        ...prev,
                        vehiculo: { tipo, marca: '', modelo: '', año: prev.vehiculo.año }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {VEHICULOS_COLOMBIA.map((tipo) => (
                          <SelectItem key={tipo.nombre} value={tipo.nombre}>
                            {tipo.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Marca</Label>
                    <Select 
                      value={nuevoMolde.vehiculo.marca} 
                      onValueChange={(marca) => setNuevoMolde(prev => ({
                        ...prev,
                        vehiculo: { ...prev.vehiculo, marca, modelo: '' }
                      }))}
                      disabled={!nuevoMolde.vehiculo.tipo}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar marca" />
                      </SelectTrigger>
                      <SelectContent>
                        {marcasDisponibles.map((marca) => (
                          <SelectItem key={marca.nombre} value={marca.nombre}>
                            {marca.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Modelo</Label>
                    <Select 
                      value={nuevoMolde.vehiculo.modelo} 
                      onValueChange={(modelo) => setNuevoMolde(prev => ({
                        ...prev,
                        vehiculo: { ...prev.vehiculo, modelo }
                      }))}
                      disabled={!nuevoMolde.vehiculo.marca}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar modelo" />
                      </SelectTrigger>
                      <SelectContent>
                        {modelosDisponibles.map((modelo) => (
                          <SelectItem key={modelo} value={modelo}>
                            {modelo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Año</Label>
                    <Select 
                      value={nuevoMolde.vehiculo.año.toString()} 
                      onValueChange={(año) => setNuevoMolde(prev => ({
                        ...prev,
                        vehiculo: { ...prev.vehiculo, año: parseInt(año) }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar año" />
                      </SelectTrigger>
                      <SelectContent>
                        <ScrollArea className="h-60">
                          {AÑOS_DISPONIBLES.map((año) => (
                            <SelectItem key={año} value={año.toString()}>
                              {año}
                            </SelectItem>
                          ))}
                        </ScrollArea>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Alerta de molde existente */}
                {moldeExistente && (
                  <Alert className="bg-yellow-50 border-yellow-200">
                    <AlertCircle className="w-4 h-4 text-yellow-600" />
                    <AlertDescription className="text-yellow-800">
                      Ya existe un molde para este vehículo. Si continúa, reemplazará el molde existente.
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <Separator />

              {/* Subida de archivo */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Archivo del Molde
                </h3>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                  <input
                    type="file"
                    id="molde-pdf"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <label 
                    htmlFor="molde-pdf" 
                    className="cursor-pointer flex flex-col items-center gap-3"
                  >
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <Upload className="w-8 h-8 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-gray-700">
                        {nuevoMolde.archivo ? nuevoMolde.archivo.name : 'Haga clic para seleccionar PDF'}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {nuevoMolde.archivo 
                          ? `${(nuevoMolde.archivo.size / 1024 / 1024).toFixed(2)} MB` 
                          : 'Archivos PDF hasta 50MB'}
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              <Separator />

              {/* Notas */}
              <div className="space-y-2">
                <Label>Notas (opcional)</Label>
                <textarea
                  className="w-full min-h-[80px] p-3 border rounded-md text-sm"
                  placeholder="Notas adicionales sobre este molde..."
                  value={nuevoMolde.notas}
                  onChange={(e) => setNuevoMolde(prev => ({ ...prev, notas: e.target.value }))}
                />
              </div>
            </div>
          </ScrollArea>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!isFormValid() || converting}
              className="bg-gradient-to-r from-green-600 to-green-700"
            >
              {converting ? (
                <>Procesando...</>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  {moldeExistente ? 'Reemplazar Molde' : 'Subir Molde'}
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de preview de molde */}
      <Dialog open={!!previewMolde} onOpenChange={() => setPreviewMolde(null)}>
        <DialogContent className="max-w-lg">
          {previewMolde && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  {previewMolde.vehiculo.marca} {previewMolde.vehiculo.modelo}
                </DialogTitle>
                <DialogDescription>
                  {previewMolde.vehiculo.tipo} - {previewMolde.vehiculo.año}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Archivo:</span>
                    <span className="font-medium">{previewMolde.nombreArchivo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subido:</span>
                    <span>{formatFecha(previewMolde.fechaSubida)}</span>
                  </div>
                  {previewMolde.notas && (
                    <div className="pt-2 border-t">
                      <span className="text-gray-500">Notas:</span>
                      <p className="mt-1 text-sm">{previewMolde.notas}</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = previewMolde.url;
                      link.download = previewMolde.nombreArchivo;
                      link.click();
                    }}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Descargar
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      window.open(previewMolde.url, '_blank');
                    }}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Ver PDF
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
