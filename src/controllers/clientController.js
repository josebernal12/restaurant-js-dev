import {
  addClient,
  deleteClient,
  getClientById,
  getClients,
  updateClient,
} from "../services/client.js";

export const addClientController = async (req, res) => {
  const { name, phone, street, colonia, ref, companyId } = req.body;
  const client = await addClient(name, phone, street, colonia, ref, companyId);
  if (client?.msg) {
    return res.status(404).json(client);
  }
  return res.json(client);
};

export const updateClientController = async (req, res) => {
  const { name, phone, street, colonia, ref, companyId } = req.body;
  const { id } = req.params;
  const client = await updateClient(
    id,
    name,
    phone,
    street,
    colonia,
    ref,
    companyId
  );
  if (client?.msg) {
    return res.status(404).json(client);
  }
  return res.json(client);
};

export const getClientsController = async (req, res) => {
  const client = await getClients(req.user.companyId);
  if (client?.msg) {
    return res.status(404).json(client);
  }
  return res.json(client);
};

export const getClientByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const client = await getClientById(id);
    if (client?.msg) {
      return res.status(404).json(client);
    }
    return res.json(client);
  } catch (error) {
    console.log(error);
  }
};

export const deleteClientController = async (req, res) => {
  try {
    const { id } = req.params;
    const client = await deleteClient(id);
    if (client?.msg) {
      return res.status(404).json(client);
    }
    return res.json(client);
  } catch (error) {
    console.log(error);
  }
};
