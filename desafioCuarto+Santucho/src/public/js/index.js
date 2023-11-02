console.log('hola js');

const socket = io()

const form = document.getElementById('form')
const productsTable = document.querySelector('#productsTable')
const tbody = productsTable.querySelector('#tbody')

form.addEventListener('submit', async (e) => {
    e.preventDefault()

    let product = {
        title: document.querySelector('#title').value,
        description: document.querySelector('#description').value,
        price: document.querySelector('#price').value,
        code: document.querySelector('#code').value,
        category: document.querySelector('#category').value,
        stock: document.querySelector('#stock').value,
    }

    const res = await fetch('/api/products', {
        method: 'POST',
        body: JSON.stringify(product),
        headers: {
            'Content-Type': 'application/json',
        }
    })

    try {
        const result = await res.json()
        if (result.status === 'error') {
            throw new Error(result.error)
        } else {
            const resultProducts = await fetch('/api/products')
            const results = await resultProducts.json()

            if (results.status === 'error') {
                throw new Error(results.error)
            } else {
                socket.emit('productList', results.products)

                console.log('Product added');

                document.querySelector('#title').value = ''
                document.querySelector('#description').value = ''
                document.querySelector('#price').value = ''
                document.querySelector('#code').value = ''
                document.querySelector('#category').value = ''
                document.querySelector('#stock').value = ''
            }
        }            
    } catch (error) {
        console.log(error)
    }
})

const deleteProduct = async (id) => {
    try {
        const res = await fetch(`/api/products/${id}`, {
            method: 'DELETE',
        })
        const result = await res.json()

        if (result.status === 'error') throw new Error(result.error)
        else socket.emit('productList', result.products)

        console.log('Product removed');
    } catch (error) {
        console.log(error)
    }
}

socket.on('updatedProducts', products => {      
    tbody.innerHTML = ''

    products.forEach(item => {              
        const tr = document.createElement('tr')
        tr.innerHTML = `
            <td>${item.title}</td>
            <td>${item.description}</td>
            <td>${item.price}</td>
            <td>${item.code}</td>
            <td>${item.category}</td>
            <td>${item.stock}</td>
            <td>
                <button class='btn btn-danger' onclick='deleteProduct(${item.id})' id='btnDelete'>Eliminar</button>
            </td>
        `
        tbody.appendChild(tr)
    })
}) 