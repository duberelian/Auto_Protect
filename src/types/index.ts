// Tipos para el sistema de gestión de forros de cojinería

export interface Cliente {
  nombre: string;
  telefono: string;
  direccion: string;
}

export interface Vehiculo {
  tipo: string;
  marca: string;
  modelo: string;
  año: number;
}

export interface Molde {
  id: string;
  vehiculo: Vehiculo;
  nombreArchivo: string;
  url: string;
  fechaSubida: string;
  notas?: string;
}

export interface Pedido {
  id: string;
  cliente: Cliente;
  vehiculo: Vehiculo;
  fotos: string[];
  moldeAsociado?: Molde;
  estado: 'pendiente' | 'en_corte' | 'en_confeccion' | 'terminado' | 'entregado';
  fechaCreacion: string;
  fechaEntrega?: string;
  notas?: string;
}

export interface MarcaVehiculo {
  nombre: string;
  modelos: string[];
}

export interface TipoVehiculo {
  nombre: string;
  marcas: MarcaVehiculo[];
}

// Base de datos de vehículos comunes en Colombia
export const VEHICULOS_COLOMBIA: TipoVehiculo[] = [
  {
    nombre: 'Automóvil',
    marcas: [
      {
        nombre: 'Renault',
        modelos: ['Sandero', 'Logan', 'Stepway', 'Duster', 'Kwid', 'Captur', 'Koleos', 'Symbol', 'Fluence', 'Megane', 'Clio', 'Twingo', 'Scenic']
      },
      {
        nombre: 'Chevrolet',
        modelos: ['Spark', 'Sonic', 'Onix', 'Tracker', 'Trailblazer', 'Equinox', 'Captiva', 'Cruze', 'Aveo', 'Optra', 'Epica', 'Malibu', 'Camaro', 'Colorado', 'Silverado']
      },
      {
        nombre: 'Mazda',
        modelos: ['2', '3', '6', 'CX-3', 'CX-30', 'CX-5', 'CX-50', 'CX-9', 'BT-50', 'MX-5']
      },
      {
        nombre: 'Toyota',
        modelos: ['Yaris', 'Corolla', 'Camry', 'Prius', 'RAV4', 'Fortuner', 'Prado', 'Land Cruiser', 'Hilux', 'SW4', 'Etios', 'Avanza', 'Rush']
      },
      {
        nombre: 'Nissan',
        modelos: ['March', 'Versa', 'Sentra', 'Altima', 'X-Trail', 'Qashqai', 'Pathfinder', 'Murano', 'Frontier', 'NP300', 'Patrol', 'Kicks', 'Leaf']
      },
      {
        nombre: 'Hyundai',
        modelos: ['i10', 'Grand i10', 'Accent', 'Elantra', 'Sonata', 'Tucson', 'Santa Fe', 'Creta', 'Venue', 'Kona', 'Palisade', 'Staria']
      },
      {
        nombre: 'Kia',
        modelos: ['Picanto', 'Rio', 'Cerato', 'Optima', 'Stinger', 'Sportage', 'Sorento', 'Soul', 'Seltos', 'Niro', 'Telluride', 'Carnival']
      },
      {
        nombre: 'Volkswagen',
        modelos: ['Gol', 'Voyage', 'Polo', 'Jetta', 'Passat', 'Virtus', 'Nivus', 'T-Cross', 'Taos', 'Tiguan', 'Touareg', 'Amarok']
      },
      {
        nombre: 'Ford',
        modelos: ['Fiesta', 'Focus', 'Fusion', 'Mustang', 'EcoSport', 'Escape', 'Kuga', 'Edge', 'Explorer', 'Expedition', 'Ranger', 'F-150', 'Bronco']
      },
      {
        nombre: 'Honda',
        modelos: ['Fit', 'City', 'Civic', 'Accord', 'CR-V', 'HR-V', 'Pilot', 'Passport', 'Ridgeline', 'Odyssey']
      },
      {
        nombre: 'Suzuki',
        modelos: ['Alto', 'Swift', 'Baleno', 'Ciaz', 'Vitara', 'S-Cross', 'Jimny', 'Ertiga', 'XL7']
      },
      {
        nombre: 'Mitsubishi',
        modelos: ['Mirage', 'Lancer', 'ASX', 'Eclipse Cross', 'Outlander', 'Montero', 'Montero Sport', 'L200', 'Triton']
      },
      {
        nombre: 'Peugeot',
        modelos: ['208', '2008', '3008', '5008', 'Rifter', 'Expert', 'Boxer']
      },
      {
        nombre: 'Citroën',
        modelos: ['C3', 'C4', 'C4 Cactus', 'C5 Aircross', 'Berlingo', 'Jumpy', 'Jumper']
      },
      {
        nombre: 'BMW',
        modelos: ['Serie 1', 'Serie 2', 'Serie 3', 'Serie 4', 'Serie 5', 'Serie 7', 'X1', 'X2', 'X3', 'X4', 'X5', 'X6', 'X7']
      },
      {
        nombre: 'Mercedes-Benz',
        modelos: ['Clase A', 'Clase B', 'Clase C', 'Clase E', 'Clase S', 'CLA', 'CLS', 'GLA', 'GLB', 'GLC', 'GLE', 'GLS', 'G']
      },
      {
        nombre: 'Audi',
        modelos: ['A1', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'Q2', 'Q3', 'Q5', 'Q7', 'Q8', 'TT', 'R8']
      },
      {
        nombre: 'Jeep',
        modelos: ['Renegade', 'Compass', 'Cherokee', 'Grand Cherokee', 'Wrangler', 'Gladiator']
      },
      {
        nombre: 'Subaru',
        modelos: ['Impreza', 'Legacy', 'XV', 'Forester', 'Outback', 'Ascent', 'BRZ']
      },
      {
        nombre: 'Chery',
        modelos: ['QQ', 'Tiggo 2', 'Tiggo 3', 'Tiggo 4', 'Tiggo 7', 'Tiggo 8', 'Arrizo 5', 'Arrizo 6']
      },
      {
        nombre: 'JAC',
        modelos: ['J2', 'J4', 'S2', 'S3', 'S4', 'S5', 'S7', 'T6', 'T8', 'Rein']
      },
      {
        nombre: 'Great Wall',
        modelos: ['Haval H2', 'Haval H6', 'Haval Jolion', 'Haval H9', 'Wingle 5', 'Wingle 7', 'Poer', 'Cannon']
      },
      {
        nombre: 'Changan',
        modelos: ['Alsvin', 'CS15', 'CS35', 'CS55', 'CS75', 'CS95', 'UNI-K', 'UNI-T', 'Hunter']
      },
      {
        nombre: 'DFSK',
        modelos: ['Van', 'Pickup', 'Glory 500', 'Glory 580', 'Glory i-Auto']
      },
      {
        nombre: 'Foton',
        modelos: ['Sauvana', 'Tunland', 'View', 'Aumark']
      }
    ]
  },
  {
    nombre: 'Camioneta',
    marcas: [
      {
        nombre: 'Toyota',
        modelos: ['Hilux', 'Land Cruiser', 'Prado', 'Fortuner', 'SW4', 'RAV4']
      },
      {
        nombre: 'Nissan',
        modelos: ['Frontier', 'NP300', 'X-Trail', 'Pathfinder', 'Patrol', 'Qashqai']
      },
      {
        nombre: 'Ford',
        modelos: ['Ranger', 'F-150', 'Explorer', 'Edge', 'Escape', 'Bronco', 'Everest']
      },
      {
        nombre: 'Chevrolet',
        modelos: ['Colorado', 'Silverado', 'Trailblazer', 'Tracker', 'Equinox', 'Captiva']
      },
      {
        nombre: 'Mitsubishi',
        modelos: ['L200', 'Triton', 'Montero', 'Montero Sport', 'ASX', 'Outlander']
      },
      {
        nombre: 'Volkswagen',
        modelos: ['Amarok', 'Tiguan', 'Touareg', 'T-Cross', 'Taos']
      },
      {
        nombre: 'Renault',
        modelos: ['Duster', 'Koleos', 'Captur', 'Oroch', 'Alaskan']
      },
      {
        nombre: 'Mazda',
        modelos: ['BT-50', 'CX-5', 'CX-9', 'CX-50']
      },
      {
        nombre: 'Great Wall',
        modelos: ['Wingle 5', 'Wingle 7', 'Poer', 'Cannon', 'Haval H6', 'Haval H9']
      },
      {
        nombre: 'JAC',
        modelos: ['T6', 'T8', 'Rein', 'S7']
      },
      {
        nombre: 'Changan',
        modelos: ['Hunter', 'CS75', 'CS95', 'UNI-K']
      },
      {
        nombre: 'DFSK',
        modelos: ['Pickup', 'Glory 580']
      },
      {
        nombre: 'Foton',
        modelos: ['Tunland', 'Sauvana']
      },
      {
        nombre: 'Suzuki',
        modelos: ['Jimny', 'Vitara', 'S-Cross', 'XL7']
      },
      {
        nombre: 'Subaru',
        modelos: ['Forester', 'Outback', 'XV', 'Ascent']
      },
      {
        nombre: 'Jeep',
        modelos: ['Wrangler', 'Gladiator', 'Grand Cherokee', 'Cherokee', 'Compass', 'Renegade']
      },
      {
        nombre: 'Land Rover',
        modelos: ['Defender', 'Discovery', 'Discovery Sport', 'Range Rover', 'Range Rover Sport', 'Range Rover Velar', 'Range Rover Evoque']
      },
      {
        nombre: 'Mercedes-Benz',
        modelos: ['Clase G', 'GLA', 'GLB', 'GLC', 'GLE', 'GLS']
      },
      {
        nombre: 'BMW',
        modelos: ['X1', 'X2', 'X3', 'X4', 'X5', 'X6', 'X7']
      },
      {
        nombre: 'Audi',
        modelos: ['Q2', 'Q3', 'Q5', 'Q7', 'Q8']
      },
      {
        nombre: 'Porsche',
        modelos: ['Macan', 'Cayenne']
      },
      {
        nombre: 'Volvo',
        modelos: ['XC40', 'XC60', 'XC90']
      },
      {
        nombre: 'Lexus',
        modelos: ['UX', 'NX', 'RX', 'LX', 'GX']
      },
      {
        nombre: 'Infiniti',
        modelos: ['QX30', 'QX50', 'QX60', 'QX80']
      },
      {
        nombre: 'Acura',
        modelos: ['RDX', 'MDX']
      },
      {
        nombre: 'Cadillac',
        modelos: ['XT4', 'XT5', 'XT6', 'Escalade']
      },
      {
        nombre: 'Lincoln',
        modelos: ['Corsair', 'Nautilus', 'Aviator', 'Navigator']
      },
      {
        nombre: 'GMC',
        modelos: ['Terrain', 'Acadia', 'Yukon', 'Sierra']
      },
      {
        nombre: 'Dodge',
        modelos: ['Journey', 'Durango']
      },
      {
        nombre: 'Chrysler',
        modelos: ['Pacifica']
      },
      {
        nombre: 'Hummer',
        modelos: ['EV']
      },
      {
        nombre: 'Rivian',
        modelos: ['R1T', 'R1S']
      },
      {
        nombre: 'Tesla',
        modelos: ['Model X', 'Model Y', 'Cybertruck']
      }
    ]
  },
  {
    nombre: 'Camión',
    marcas: [
      {
        nombre: 'Chevrolet',
        modelos: ['NHR', 'NPR', 'NKR', 'FRR', 'FTR', 'FVR', 'FXR', 'GMC']
      },
      {
        nombre: 'Ford',
        modelos: ['Cargo', 'F-350', 'F-450', 'F-550', 'F-650', 'F-750', 'Lobos']
      },
      {
        nombre: 'Freightliner',
        modelos: ['M2', 'Cascadia', 'Coronado', '122SD', '108SD']
      },
      {
        nombre: 'International',
        modelos: ['DuraStar', 'ProStar', 'Lonestar', 'HV', 'HX', 'MV']
      },
      {
        nombre: 'Kenworth',
        modelos: ['T300', 'T370', 'T440', 'T470', 'T680', 'T800', 'T880', 'W900']
      },
      {
        nombre: 'Mack',
        modelos: ['Granite', 'Pinnacle', 'TerraPro', 'LR']
      },
      {
        nombre: 'Peterbilt',
        modelos: ['220', '337', '348', '365', '367', '389', '520', '567', '579']
      },
      {
        nombre: 'Volvo',
        modelos: ['VNL', 'VNR', 'VHD', 'VAH', 'FM', 'FH']
      },
      {
        nombre: 'Scania',
        modelos: ['P Series', 'G Series', 'R Series', 'S Series', 'L Series']
      },
      {
        nombre: 'Mercedes-Benz',
        modelos: ['Accelo', 'Atego', 'Axor', 'Actros', 'Arocs', 'Econic']
      },
      {
        nombre: 'Hino',
        modelos: ['Dutro', 'Ranger', 'Profia', '300 Series', '500 Series', '700 Series']
      },
      {
        nombre: 'Isuzu',
        modelos: ['Elf', 'Forward', 'Giga', 'NPR', 'NQR', 'FRR', 'FTR', 'FVR']
      },
      {
        nombre: 'Foton',
        modelos: ['Aumark', 'BJ', 'Forland']
      },
      {
        nombre: 'JAC',
        modelos: ['Light Duty', 'Medium Duty', 'Heavy Duty']
      },
      {
        nombre: 'Dongfeng',
        modelos: ['Captain', 'Kingrun', 'Tianlong']
      },
      {
        nombre: 'Howo',
        modelos: ['Light', 'Medium', 'Heavy']
      },
      {
        nombre: 'Shacman',
        modelos: ['F2000', 'F3000', 'X3000', 'M3000']
      },
      {
        nombre: 'FAW',
        modelos: ['Tiger', 'Jiefang']
      },
      {
        nombre: 'Fawde',
        modelos: ['Light', 'Medium', 'Heavy']
      }
    ]
  },
  {
    nombre: 'Bus/Buseta',
    marcas: [
      {
        nombre: 'Chevrolet',
        modelos: ['NPR Bus', 'NKR Bus', 'FRR Bus', 'Bus LV']
      },
      {
        nombre: 'Hino',
        modelos: ['FB', 'FC', 'FG', 'FM', 'RK', 'RM']
      },
      {
        nombre: 'Mitsubishi',
        modelos: ['Rosa', 'Aero Star', 'Aero Ace']
      },
      {
        nombre: 'Toyota',
        modelos: ['Coaster', 'Hiace Bus']
      },
      {
        nombre: 'Nissan',
        modelos: ['Civilian', 'Urvan Bus']
      },
      {
        nombre: 'Hyundai',
        modelos: ['County', 'Super AeroCity', 'Universe']
      },
      {
        nombre: 'Kia',
        modelos: ['Combi', 'Granbird']
      },
      {
        nombre: 'Volkswagen',
        modelos: ['Volksbus', 'Crafter Bus']
      },
      {
        nombre: 'Mercedes-Benz',
        modelos: ['Sprinter', 'OF', 'OC', 'Tourismo', 'Travego']
      },
      {
        nombre: 'Volvo',
        modelos: ['B7R', 'B8R', 'B11R', 'B420R', '9700', '9800', '9900']
      },
      {
        nombre: 'Scania',
        modelos: ['K Series', 'F Series', 'Touring']
      },
      {
        nombre: 'Marcopolo',
        modelos: ['Paradiso', 'Viaggio', 'Andare', 'Torino']
      },
      {
        nombre: 'Busscar',
        modelos: ['El Buss', 'Urbanuss', 'Jumbuss']
      },
      {
        nombre: 'Comil',
        modelos: ['Campione', 'Versatile', 'Invictus', 'Svelto']
      },
      {
        nombre: 'Caio',
        modelos: ['Apache', 'Millennium', 'Mondego', 'Solar']
      },
      {
        nombre: 'Mascarello',
        modelos: ['Gran Micro', 'Midi', 'Roma']
      },
      {
        nombre: 'Neobus',
        modelos: ['Thunder', 'Spectrum', 'Mega']
      },
      {
        nombre: 'Agrale',
        modelos: ['MA 8.5', 'MA 9.2', 'MA 15.0']
      },
      {
        nombre: 'Irizar',
        modelos: ['i2', 'i3', 'i4', 'i6', 'i8', 'pb']
      },
      {
        nombre: 'Van Hool',
        modelos: ['TX', 'CX', 'EX', 'TDX']
      },
      {
        nombre: 'Setra',
        modelos: ['ComfortClass', 'TopClass', 'MultiClass']
      },
      {
        nombre: 'MAN',
        modelos: ['Lions City', 'Lions Coach', 'Lions Intercity']
      },
      {
        nombre: 'Iveco',
        modelos: ['Daily', 'Crossway', 'Evadys', 'Magelys']
      }
    ]
  },
  {
    nombre: 'Moto',
    marcas: [
      {
        nombre: 'Honda',
        modelos: ['Wave', 'CBF 125', 'CB 125', 'CB 160', 'CB 190', 'CB 300', 'CB 500', 'CB 650', 'CBR 250', 'CBR 500', 'CBR 650', 'CBR 1000', 'XRE 190', 'XRE 300', 'XR 150', 'XR 190', 'CRF 250', 'CRF 450', 'Africa Twin', 'NC 750', 'Integra', 'Forza', 'PCX', 'Click', 'Dio', 'Elite']
      },
      {
        nombre: 'Yamaha',
        modelos: ['Crypton', 'FZ 16', 'FZ 25', 'MT 03', 'MT 07', 'MT 09', 'MT 10', 'R3', 'R6', 'R1', 'R15', 'XJ6', 'FZ6', 'FZ8', 'FZ1', 'Tracer 700', 'Tracer 900', 'Tenere 250', 'Tenere 700', 'XTZ 125', 'XTZ 150', 'XTZ 250', 'WR 155', 'WR 250', 'WR 450', 'YZ 125', 'YZ 250', 'YZ 450', 'NMAX', 'Aerox', 'Ray', 'Tricity', 'TMAX']
      },
      {
        nombre: 'Suzuki',
        modelos: ['AX 100', 'GN 125', 'GS 125', 'Gixxer 150', 'Gixxer 250', 'GSX 150', 'GSX 250', 'GSX 750', 'GSX 1000', 'GSX-R 150', 'GSX-R 600', 'GSX-R 750', 'GSX-R 1000', 'Hayabusa', 'V-Strom 250', 'V-Strom 650', 'V-Strom 1000', 'DR 150', 'DR 200', 'DR 650', 'RM 85', 'RMZ 250', 'RMZ 450', 'Burgman 125', 'Burgman 200', 'Burgman 400', 'Address']
      },
      {
        nombre: 'Kawasaki',
        modelos: ['Ninja 125', 'Ninja 250', 'Ninja 300', 'Ninja 400', 'Ninja 650', 'Ninja 1000', 'ZX-6R', 'ZX-10R', 'ZX-14R', 'Z 125', 'Z 250', 'Z 400', 'Z 650', 'Z 900', 'Z 1000', 'Z H2', 'Versys 300', 'Versys 650', 'Versys 1000', 'Vulcan S', 'Eliminator', 'KLX 150', 'KLX 230', 'KLX 250', 'KX 85', 'KX 250', 'KX 450', 'KLR 650']
      },
      {
        nombre: 'Bajaj',
        modelos: ['Boxer', 'Pulsar 125', 'Pulsar 150', 'Pulsar 160', 'Pulsar 180', 'Pulsar 200', 'Pulsar 220', 'NS 125', 'NS 160', 'NS 200', 'RS 200', 'Dominar 250', 'Dominar 400', 'Avenger 160', 'Avenger 220', 'Platino', 'Discover', 'CT 100']
      },
      {
        nombre: 'KTM',
        modelos: ['RC 125', 'RC 200', 'RC 390', 'Duke 125', 'Duke 200', 'Duke 250', 'Duke 390', 'Duke 790', 'Duke 890', 'Duke 1290', 'Adventure 250', 'Adventure 390', 'Adventure 790', 'Adventure 890', 'Adventure 1290', 'EXC 150', 'EXC 250', 'EXC 450', 'SX 85', 'SX 125', 'SX 250', 'SX 450']
      },
      {
        nombre: 'Ducati',
        modelos: ['Panigale V2', 'Panigale V4', 'Streetfighter', 'Monster', 'Hypermotard', 'Multistrada', 'Scrambler', 'Diavel', 'XDiavel', 'SuperSport']
      },
      {
        nombre: 'BMW',
        modelos: ['G 310 R', 'G 310 GS', 'F 750 GS', 'F 850 GS', 'F 900 R', 'F 900 XR', 'S 1000 R', 'S 1000 RR', 'S 1000 XR', 'R 1250 GS', 'R 1250 R', 'R 1250 RT', 'R 18', 'K 1600']
      },
      {
        nombre: 'Harley-Davidson',
        modelos: ['Street 750', 'Iron 883', 'Forty-Eight', 'Roadster', 'Low Rider', 'Fat Bob', 'Heritage Classic', 'Road King', 'Street Glide', 'Road Glide', 'Ultra Limited', 'Tri Glide', 'CVO']
      },
      {
        nombre: 'Royal Enfield',
        modelos: ['Classic 350', 'Classic 500', 'Bullet 350', 'Bullet 500', 'Electra', 'Standard', 'Thunderbird', 'Himalayan', 'Interceptor', 'Continental GT', 'Meteor', 'Scram']
      },
      {
        nombre: 'Triumph',
        modelos: ['Street Triple', 'Speed Triple', 'Daytona', 'Tiger 660', 'Tiger 850', 'Tiger 900', 'Tiger 1200', 'Trident', 'Speed Twin', 'Bonneville', 'Scrambler', 'Thruxton', 'Rocket']
      },
      {
        nombre: 'Victory',
        modelos: ['Octane', 'Gunner', 'Judge', 'Hammer', 'Vegas', 'High-Ball', 'Boardwalk', 'Cross Country', 'Cross Roads', 'Vision']
      },
      {
        nombre: 'Indian',
        modelos: ['Scout', 'Chief', 'Chieftain', 'Roadmaster', 'Springfield', 'Challenger', 'FTR']
      },
      {
        nombre: 'Aprilia',
        modelos: ['RS 125', 'RS 250', 'RS 660', 'RSV4', 'Tuono 125', 'Tuono 250', 'Tuono 660', 'Tuono V4', 'Shiver', 'Dorsoduro', 'Caponord']
      },
      {
        nombre: 'Moto Guzzi',
        modelos: ['V7', 'V9', 'V85 TT', 'California', 'Eldorado', 'Audace', 'MGX-21']
      },
      {
        nombre: 'Vespa',
        modelos: ['Primavera', 'Sprint', 'GTS', 'GTV', 'Sei Giorni', 'Elettrica']
      },
      {
        nombre: 'Piaggio',
        modelos: ['Liberty', 'Beverly', 'Medley', 'MP3']
      },
      {
        nombre: 'Kymco',
        modelos: ['Agility', 'Fly', 'Like', 'People', 'Downtown', 'Xciting', 'AK 550']
      },
      {
        nombre: 'SYM',
        modelos: ['Crox', 'Fiddle', 'Jet', 'Orbit', 'Symphony', 'Citycom', 'Maxsym']
      },
      {
        nombre: 'AKT',
        modelos: ['Naked', 'TT', 'RTX', 'CR4', 'TTR', 'SM', 'Enduro', 'Motard', 'Electric']
      },
      {
        nombre: 'Auteco',
        modelos: ['Bajaj Boxer', 'Bajaj Pulsar', 'Bajaj Discover', 'Bajaj Avenger', 'KTM Duke', 'KTM RC', 'KTM Adventure']
      },
      {
        nombre: 'Hero',
        modelos: ['Splendor', 'Passion', 'Glamour', 'Achiever', 'Hunk', 'Xtreme', 'XPulse', 'Pleasure', 'Maestro', 'Destini']
      },
      {
        nombre: 'TVS',
        modelos: ['Apache 160', 'Apache 180', 'Apache 200', 'Apache 310', 'Star City', 'Sport', 'Radeon', 'XL 100', 'Jupiter', 'NTorq', 'iQube']
      },
      {
        nombre: 'UM',
        modelos: ['Renegade', 'Dirt Bike', 'Scooter']
      },
      {
        nombre: 'Benelli',
        modelos: ['TNT 150', 'TNT 300', 'TNT 600', '302R', '502C', 'Leoncino', 'TRK 251', 'TRK 502', 'Imperiale']
      },
      {
        nombre: 'CFMoto',
        modelos: ['NK 150', 'NK 250', 'NK 400', 'NK 650', '300SR', '650GT', '650MT', '650TR', '800MT']
      },
      {
        nombre: 'Zontes',
        modelos: ['310 R', '310 X', '310 T', '310 V', '350 R', '350 X', '350 T', '350 V']
      },
      {
        nombre: 'Loncin',
        modelos: ['LX 150', 'LX 200', 'LX 250', 'VOGE 300', 'VOGE 500', 'VOGE 650']
      },
      {
        nombre: 'Haojue',
        modelos: ['KA 125', 'KA 150', 'DR 160', 'NK 150', 'HJ 125', 'VR 150', 'VS 125', 'TR 150']
      },
      {
        nombre: 'Shineray',
        modelos: ['XY 125', 'XY 150', 'XY 200', 'XY 250', 'XY 400', 'Enduro', 'Motard']
      },
      {
        nombre: 'Jialing',
        modelos: ['JH 125', 'JH 150', 'JH 200', 'Enduro', 'Carga']
      },
      {
        nombre: 'Lifan',
        modelos: ['LF 125', 'LF 150', 'LF 200', 'LF 250', 'KPR', 'KP']
      },
      {
        nombre: 'Dayun',
        modelos: ['DY 125', 'DY 150', 'DY 200', 'Carga']
      },
      {
        nombre: 'Senke',
        modelos: ['SK 125', 'SK 150', 'SK 200', 'SK 250']
      },
      {
        nombre: 'Velossi',
        modelos: ['VLR 125', 'VLR 150', 'VLR 200', 'Cafe Racer']
      },
      {
        nombre: 'Vento',
        modelos: ['Tornado', 'Cyclone', 'Rebellian', 'Streetrod', 'Colt', 'Ryder']
      },
      {
        nombre: 'Italika',
        modelos: ['DM 125', 'DM 150', 'DM 200', 'FT 125', 'FT 150', 'FT 180', 'FT 200', 'RT 200', 'RC 150', 'RC 200', 'RC 250', 'Vort-X 200', 'Vort-X 300', 'Z 150', 'Z 200', 'Z 250', 'ATV 150', 'ATV 180', 'ATV 200', 'Chopper', 'Dama', 'Wsport', 'Xico', 'Xingu', 'Zerex']
      },
      {
        nombre: 'Kurazai',
        modelos: ['Spitfire', 'Hammer', 'Ryder', 'Factor', 'City', 'Delivery', 'Cargo']
      },
      {
        nombre: 'Carabela',
        modelos: ['C 125', 'C 150', 'C 200', 'C 250', 'Enduro', 'Chopper']
      },
      {
        nombre: 'Dinamo',
        modelos: ['R1', 'R2', 'R3', 'Scorpion', 'Custom', 'Cafe Racer']
      },
      {
        nombre: 'Torino',
        modelos: ['150', '200', '250', 'Cafe Racer', 'Custom']
      },
      {
        nombre: 'Islo',
        modelos: ['125', '150', '200', '250', 'Cafe Racer', 'Chopper']
      },
      {
        nombre: 'SSR',
        modelos: ['Razkull', 'Buccaneer', 'Rowdy', 'Sand Viper', 'SR 125', 'SR 150', 'SR 189', 'SR 250', 'Pit Bike']
      },
      {
        nombre: 'Apollo',
        modelos: ['DB 36', 'DB 38', 'RX 150', 'RX 250', 'RFZ', 'Pit Bike']
      },
      {
        nombre: 'Tao Tao',
        modelos: ['Pit Bike', 'Dirt Bike', 'ATV', 'Scooter']
      },
      {
        nombre: 'RPS',
        modelos: ['Pit Bike', 'Dirt Bike', 'ATV']
      },
      {
        nombre: 'Coolster',
        modelos: ['Pit Bike', 'Dirt Bike', 'ATV', 'Go Kart']
      },
      {
        nombre: 'X-PRO',
        modelos: ['Pit Bike', 'Dirt Bike', 'ATV', 'Scooter']
      },
      {
        nombre: 'Ice Bear',
        modelos: ['Pit Bike', 'Dirt Bike', 'ATV', 'Scooter', 'Trike']
      },
      {
        nombre: 'MotoTec',
        modelos: ['Pit Bike', 'Dirt Bike', 'ATV', 'Go Kart', 'Electric']
      },
      {
        nombre: 'Razor',
        modelos: ['Electric Scooter', 'Electric Dirt Bike', 'Go Kart', 'Hoverboard']
      },
      {
        nombre: 'Segway',
        modelos: ['Ninebot', 'GT', 'P', 'E', 'F', 'D']
      },
      {
        nombre: 'Xiaomi',
        modelos: ['Mi Electric Scooter', 'Mi Electric Scooter Pro', 'Mi Electric Scooter 3', 'Mi Electric Scooter 4']
      },
      {
        nombre: 'Pure Electric',
        modelos: ['Air', 'Advance', 'Advance+', 'Pro']
      },
      {
        nombre: 'TurboAnt',
        modelos: ['X7', 'M10', 'V8', 'R9']
      },
      {
        nombre: 'Hiboy',
        modelos: ['S2', 'S2 Pro', 'MAX', 'MAX3', 'Titan', 'P7']
      },
      {
        nombre: 'Gotrax',
        modelos: ['G4', 'GXL V2', 'XR Elite', 'XR Ultra', 'Apex', 'Flex']
      },
      {
        nombre: 'Swagtron',
        modelos: ['Swagger', 'EB', 'SG', 'T580', 'T6', 'Hoverboard']
      },
      {
        nombre: 'Jetson',
        modelos: ['Bolt', 'Eris', 'Rave', 'Sphere', 'Adventure', 'Haze']
      },
      {
        nombre: 'Hover-1',
        modelos: ['Alpha', 'Journey', 'Nomad', 'Pioneer', 'Titan', 'H1']
      },
      {
        nombre: 'SPLACH',
        modelos: ['Twin', 'Ranger', 'Turbo', 'Swift']
      },
      {
        nombre: 'EMOVE',
        modelos: ['Cruiser', 'Touring', 'RoadRunner']
      },
      {
        nombre: 'Voro Motors',
        modelos: ['EMOVE', 'Kaabo', 'Dualtron']
      },
      {
        nombre: 'Kaabo',
        modelos: ['Mantis', 'Wolf Warrior', 'Skywalker', 'Wolf King']
      },
      {
        nombre: 'Dualtron',
        modelos: ['Spider', 'Thunder', 'Storm', 'Ultra', 'Achilleus', 'Victor']
      },
      {
        nombre: 'Zero',
        modelos: ['8', '9', '10', '10X', '11X']
      },
      {
        nombre: 'Speedway',
        modelos: ['Mini 4 Pro', '5', 'Leger']
      },
      {
        nombre: 'Inokim',
        modelos: ['Light', 'Quick', 'OX', 'OXO']
      },
      {
        nombre: 'Mercane',
        modelos: ['WideWheel', 'Jubel', 'MX60']
      },
      {
        nombre: 'Apollo',
        modelos: ['City', 'Explore', 'Ghost', 'Phantom', 'Pro']
      },
      {
        nombre: 'Varla',
        modelos: ['Eagle One', 'Pegasus', 'Wasp']
      },
      {
        nombre: 'Fluid Freeride',
        modelos: ['Horizon', 'Mosquito', 'CityRider', 'Cruz', 'Beach']
      },
      {
        nombre: 'EWheels',
        modelos: ['E2S', 'E3S', 'E4S', 'E5S']
      },
      {
        nombre: 'UScooters',
        modelos: ['Booster', 'GT', 'GT SE']
      },
      {
        nombre: 'TurboWheel',
        modelos: ['Lightning', 'Hornet', 'Dart']
      },
      {
        nombre: 'Minimotors',
        modelos: ['Dualtron', ' Speedway']
      },
      {
        nombre: 'Nami',
        modelos: ['Burn-E', 'Klima', 'Blast']
      },
      {
        nombre: 'Bronco',
        modelos: ['Xtreme', 'Sport', 'Mini']
      },
      {
        nombre: 'Extreme Bull',
        modelos: ['Commander', 'Mini', 'Pro']
      },
      {
        nombre: 'Begode',
        modelos: ['Monster', 'Tesla', 'MSX', 'RS', 'Hero', 'Master', 'EX', 'GT']
      },
      {
        nombre: 'King Song',
        modelos: ['S16', 'S18', 'S19', 'S20', 'S22']
      },
      {
        nombre: 'Inmotion',
        modelos: ['V5', 'V8', 'V10', 'V11', 'V12', 'V13']
      },
      {
        nombre: 'LeaperKim',
        modelos: ['Veteran', 'Patton', 'Sherman', 'Abrams', 'Shirley']
      },
      {
        nombre: 'Veteran',
        modelos: ['Sherman', 'Abrams', 'Patton', 'Shirley']
      },
      {
        nombre: 'Extreme Bull',
        modelos: ['Commander', 'Mini', 'Pro']
      },
      {
        nombre: 'Teverun',
        modelos: ['Blade', 'Fighter', 'Storm']
      },
      {
        nombre: 'Begode',
        modelos: ['Monster', 'Tesla', 'MSX', 'RS', 'Hero', 'Master', 'EX', 'GT']
      },
      {
        nombre: 'King Song',
        modelos: ['S16', 'S18', 'S19', 'S20', 'S22']
      },
      {
        nombre: 'Inmotion',
        modelos: ['V5', 'V8', 'V10', 'V11', 'V12', 'V13']
      },
      {
        nombre: 'LeaperKim',
        modelos: ['Veteran', 'Patton', 'Sherman', 'Abrams', 'Shirley']
      },
      {
        nombre: 'Veteran',
        modelos: ['Sherman', 'Abrams', 'Patton', 'Shirley']
      },
      {
        nombre: 'Extreme Bull',
        modelos: ['Commander', 'Mini', 'Pro']
      },
      {
        nombre: 'Teverun',
        modelos: ['Blade', 'Fighter', 'Storm']
      }
    ]
  }
];

// Años disponibles (desde 1980 hasta el año actual + 1)
export const AÑOS_DISPONIBLES = Array.from(
  { length: new Date().getFullYear() + 2 - 1980 },
  (_, i) => new Date().getFullYear() + 1 - i
);

// Estados de pedido
export const ESTADOS_PEDIDO = [
  { value: 'pendiente', label: 'Pendiente', color: 'bg-yellow-500' },
  { value: 'en_corte', label: 'En Corte', color: 'bg-blue-500' },
  { value: 'en_confeccion', label: 'En Confección', color: 'bg-purple-500' },
  { value: 'terminado', label: 'Terminado', color: 'bg-green-500' },
  { value: 'entregado', label: 'Entregado', color: 'bg-gray-500' }
] as const;
