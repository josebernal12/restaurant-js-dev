import clientModel from "../model/ClientModel.js";
export const addClient = async (
  name,
  phone,
  street,
  colonia,
  ref,
  companyId
) => {
  try {
    const client = await clientModel.create({
      name,
      phone,
      street,
      colonia,
      ref,
      companyId,
    });
    if (!client) {
      return {
        msg: "error creating client",
      };
    }
    return client;
  } catch (error) {
    console.log(error);
  }
};

export const updateClient = async (
  id,
  name,
  phone,
  street,
  colonia,
  ref,
  companyId
) => {
  try {
    const client = await clientModel.findByIdAndUpdate(
      id,
      {
        name,
        phone,
        street,
        colonia,
        ref,
        companyId,
      },
      { new: true }
    );
    if (!client) {
      return {
        msg: "error creating client",
      };
    }
    return client;
  } catch (error) {
    console.log(error);
  }
};

export const deleteClient = async (id) => {
  try {
    const client = await clientModel.findByIdAndDelete(id, { new: true });

    if (!client) {
      return {
        msg: "error creating client",
      };
    }
    return client;
  } catch (error) {
    console.log(error);
  }
};

export const getClientById = async (id) => {
  try {
    const client = await clientModel.findById(id);
    if (!client) {
      return {
        msg: "error creating client",
      };
    }
    return client;
  } catch (error) {
    console.log(error);
  }
};

export const getClients = async (companyId) => {
  try {
    const client = await clientModel.find({ companyId });
    if (!client) {
      return {
        msg: "error creating client",
      };
    }
    return client;
  } catch (error) {
    console.log(error);
  }
};
