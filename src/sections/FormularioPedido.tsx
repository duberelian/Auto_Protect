import { useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Camera, 
  Upload, 
  X, 
  Check, 
  Car, 
  User, 
  FileText,
  AlertCircle,
  Search
} from 'lucide-react';
import { VEHICULOS_COLOMBIA, AÑOS_DISPONIBLES } from '@/types';
import type { Pedido, Vehiculo, Cliente } from '@/types';
import { useMoldes, useFileConverter } from '@/hooks/useStorage';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface FormularioPedidoProps {
  onSubmit: (pedido: Omit<Pedido, 'id' | 'fechaCreacion' | 'estado'>) => void;
  onCancel?: () => void;
}

export default function FormularioPedido({ onSubmit, onCancel }: FormularioPedidoProps) {
  // Estado del formulario
  const [cliente, setCliente] = useState<Cliente>({
    nombre: '',
    telefono: '',
    direccion: ''
  });

  const [vehiculo, setVehiculo] = useState<Vehiculo>({
    tipo: '',
    marca: '',
    modelo: '',
    año: new Date().getFullYear()
  });

  const [fotos, setFotos] = useState<string[]>([]);
  const [notas, setNotas] = useState('');
  const [previewFoto, setPreviewFoto] = useState<string | null>(null);
  const [showMoldeDialog, setShowMoldeDialog] = useState(false);
  const [moldeEncontrado, setMoldeEncontrado] = useState<any>(null);
  const [moldeSimilares, setMoldeSimilares] = useState<any[]>([]);
  const [searchingMolde, setSearchingMolde] = useState(false);

  const { buscarMoldePorVehiculo, buscarMoldesSimilares, existeMolde } = useMoldes();
  const { filesToBase64, converting } = useFileConverter();

  // Obtener marcas según tipo seleccionado
  const marcasDisponibles = useMemo(() => {
    if (!vehiculo.tipo) return [];
    const tipo = VEHICULOS_COLOMBIA.find(t => t.nombre === vehiculo.tipo);
    return tipo?.marcas || [];
  }, [vehiculo.tipo]);

  // Obtener modelos según marca seleccionada
  const modelosDisponibles = useMemo(() => {
    if (!vehiculo.tipo || !vehiculo.marca) return [];
    const tipo = VEHICULOS_COLOMBIA.find(t => t.nombre === vehiculo.tipo);
    const marca = tipo?.marcas.find(m => m.nombre === vehiculo.marca);
    return marca?.modelos || [];
  }, [vehiculo.tipo, vehiculo.marca]);

  // Manejar cambio de tipo
  const handleTipoChange = (tipo: string) => {
    setVehiculo({
      tipo,
      marca: '',
      modelo: '',
      año: vehiculo.año
    });
  };

  // Manejar cambio de marca
  const handleMarcaChange = (marca: string) => {
    setVehiculo(prev => ({
      ...prev,
      marca,
      modelo: ''
    }));
  };

  // Manejar subida de fotos
  const handleFotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const base64Files = await filesToBase64(fileArray);
    
    setFotos(prev => [...prev, ...base64Files]);
  };

  // Eliminar foto
  const removeFoto = (index: number) => {
    setFotos(prev => prev.filter((_, i) => i !== index));
  };

  // Buscar molde para el vehículo
  const buscarMolde = useCallback(() => {
    if (!vehiculo.tipo || !vehiculo.marca || !vehiculo.modelo || !vehiculo.año) {
      return;
    }

    setSearchingMolde(true);
    
    // Buscar molde exacto
    const moldeExacto = buscarMoldePorVehiculo(vehiculo);
    setMoldeEncontrado(moldeExacto || null);

    // Buscar moldes similares
    const similares = buscarMoldesSimilares(vehiculo);
    setMoldeSimilares(similares);

    setShowMoldeDialog(true);
    setSearchingMolde(false);
  }, [vehiculo, buscarMoldePorVehiculo, buscarMoldesSimilares]);

  // Verificar si el formulario es válido
  const isFormValid = useCallback(() => {
    return (
      cliente.nombre.trim() !== '' &&
      cliente.telefono.trim() !== '' &&
      vehiculo.tipo !== '' &&
      vehiculo.marca !== '' &&
      vehiculo.modelo !== '' &&
      vehiculo.año > 0 &&
      fotos.length > 0
    );
  }, [cliente, vehiculo, fotos]);

  // Enviar formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid()) return;

    const pedidoData: Omit<Pedido, 'id' | 'fechaCreacion' | 'estado'> = {
      cliente,
      vehiculo,
      fotos,
      notas: notas || undefined
    };

    onSubmit(pedidoData);
    
    // Resetear formulario
    setCliente({ nombre: '', telefono: '', direccion: '' });
    setVehiculo({ tipo: '', marca: '', modelo: '', año: new Date().getFullYear() });
    setFotos([]);
    setNotas('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Sección de Datos del Cliente */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <CardTitle className="flex items-center gap-2 text-xl">
            <User className="w-5 h-5" />
            Datos del Cliente
          </CardTitle>
          <CardDescription className="text-blue-100">
            Información de contacto del cliente
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre" className="text-sm font-medium">
                Nombre Completo <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nombre"
                placeholder="Ej: Juan Pérez García"
                value={cliente.nombre}
                onChange={(e) => setCliente(prev => ({ ...prev, nombre: e.target.value }))}
                className="h-11"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="telefono" className="text-sm font-medium">
                Teléfono <span className="text-red-500">*</span>
              </Label>
              <Input
                id="telefono"
                type="tel"
                placeholder="Ej: 300 123 4567"
                value={cliente.telefono}
                onChange={(e) => setCliente(prev => ({ ...prev, telefono: e.target.value }))}
                className="h-11"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="direccion" className="text-sm font-medium">
              Dirección
            </Label>
            <Textarea
              id="direccion"
              placeholder="Ej: Calle 123 # 45-67, Barrio Centro, Bogotá"
              value={cliente.direccion}
              onChange={(e) => setCliente(prev => ({ ...prev, direccion: e.target.value }))}
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Sección de Datos del Vehículo */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Car className="w-5 h-5" />
            Datos del Vehículo
          </CardTitle>
          <CardDescription className="text-green-100">
            Información del vehículo para fabricar los forros
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Tipo de Vehículo */}
            <div className="space-y-2">
              <Label htmlFor="tipo" className="text-sm font-medium">
                Tipo <span className="text-red-500">*</span>
              </Label>
              <Select value={vehiculo.tipo} onValueChange={handleTipoChange}>
                <SelectTrigger className="h-11">
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

            {/* Marca */}
            <div className="space-y-2">
              <Label htmlFor="marca" className="text-sm font-medium">
                Marca <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={vehiculo.marca} 
                onValueChange={handleMarcaChange}
                disabled={!vehiculo.tipo}
              >
                <SelectTrigger className="h-11">
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

            {/* Modelo */}
            <div className="space-y-2">
              <Label htmlFor="modelo" className="text-sm font-medium">
                Modelo <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={vehiculo.modelo} 
                onValueChange={(modelo) => setVehiculo(prev => ({ ...prev, modelo }))}
                disabled={!vehiculo.marca}
              >
                <SelectTrigger className="h-11">
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

            {/* Año */}
            <div className="space-y-2">
              <Label htmlFor="año" className="text-sm font-medium">
                Año <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={vehiculo.año.toString()} 
                onValueChange={(año) => setVehiculo(prev => ({ ...prev, año: parseInt(año) }))}
              >
                <SelectTrigger className="h-11">
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

          {/* Botón de búsqueda de molde */}
          {vehiculo.tipo && vehiculo.marca && vehiculo.modelo && vehiculo.año && (
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={buscarMolde}
                disabled={searchingMolde}
                className="flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                {searchingMolde ? 'Buscando...' : 'Buscar Molde Disponible'}
              </Button>
              
              {existeMolde(vehiculo) && (
                <Badge variant="default" className="bg-green-600">
                  <Check className="w-3 h-3 mr-1" />
                  Molde disponible
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sección de Fotos */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Camera className="w-5 h-5" />
            Fotos de los Asientos
          </CardTitle>
          <CardDescription className="text-purple-100">
            Suba fotos claras de todos los asientos del vehículo
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          {/* Área de subida */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-500 transition-colors">
            <input
              type="file"
              id="fotos"
              accept="image/*"
              multiple
              onChange={handleFotoUpload}
              className="hidden"
            />
            <label 
              htmlFor="fotos" 
              className="cursor-pointer flex flex-col items-center gap-3"
            >
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                <Upload className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <p className="text-lg font-medium text-gray-700">
                  {converting ? 'Procesando fotos...' : 'Haga clic para subir fotos'}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  o arrastre y suelte las imágenes aquí
                </p>
              </div>
              <p className="text-xs text-gray-400">
                PNG, JPG, JPEG hasta 10MB por foto
              </p>
            </label>
          </div>

          {/* Preview de fotos */}
          {fotos.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">
                  Fotos subidas ({fotos.length})
                </Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setFotos([])}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4 mr-1" />
                  Eliminar todas
                </Button>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {fotos.map((foto, index) => (
                  <div 
                    key={index} 
                    className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200"
                  >
                    <img
                      src={foto}
                      alt={`Foto ${index + 1}`}
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() => setPreviewFoto(foto)}
                    />
                    <button
                      type="button"
                      onClick={() => removeFoto(index)}
                      className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs py-1 px-2">
                      Foto {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {fotos.length === 0 && (
            <Alert variant="destructive" className="bg-yellow-50 border-yellow-200">
              <AlertCircle className="w-4 h-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                Debe subir al menos una foto de los asientos para crear el pedido.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Notas adicionales */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardTitle className="flex items-center gap-2 text-xl">
            <FileText className="w-5 h-5" />
            Notas Adicionales
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <Textarea
            placeholder="Ingrese cualquier información adicional relevante para el pedido (color de tela, material preferido, detalles especiales, etc.)"
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Botones de acción */}
      <div className="flex flex-col sm:flex-row gap-3 justify-end">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="h-12 px-8"
          >
            Cancelar
          </Button>
        )}
        <Button
          type="submit"
          disabled={!isFormValid() || converting}
          className="h-12 px-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
        >
          <Check className="w-5 h-5 mr-2" />
          {converting ? 'Procesando...' : 'Crear Pedido'}
        </Button>
      </div>

      {/* Dialog de preview de foto */}
      <Dialog open={!!previewFoto} onOpenChange={() => setPreviewFoto(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          {previewFoto && (
            <img
              src={previewFoto}
              alt="Preview"
              className="w-full h-full object-contain max-h-[85vh]"
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de búsqueda de molde */}
      <Dialog open={showMoldeDialog} onOpenChange={setShowMoldeDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Resultado de Búsqueda de Molde
            </DialogTitle>
            <DialogDescription>
              {vehiculo.marca} {vehiculo.modelo} ({vehiculo.año})
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {moldeEncontrado ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-green-800 font-semibold mb-2">
                  <Check className="w-5 h-5" />
                  ¡Molde encontrado!
                </div>
                <p className="text-sm text-green-700">
                  Se encontró un molde exacto para este vehículo. El área de corte podrá descargarlo automáticamente.
                </p>
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-yellow-800 font-semibold mb-2">
                  <AlertCircle className="w-5 h-5" />
                  Molde no encontrado
                </div>
                <p className="text-sm text-yellow-700">
                  No se encontró un molde exacto para este vehículo. El pedido se creará sin molde asociado.
                </p>
              </div>
            )}

            {moldeSimilares.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Moldes similares encontrados:</Label>
                <div className="space-y-2">
                  {moldeSimilares.slice(0, 3).map((molde) => (
                    <div 
                      key={molde.id} 
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{molde.vehiculo.año}</p>
                        <p className="text-sm text-gray-500">{molde.nombreArchivo}</p>
                      </div>
                      <Badge variant="outline">Año diferente</Badge>
                    </div>
                  ))}
                </div>
                {moldeSimilares.length > 3 && (
                  <p className="text-sm text-gray-500">
                    Y {moldeSimilares.length - 3} moldes más...
                  </p>
                )}
              </div>
            )}

            <Button 
              onClick={() => setShowMoldeDialog(false)} 
              className="w-full"
            >
              Entendido
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </form>
  );
}
