import axios from "axios";

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NDc5MmNkMjA0YTZmY2NiZTYzMTk2NiIsImlhdCI6MTcxNzYyMTkxNSwiZXhwIjoxNzQ5MTU3OTE1fQ.a0SYaKrQv-jrgBa6wqlbyPQMjoqjMW7eiZJN0Z_Z1XE"

const config = {
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    },
};
describe("endpoint bill", () => {
    it("should get all", async () => {
        const response = await axios.get('http://localhost:8080/api/bill', config)
        const bills = response.data.billsFiltered
        expect(Array.isArray(bills)).toBe(true)
    })
})