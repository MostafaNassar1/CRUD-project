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

mock.onPost('/auth/register').reply((config) => {
    const { name, email, address, password } = JSON.parse(config.data)

    const exists = fakeUsers.find((u) => u.email === email)
    if(exists){
        return [400, {message: 'User already exists'}]
    }

    const newUser = {
        id: crypto.randomUUID(), name, email, address, password, role: 'user',}
        fakeUsers.push(newUser)
        saveUsers()

        return [201, {message: 'User registered successfully', user: newUser}]
    
})

mock.onGet(/^\/users(\?.*)?$/).reply((config) => {
    const url = new URL(config.url, 'http://localhost')
    const page = parseInt(url.searchParams.get('page')) || 1
    const limit = parseInt(url.searchParams.get('limit')) || 5

    const safeUsers = fakeUsers.map(({password, ...rest}) => rest)

    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedUsers = safeUsers.slice(startIndex, endIndex)

    return[200, {
        users: paginatedUsers,
        totalUsers: safeUsers.length,
        totalPages: Math.ceil(safeUsers.length / limit),
        currentPage: page
    }]
})

mock.onGet(/\/user\/.+/).reply((config) => {
    const id = config.url.split('/').pop()

    const user = fakeUsers.find((u) => u.id === id)
    if (!user) {
        return[404, {message: 'User not found'}]
    }

    const { password, ...safeUser } = user
    return[200, safeUser]
})

mock.onPost('/user').reply((config) => {
    const { name, email, address, password, role } = JSON.parse(config.data)

    const exists = fakeUsers.find((u) => u.email === email)
    if(exists){
        return [400, {message:'User already exists'}]
    }

    const newUser = {
        id: crypto.randomUUID(),
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


mock.onGet(/\/search/).reply((config) => {
    const url = new URL(config.url, 'http://localhost')
    const query = url.searchParams.get('q')?.toLowerCase() || ''

    const results = fakeUsers.filter((u) => 
        u.name.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query) ||
        u.address.toLowerCase().includes(query)
    )

    const safeResults = results.map(({password, ...rest}) => rest)
    return [200, safeResults]
})

mock.onGet(/\/users\/filter/).reply((config) => {
    const url = new URL(config.url, 'http://localhost')
    const name = url.searchParams.get('name')?.toLowerCase() || ''
    const email = url.searchParams.get('email')?.toLowerCase() || ''
    const address = url.searchParams.get('address')?.toLowerCase() || ''
    const sort = url.searchParams.get('sort') || ''

    let results = fakeUsers.filter((u) => 
        u.name.toLowerCase().includes(name) &&
        u.email.toLowerCase().includes(email) &&
        u.address.toLowerCase().includes(address)
    )

    if (sort) {
        const field = sort.replace('-', '')
        const isDescending = sort.startsWith('-')

        results = [...results].sort((a,b) => {
            if(a[field] < b[field]) 
                return isDescending ? 1:-1
            if(a[field] > b[field])
                return isDescending ? -1:1
            return 0
        })
    }

    const safeResults = results.map(({password, ...rest}) => rest)
    return[200, safeResults]
})

mock.onPost(/\/user\/.+\/photo/).reply((config) => {
    const id = config.url.split('/')[2]
    const { photo } = JSON.parse(config.data)

    const index = fakeUsers.findIndex((u) => u.id === id)
    if( index === -1){
        return [404, {message: 'User not found'}]
    }

    fakeUsers[index].photo = photo
    saveUsers()

    const {password: _, ...safeUser} = fakeUsers[index]
    return [200, {message: 'Phot uploaded successfully', user: safeUser}]
})

mock.onDelete(/\/user\/.+\/photo/).reply((config) => {
    const id = config.url.split('/')[2]

    const index = fakeUsers.findIndex((u) => u.id === id)
    if (index === -1) {
        return[404, {message: 'User not found'}]
    }

    fakeUsers[index].photo = null
    saveUsers()

    return[200, {message: 'Photo deleted successfully'}]
})

export default mock