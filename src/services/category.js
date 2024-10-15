import categoryModel from "../model/CategoryModel.js"

export const createCategory = async (name, color, idFather, path, companyId) => {
    try {
        // if (!name || !color) {
        //     return {
        //         msg: 'todos los campos son obligatorios'
        //     }
        // }

        const category = await categoryModel.create({ name, color, idFather, path, companyId })
        if (!category) {
            return {
                msg: 'error al crear una categoria'
            }
        }
        return category
    } catch (error) {
        console.log(error)
    }
}

export const updateCategory = async (id, name, color, idFather, path, companyId) => {
    try {
        if (!name || !color || !path) {
            return {
                msg: 'todos los campos son obligatorios'
            }
        }

        const category = await categoryModel.findByIdAndUpdate(id, { name, color, idFather, path, companyId }, { new: true })
        if (!category) {
            return {
                msg: 'no hay categoria con ese id'
            }
        }
        return category
    } catch (error) {
        console.log(error)
    }
}

export const deleteCategory = async (id) => {
    try {
        // Encontrar la categoría a eliminar
        const category = await categoryModel.findById(id);
        if (!category) {
            return { msg: 'no hay categoria con ese id' };
        }

        const idFather = category.idFather;

        // Eliminar la categoría
        await categoryModel.findByIdAndDelete(id);

        // Reasignar subcategorías
        await categoryModel.updateMany(
            { idFather: id },
            { idFather: idFather }
        );

        return { message: 'Categoría eliminada y subcategorías reasignadas' };
    } catch (error) {
        console.log(error);
        return { msg: 'Error al eliminar la categoría' };
    }
};
export const getAllCategory = async (companyId) => {
    try {
        const category = await categoryModel.find({ companyId })
        if (!category) {
            return {
                category: []
            }
        }
        return category
    } catch (error) {
        console.log(error)
    }
}

export const getCategoryById = async (id) => {
    try {
        const category = await categoryModel.findById(id)
        if (!category) {
            return {
                msg: 'no hay categoria con ese id'
            }
        }
        return category
    } catch (error) {
        console.log(error)
    }
}









