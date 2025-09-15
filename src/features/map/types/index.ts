export type ClientLocation = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  latitude: number;
  longitude: number;
  avatar?: string;
  status: "active" | "inactive";
  lastContact?: string;
  totalCollections?: number;
};

export type MapConfig = {
  center: {
    lat: number;
    lng: number;
  };
  zoom: number;
  mapTypeId: string;
};

export type MarkerInfo = {
  position: {
    lat: number;
    lng: number;
  };
  client: ClientLocation;
};

export const DEFAULT_MAP_CONFIG: MapConfig = {
  center: {
    lat: 6.5244, // Lagos, Nigeria (adjust for your location)
    lng: 3.3792,
  },
  zoom: 10,
  mapTypeId: "roadmap",
};
