
const baseUrl = 'https://fakestoreapi.com'

const addUsersList = (users) => {
    return `<h2 class="subtitle">Users list:</h2>
            <ul class="users">
                ${users.map(user => `<li><a class="user-anchor" data-user-id="${user.id}" href="#">${user.name.firstname} ${user.name.lastname}</a></li>`).join('')}
            </ul>`}

const addSingleUser = (user) => {
    const {address, email, name, password, phone, username, id} = user
    return `<div class="single-user-container">
        <div>username: ${username}</div>
        <div>full name: ${name.firstname} ${name.lastname}</div>
        <div>email: ${email}</div>
        <div>address: ${address.number} ${address.street}, ${address.city}</div>
        <div>phone number: ${phone}</div>
        <button id="carts-button">Show Carts</button>
    </div>`
}

const setSingleUser = (userId) => {
    setCartsDetails();

    getUserById(userId).then(user => {
        const  singleUserContainer = document.getElementById('single-user');
        singleUserContainer.innerHTML = addSingleUser(user);
        document.getElementById('carts-button').addEventListener('click', () => {
            setCartsDetails(userId);
        })
    })
}

const addCartsDetails = (carts) => {
    if (carts.length > 0) {
    return `${carts.map(({date, products}) => {
        const dateAdded = new Date(date);
        return `<div><div>date added: ${dateAdded.toLocaleDateString()}</div> ${products.map(({productId, quantity}) => {
            return `<div><span>product id: ${productId}</span><span>quantity: ${quantity}</span></div>`
        }).join('')}</div>`
    }).join('')}` }
    return '<div>There are no items added to this users\' carts</div>';
}

const setCartsDetails = (userId = '') => {
    const cartsDetailsContainer = document.getElementById('carts-details');
    userId === '' ? cartsDetailsContainer.innerHTML = '' :
    getCartsByUserId(userId).then(carts => {
        console.log(carts)
       cartsDetailsContainer.innerHTML = addCartsDetails(carts);
    })
}

const getAllUsers = async () => {
    return await fetch(`${baseUrl}/users`)
        .then((response) => {
            if (!response.ok) {
                throw Error(`error status: ${response.status.toString()}`)
            }
            return response.json()
        })
}

const getUserById = async (userId) => {
    return await fetch(`${baseUrl}/users/${userId}`)
        .then((response) => {
            if (!response.ok) {
                throw Error(`error status: ${response.status.toString()}`)
            }
            return response.json()
        })
}

const getCartsByUserId = async (userId) => {
    return await fetch(`${baseUrl}/carts/user/${userId}`)
        .then((response) => {
            if (!response.ok) {
                throw Error(`error status: ${response.status.toString()}`)
            }
            return response.json()
        })
}

const addAnchorsEventListeners = () => {
    const anchors = document.getElementsByClassName('user-anchor');
    Array.from(anchors).forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const activeElements = document.getElementsByClassName('active');
            Array.prototype.forEach.call(activeElements, (el) => {
                el.classList.remove('active');
            })
            // activeElements.length > 0 && activeElements.forEach(el => {
            //     console.log(el)
            // });
            console.log(activeElements)
            const userId = e.target.dataset.userId;
            e.target.classList.add('active')
            e.preventDefault();
            setSingleUser(userId)
        });
    });
}

window.onload = () => {
    const usersContainer = document.getElementById('users');
    getAllUsers()
        .then(res => {
        usersContainer.innerHTML = addUsersList(res);
    })
        .then(addAnchorsEventListeners)
        .catch( (err) => console.log({message:err}) );
}
