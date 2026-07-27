import MockAdapter from 'axios-mock-adapter'
import api from './axios'

const mock = new MockAdapter(api, {delayResponse: 800})

const defaultUsers = [
    { id: '1', name: 'Mostafa Nassar', email: 'mostafa@gmail.com', password: '123456', address: 'Beirut', role: 'admin'},
    { id: '2', name: 'Sara Khalil', email: 'user@example.com', password: '123456', address: 'Tripoli', role: 'user' },
]

const storedUsers = localStorage.getItem('fakeUsers')
const fakeUsers = storedUsers ? JSON.parse(storedUsers) : defaultUsers

const saveUsers = () => {
    localStorage.setItem('fakeUsers', JSON.stringify(fakeUsers))
}

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
        saveUsers()

        return [201, {message: 'User registered successfully', user: newUser}]
    
})

mock.onGet('/users').reply(() => {
    //return users without exposing password
    const safeUsers = fakeUsers.map(({password, ...rest}) => rest)
    return[200, safeUsers]
})

mock.onPost('/user').reply((config) => {
    const { name, email, address, password, role } = JSON.parse(config.data)

    const exists = fakeUsers.find((u) => u.email === email)
    if(exists){
        return [400, {message:'User already exists'}]
    }

    const newUser = {
        id: String(fakeUsers.length + 1),
        name,
        email, 
        address,
        password: password || '123456',
        role: role || 'user',
    }
    fakeUsers.push(newUser)
    saveUsers()

    const {password: _, ...safeUser} = newUser
    return[201, {message: 'User created successfully', user: safeUser}]
})

mock.onDelete(/\/delete\/user\/.+/).reply((config) => {
    const id = config.url.split('/').pop()

    const userExists = fakeUsers.find((u) => u.id === id)
    if(!userExists){
        return [404, {message: 'User not found'}]
    }

    const index = fakeUsers.findIndex((u) => u.id === id)
    fakeUsers.splice(index, 1)
    saveUsers()

    return [200, {message: 'User deleted successfully' }]
})

mock.onPut(/\/update\/user\/.+/).reply((config) => {
    const id = config.url.split('/').pop()
    const {name, email, address, role} = JSON.parse(config.data)

    const index = fakeUsers.findIndex((u) => u.id === id)
    if(index === -1){
        return [404, {message: 'User not found'}]
    }

    fakeUsers[index] = {
        ...fakeUsers[index], name, email, address, role
    }
    saveUsers()

    const { password: _, ...safeUser } = fakeUsers[index]
    return [200, {message: 'User updated successfully', user: safeUser }]
})

export default mock