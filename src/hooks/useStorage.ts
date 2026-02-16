import { useState, useEffect, useCallback } from 'react';
import type { Pedido, Molde, Vehiculo } from '@/types';

// Claves para localStorage
const STORAGE_KEYS = {
  PEDIDOS: 'forros_pedidos',
  MOLDES: 'forros_moldes',
  LAST_ID: 'forros_last_id'
};

// Hook para generar IDs únicos
export const useIdGenerator = () => {
  const [lastId, setLastId] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LAST_ID);
    return saved ? parseInt(saved, 10) : 0;
  });

  const generateId = useCallback(() => {
    const newId = lastId + 1;
    setLastId(newId);
    localStorage.setItem(STORAGE_KEYS.LAST_ID, newId.toString());
    return `PED-${newId.toString().padStart(6, '0')}`;
  }, [lastId]);

  return generateId;
};

// Hook para gestionar pedidos
export const usePedidos = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PEDIDOS);
    return saved ? JSON.parse(saved) : [];
  });

  const [loading, setLoading] = useState(false);
  const generateId = useIdGenerator();

  // Guardar en localStorage cuando cambien los pedidos
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PEDIDOS, JSON.stringify(pedidos));
  }, [pedidos]);

  // Crear nuevo pedido
  const crearPedido = useCallback((pedidoData: Omit<Pedido, 'id' | 'fechaCreacion' | 'estado'>): Pedido => {
    setLoading(true);
    
    const nuevoPedido: Pedido = {
      ...pedidoData,
      id: generateId(),
      fechaCreacion: new Date().toISOString(),
      estado: 'pendiente'
    };

    setPedidos(prev => [nuevoPedido, ...prev]);
    setLoading(false);
    
    return nuevoPedido;
  }, [generateId]);

  // Actualizar pedido
  const actualizarPedido = useCallback((id: string, updates: Partial<Pedido>) => {
    setPedidos(prev => 
      prev.map(pedido => 
        pedido.id === id ? { ...pedido, ...updates } : pedido
      )
    );
  }, []);

  // Cambiar estado de pedido
  const cambiarEstadoPedido = useCallback((id: string, nuevoEstado: Pedido['estado']) => {
    setPedidos(prev => 
      prev.map(pedido => 
        pedido.id === id ? { 
          ...pedido, 
          estado: nuevoEstado,
          fechaEntrega: nuevoEstado === 'entregado' ? new Date().toISOString() : pedido.fechaEntrega
        } : pedido
      )
    );
  }, []);

  // Eliminar pedido
  const eliminarPedido = useCallback((id: string) => {
    setPedidos(prev => prev.filter(pedido => pedido.id !== id));
  }, []);

  // Asociar molde a pedido
  const asociarMoldeAPedido = useCallback((pedidoId: string, molde: Molde) => {
    setPedidos(prev => 
      prev.map(pedido => 
        pedido.id === pedidoId ? { ...pedido, moldeAsociado: molde } : pedido
      )
    );
  }, []);

  // Buscar pedidos
  const buscarPedidos = useCallback((query: string) => {
    const lowerQuery = query.toLowerCase();
    return pedidos.filter(pedido => 
      pedido.id.toLowerCase().includes(lowerQuery) ||
      pedido.cliente.nombre.toLowerCase().includes(lowerQuery) ||
      pedido.cliente.telefono.includes(lowerQuery) ||
      pedido.vehiculo.marca.toLowerCase().includes(lowerQuery) ||
      pedido.vehiculo.modelo.toLowerCase().includes(lowerQuery)
    );
  }, [pedidos]);

  // Filtrar por estado
  const filtrarPorEstado = useCallback((estado: Pedido['estado'] | 'todos') => {
    if (estado === 'todos') return pedidos;
    return pedidos.filter(pedido => pedido.estado === estado);
  }, [pedidos]);

  // Obtener estadísticas
  const getEstadisticas = useCallback(() => {
    const total = pedidos.length;
    const pendientes = pedidos.filter(p => p.estado === 'pendiente').length;
    const enCorte = pedidos.filter(p => p.estado === 'en_corte').length;
    const enConfeccion = pedidos.filter(p => p.estado === 'en_confeccion').length;
    const terminados = pedidos.filter(p => p.estado === 'terminado').length;
    const entregados = pedidos.filter(p => p.estado === 'entregado').length;

    return {
      total,
      pendientes,
      enCorte,
      enConfeccion,
      terminados,
      entregados
    };
  }, [pedidos]);

  return {
    pedidos,
    loading,
    crearPedido,
    actualizarPedido,
    cambiarEstadoPedido,
    eliminarPedido,
    asociarMoldeAPedido,
    buscarPedidos,
    filtrarPorEstado,
    getEstadisticas
  };
};

// Hook para gestionar moldes
export const useMoldes = () => {
  const [moldes, setMoldes] = useState<Molde[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MOLDES);
    return saved ? JSON.parse(saved) : [];
  });

  const [loading, setLoading] = useState(false);

  // Guardar en localStorage cuando cambien los moldes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MOLDES, JSON.stringify(moldes));
  }, [moldes]);

  // Generar ID único para molde
  const generateMoldeId = useCallback(() => {
    return `MOL-${Date.now().toString(36).toUpperCase()}`;
  }, []);

  // Crear nuevo molde
  const crearMolde = useCallback((moldeData: Omit<Molde, 'id' | 'fechaSubida'>): Molde => {
    setLoading(true);
    
    const nuevoMolde: Molde = {
      ...moldeData,
      id: generateMoldeId(),
      fechaSubida: new Date().toISOString()
    };

    setMoldes(prev => [nuevoMolde, ...prev]);
    setLoading(false);
    
    return nuevoMolde;
  }, [generateMoldeId]);

  // Actualizar molde
  const actualizarMolde = useCallback((id: string, updates: Partial<Molde>) => {
    setMoldes(prev => 
      prev.map(molde => 
        molde.id === id ? { ...molde, ...updates } : molde
      )
    );
  }, []);

  // Eliminar molde
  const eliminarMolde = useCallback((id: string) => {
    setMoldes(prev => prev.filter(molde => molde.id !== id));
  }, []);

  // Buscar molde por vehículo exacto
  const buscarMoldePorVehiculo = useCallback((vehiculo: Vehiculo): Molde | undefined => {
    return moldes.find(molde => 
      molde.vehiculo.tipo === vehiculo.tipo &&
      molde.vehiculo.marca === vehiculo.marca &&
      molde.vehiculo.modelo === vehiculo.modelo &&
      molde.vehiculo.año === vehiculo.año
    );
  }, [moldes]);

  // Buscar moldes similares (mismo tipo, marca, modelo pero diferente año)
  const buscarMoldesSimilares = useCallback((vehiculo: Vehiculo): Molde[] => {
    return moldes.filter(molde => 
      molde.vehiculo.tipo === vehiculo.tipo &&
      molde.vehiculo.marca === vehiculo.marca &&
      molde.vehiculo.modelo === vehiculo.modelo &&
      molde.vehiculo.año !== vehiculo.año
    );
  }, [moldes]);

  // Buscar moldes por query
  const buscarMoldes = useCallback((query: string) => {
    const lowerQuery = query.toLowerCase();
    return moldes.filter(molde => 
      molde.vehiculo.marca.toLowerCase().includes(lowerQuery) ||
      molde.vehiculo.modelo.toLowerCase().includes(lowerQuery) ||
      molde.nombreArchivo.toLowerCase().includes(lowerQuery) ||
      molde.vehiculo.tipo.toLowerCase().includes(lowerQuery)
    );
  }, [moldes]);

  // Verificar si existe molde para vehículo
  const existeMolde = useCallback((vehiculo: Vehiculo): boolean => {
    return moldes.some(molde => 
      molde.vehiculo.tipo === vehiculo.tipo &&
      molde.vehiculo.marca === vehiculo.marca &&
      molde.vehiculo.modelo === vehiculo.modelo &&
      molde.vehiculo.año === vehiculo.año
    );
  }, [moldes]);

  // Obtener estadísticas de moldes
  const getEstadisticas = useCallback(() => {
    const total = moldes.length;
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
      total,
      porTipo,
      porMarca,
      topMarcas
    };
  }, [moldes]);

  return {
    moldes,
    loading,
    crearMolde,
    actualizarMolde,
    eliminarMolde,
    buscarMoldePorVehiculo,
    buscarMoldesSimilares,
    buscarMoldes,
    existeMolde,
    getEstadisticas
  };
};

// Hook para convertir archivo a base64
export const useFileConverter = () => {
  const [converting, setConverting] = useState(false);

  const fileToBase64 = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      setConverting(true);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setConverting(false);
        resolve(reader.result as string);
      };
      reader.onerror = (error) => {
        setConverting(false);
        reject(error);
      };
    });
  }, []);

  const filesToBase64 = useCallback(async (files: File[]): Promise<string[]> => {
    setConverting(true);
    try {
      const promises = files.map(file => fileToBase64(file));
      const results = await Promise.all(promises);
      return results;
    } finally {
      setConverting(false);
    }
  }, [fileToBase64]);

  return {
    converting,
    fileToBase64,
    filesToBase64
  };
};

// Hook para notificaciones
export const useNotification = () => {
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
    visible: boolean;
  }>({ message: '', type: 'info', visible: false });

  const showNotification = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({ message, type, visible: true });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, visible: false }));
    }, 3000);
  }, []);

  const hideNotification = useCallback(() => {
    setNotification(prev => ({ ...prev, visible: false }));
  }, []);

  return {
    notification,
    showNotification,
    hideNotification
  };
};
