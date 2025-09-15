import { useMemo } from "react";
import type { ClientLocation } from "../types";

// Datos de prueba para Lagos, Nigeria
const MOCK_CLIENTS: ClientLocation[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+234 123 456 7890",
    address: "Victoria Island, Lagos, Nigeria",
    latitude: 6.4316,
    longitude: 3.4219,
    avatar: "",
    status: "active",
    lastContact: "2024-03-15",
    totalCollections: 150_000,
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+234 987 654 3210",
    address: "Ikoyi, Lagos, Nigeria",
    latitude: 6.4506,
    longitude: 3.423,
    avatar: "",
    status: "active",
    lastContact: "2024-03-14",
    totalCollections: 89_000,
  },
  {
    id: "3",
    name: "Michael Johnson",
    email: "michael.j@example.com",
    phone: "+234 555 123 4567",
    address: "Surulere, Lagos, Nigeria",
    latitude: 6.4969,
    longitude: 3.3612,
    avatar: "",
    status: "inactive",
    lastContact: "2024-02-28",
    totalCollections: 45_000,
  },
  {
    id: "4",
    name: "Sarah Williams",
    email: "sarah.w@example.com",
    phone: "+234 777 888 9999",
    address: "Lekki, Lagos, Nigeria",
    latitude: 6.4474,
    longitude: 3.4734,
    avatar: "",
    status: "active",
    lastContact: "2024-03-16",
    totalCollections: 210_000,
  },
  {
    id: "5",
    name: "David Brown",
    email: "david.brown@example.com",
    phone: "+234 333 444 5555",
    address: "Ikeja, Lagos, Nigeria",
    latitude: 6.6018,
    longitude: 3.3515,
    avatar: "",
    status: "active",
    lastContact: "2024-03-10",
    totalCollections: 175_000,
  },
];

export const useClientsWithLocation = () => {
  const clients = useMemo(() => MOCK_CLIENTS, []);

  const getClientById = (id: string) => {
    return clients.find((client) => client.id === id);
  };

  const getActiveClients = () => {
    return clients.filter((client) => client.status === "active");
  };

  return {
    clients,
    getClientById,
    getActiveClients,
  };
};
