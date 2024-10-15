import { HfInference } from '@huggingface/inference'

const hf = new HfInference(process.env.RESTAURANTTOKEN)

export const questionAnsweringDashboard = async (question) => {
    const result = await hf.questionAnswering({
        model: process.env.MODELHUGGINGFACE,
        inputs: {
            question,
            context : "en dashboard puedes ver ventas totales, total dinero recibido, productos disponibles,inventario disponible, productos mas vendidos, meseros con mas ventas, ventas esta semana"
        }
    })
    return result
}


export const questionAnsweringOrders = async (question) => {
    const result = await hf.questionAnswering({
        model: process.env.MODELHUGGINGFACE,
        inputs: {
            question,
            context: "en la sección de pedidos puedes ver pedidos en proceso, pedidos completados, tiempo promedio de preparación, tiempo promedio de entrega, pedidos cancelados, pedidos recurrentes"
        }
    })
    return result
}

export const questionAnsweringUsers = async (question) => {
    const result = await hf.questionAnswering({
        model: process.env.MODELHUGGINGFACE,
        inputs: {
            question,
            context: "en control de empleados puedes ver información de usuarios, ventas diarias totales, ventas semanales totales, puedes editar usuarios "
        }
    })
    return result
}