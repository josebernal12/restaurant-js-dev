import {
    createCategory,
    deleteCategory,
    getAllCategory,
    getCategoryById,
    updateCategory
} from "../services/category.js"

export const createCategoryController = async (req, res) => {

    const { name, color, idFather, path, companyId } = req.body
    const category = await createCategory(name, color, idFather, path, companyId)
    if (category?.msg) {
        return res.status(400).json(category)
    }
    res.json(category)
}

export const updateCategoryController = async (req, res) => {
    const { name, color, idFather, path, companyId } = req.body
    const { id } = req.params

    const category = await updateCategory(id, name, color, idFather, path, companyId)
    if (category?.msg) {
        return res.status(400).json(category)
    }
    res.json(category)
}

export const deleteCategoryController = async (req, res) => {
    const { id } = req.params

    const category = await deleteCategory(id)
    if (category?.msg) {
        return res.status(400).json(category)
    }
    res.json(category)
}


export const getAllCategoryController = async (req, res) => {

    const category = await getAllCategory(req.user.companyId.toString())

    if (category?.msg) {
        return res.status(400).json(category)
    }
    res.json(category)
}

export const getCategoryByIdController = async (req, res) => {

    const { id } = req.params

    const category = await getCategoryById(id)
    if (category?.msg) {
        return res.status(400).json(category)
    }
    res.json(category)

}