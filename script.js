
const baseUrl = 'https://fakestoreapi.com'

/** components **/

const usersList = (users) => {
    return `<p class="subtitle">Users:</p>
            <ul class="users">
                ${users.map(user => `<li><a class="user-anchor" data-user-id="${user.id}" href="#">${user.name.firstname} ${user.name.lastname}</a></li>`).join('')}
            </ul>`}

const singleUser = (user) => {
    const {address, email, name, password, phone, username, id} = user
    return `<p class="subtitle">User details:</p>
        <div class="single-user-container">
            <div><b>username:</b> ${username}</div>
            <div><b>full name:</b> ${name.firstname} ${name.lastname}</div>
            <div><b>email:</b> ${email}</div>
            <div><b>address:</b> ${address.number} ${address.street}, ${address.city}</div>
            <div><b>phone number:</b> ${phone}</div>
            <button id="carts-button">Show Carts</button>
        </div>`
}

const cartsDetails = (carts) => {
    if (carts.length > 0) {
        return `<p class="subtitle">User carts</p><div class="carts-details-container">${carts.map(({date, products}) => {
            const dateAdded = new Date(date);
            return `<div class="cart-date">date added: ${dateAdded.toLocaleDateString()}</div> <ul>${products.map(({productId, quantity}) => {
                return `<li class="product"><div><span><b>product id:</b> ${productId}</span><span><b>quantity:</b> ${quantity}</span></div></li>`
            }).join('')}</ul>`
        }).join('')}</div>` }
    return '<div class="cart-date info">There are no items added by this user</div>';
}

/** set component functions **/

const setSingleUser = (userId) => {
    const  singleUserContainer = document.getElementById('single-user');
    singleUserContainer.classList.remove('active');
    setCartsDetails();

    getUserById(userId).then(user => {
        singleUserContainer.innerHTML = singleUser(user);
        document.getElementById('carts-button').addEventListener('click', () => {
            singleUserContainer.classList.add('active');
            setCartsDetails(userId);
        })
    })
}

const setCartsDetails = (userId = '') => {
    const cartsDetailsContainer = document.getElementById('carts-details');
    userId === '' ? cartsDetailsContainer.innerHTML = '' :
    getCartsByUserId(userId).then(carts => {
       cartsDetailsContainer.innerHTML = cartsDetails(carts);
    })
}

/** API get functions **/

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

/** set listeners **/

const addAnchorsEventListeners = () => {
    const anchors = document.getElementsByClassName('user-anchor');
    Array.from(anchors).forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const activeElements = document.getElementsByClassName('active');
            Array.prototype.forEach.call(activeElements, (el) => {
                el.classList.remove('active');
            })
            const userId = e.target.dataset.userId;
            e.target.classList.add('active')
            e.preventDefault();
            setSingleUser(userId)
        });
    });
}

/** init **/

const init = () => {
    const usersContainer = document.getElementById('users');
    getAllUsers()
        .then(res => {
            usersContainer.innerHTML = usersList(res);
        })
        .then(addAnchorsEventListeners)
        .catch( (err) => console.log({message:err}) );
}


window.onload = () => {
    init();
}