import axios from 'axios';
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NDc5MmNkMjA0YTZmY2NiZTYzMTk2NiIsImlhdCI6MTcxNzYyMTkxNSwiZXhwIjoxNzQ5MTU3OTE1fQ.a0SYaKrQv-jrgBa6wqlbyPQMjoqjMW7eiZJN0Z_Z1XE"

const config = {
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    },
};
describe("endpoint ticket", () => {

    it("should get all tickets", async () => {
        const response = await axios.get('http://localhost:8080/api/ticket')
        const tickets = response.data
        expect(Array.isArray(tickets)).toBe(true)

        if (tickets.length >= 1) {
            tickets.forEach(ticket => {
                expect(ticket).toHaveProperty('_id'); // Verificar que cada usuario tenga una propiedad 'id'
                expect(ticket).toHaveProperty('products'); // Verificar que cada usuario tenga una propiedad 'name'
                expect(ticket).toHaveProperty('total'); // Verificar que cada usuario tenga una propiedad 'name'
                expect(ticket).toHaveProperty('completed'); // Verificar que cada usuario tenga una propiedad 'name'
                expect(ticket).toHaveProperty('tableId'); // Verificar que cada usuario tenga una propiedad 'name'
                expect(ticket).toHaveProperty('waiterId'); // Verificar que cada usuario tenga una propiedad 'name'
                expect(ticket).toHaveProperty('status'); // Verificar que cada usuario tenga una propiedad 'name'
                // Puedes agregar más afirmaciones según las propiedades que esperas recibir
            });
        }
    })

    it('should create a new ticket', async () => {
        const newTicket = {
            products: [
                {
                    name: "Sushi",
                    price: '400',
                    stock: 1,
                    discount: 0,
                    completed: false,
                    recipe: [],
                    _id: "665a61b60556c7e3719bebb1"
                }
            ],
            total: 400,
            completed: false,
            waiterId: "664792cd204a6fccbe631966",
            status: "pending"
        }
        const response = await axios.post('http://localhost:8080/api/ticket/664b82e96cb3f072c7df49f0', newTicket, config)
        const ticket = response.data
        expect(ticket).toHaveProperty('_id'); // Verificar que cada usuario tenga una propiedad 'id'
    })

    // it('should delete a ticket', async () => {
    //     const response = await axios.delete('http://localhost:8080/api/ticket/delete/666347eb73df8a74d4624a92')
    //     const ticket = response.data
    //     expect(ticket).toHaveProperty('_id'); // Verificar que cada usuario tenga una propiedad 'id'
    //  })
})