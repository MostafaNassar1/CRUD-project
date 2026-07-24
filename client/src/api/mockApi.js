import MockAdapter from 'axios-mock-adapter'
import api from './axios'

const mock = new MockAdapter(api, {delayResponse: 800})

const fakeUsers = [
    { id: '1', name: 'Mostafa Nassar', email: 'mostafa@gmail.com', password: '123456', address: 'Beirut', role: 'admin'},
    { id: '2', name: 'Sara Khalil', email: 'user@example.com', password: '123456', address: 'Tripoli', role: 'user' },
]

mock.onPost('/auth/login').reply((config) => {
    const {email, password} = JSON.parse(config.data)
    const user = fakeUsers.find((u) => u.email === email && u.password === password)

    if(!user) {
        return [401, {message: 'Invalid credentials'}]
    }

    return [200,{ message: 'Login successful', user: {id: user.id, name: user.name, email:user.email, role: user.role,},},]
})

mock.onPost('auth/register').reply((config) => {
    const { name, email, address, password } = JSON.parse(config.data)

    const exists = fakeUsers.find((u) => u.email === email)
    if(exists){
        return [400, {message: 'User already exists'}]
    }

    const newUser = {
        id: String(fakeUsers.length + 1), name, email, address, password, role: 'User',}
        fakeUsers.push(newUser)

        return [201, {message: 'User registered successfully', user: newUser}]
    
})

export default mock