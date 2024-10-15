import axios from 'axios';
import { faker } from '@faker-js/faker';
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NDc5MmNkMjA0YTZmY2NiZTYzMTk2NiIsImlhdCI6MTcxNzYyMTkxNSwiZXhwIjoxNzQ5MTU3OTE1fQ.a0SYaKrQv-jrgBa6wqlbyPQMjoqjMW7eiZJN0Z_Z1XE"

const config = {
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    },
};
describe("endpoint user", () => {
    it('should fetch the users', async () => {

        const response = await axios.get('http://localhost:8080/api/user/users', config);
        const users = response.data.users; // Acceder directamente a la propiedad 'users' de los datos

        // Realizar afirmaciones sobre los resultados obtenidos
        expect(Array.isArray(users)).toBe(true); // Verificar que los usuarios sean un arreglo

        // También puedes verificar propiedades específicas de los usuarios si lo deseas
        // users.forEach(user => {
        //     expect(user).toHaveProperty('_id'); // Verificar que cada usuario tenga una propiedad 'id'
        //     expect(user).toHaveProperty('name'); // Verificar que cada usuario tenga una propiedad 'name'
        //     // Puedes agregar más afirmaciones según las propiedades que esperas recibir
        // });
    });

    // it('should create a new user', async () => {
    //     const newUser = {
    //         name: faker.internet.userName(),
    //         email: faker.internet.email(),
    //         password: 'Chetisape11',
    //         confirmPassword: "Chetisape11",
    //     };

    //     const response = await axios.post('http://localhost:8080/api/user/register', newUser, config);
    //     const user = response.data.user; // Acceder directamente a la propiedad 'user' de los datos
    //     expect(user.user.name).toEqual(newUser.name);
    //     expect(user.user.email).toEqual(newUser.email);
    // })

    // it('should update user', async () => {
    //     const updateUser = {
    //         name: faker.internet.userName(),
    //         email: faker.internet.email(),
    //     };
    //     const id = "6660db6212ee40c10172852e"
    //     const response = await axios.put(`http://localhost:8080/api/user/users/update/${id}`, updateUser, config);
    //     const user = response.data.user; // Acceder directamente a la propiedad 'user' de los datos
    //     console.log(user);
    //     expect(user.user.name).toEqual(updateUser.name);
    //     expect(user.user.email).toEqual(updateUser.email);
    // })
})