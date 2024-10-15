import {
  createCompany,
  findCompanyById,
  updateCompany,
} from "../services/company.js";

export const createCompanyController = async (req, res) => {
  const { name, email, address, phone, country, currency } = req.body;
  const company = await createCompany(
    name,
    email,
    address,
    phone,
    country,
    currency,
    req.user._id.toString()
  );
  if (company?.msg) {
    return res.status(400).json(company);
  }
  res.json(company);
};

export const updateCompanyController = async (req, res) => {
  const { id } = req.params;
  const { name, email, address, phone, country, currency } = req.body;

  const company = await updateCompany(
    id,
    name,
    email,
    address,
    phone,
    country,
    currency,
    req.user._id.toString()
  );

  if (company?.msg) {
    return res.status(400).json(company);
  }
  res.json(company);
};

export const findCompanyByIdController = async (req, res) => {
  const { id } = req.params;
  const company = await findCompanyById(id);
  if (company?.msg) {
    return res.status(400).json(company);
  }
  res.json(company);
};
