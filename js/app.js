const clickButton = document.querySelectorAll('.btn-anadir');
const tbody = document.querySelector('.tbody');
let carrito = [];
clickButton.forEach(btn => {
    btn.addEventListener('click', addToCarritoItem);
})

function addToCarritoItem(e){
    const button = e.target;
    const item = button.closest('.card');
    const itemTitle = item.querySelector('.card-title').textContent;
    const itemPrice = item.querySelector('.card-price').textContent;
    const itemImg = item.querySelector('.card-img-top').src;
    
    const newItem = {
        title: itemTitle,
        precio: itemPrice,
        img: itemImg,
        cantidad: 1
    }

    addItemCarrito(newItem);
}

function addItemCarrito(newItem){
    const alert = document.querySelector('.alert');
    setTimeout(function(){
        alert.classList.add('hide');
    }, 2000)
    alert.classList.remove('hide');
    const inputElemento = tbody.getElementsByClassName('inputCantidad')
    for(let i=0; i < carrito.length; i++){
        if(carrito[i].title.trim() === newItem.title.trim()){
            carrito[i].cantidad ++;
            const inputCantidad = inputElemento[i];
            inputCantidad.value++;
            carritoTotal();
            return null;
        }
    }
    carrito.push(newItem);
    renderCarrito();
}

function renderCarrito(){
    tbody.innerHTML = '';
    carrito.map(item => {
        const tr =document.createElement('tr');
        tr.classList.add('itemCarrito')
        tr.innerHTML = `<th scope="row">1</th>
                        <td class="table-productos">
                            <img class="img-prod-carrito" src=${item.img} alt="">
                            <h6 class="title">${item.title}</h6>
                        </td>
                        <td class="table-precio">
                            <p>${item.precio}</p></td><td class="table-cantidad">
                            <input class='inputCantidad' type="number" min="1" value=${item.cantidad}>
                            <button class="delete btn btn-danger">X</button>
                        </td>`;
        tbody.append(tr);
        tr.querySelector('.delete').addEventListener('click', removeItemCarrito);
        tr.querySelector('.inputCantidad').addEventListener('change', sumaCantidad);
    })
    carritoTotal()
}

function carritoTotal(){
    let total = 0;
    const itemCarrTotal = document.querySelector('.itemCarTotal');
    carrito.forEach((item) => {
        const precio = Number(item.precio.replace("$", ''))
        total = total + precio * item.cantidad;
    })
    itemCarrTotal.innerHTML = `Total $${total}`;
    addLocalStorage();
}

function removeItemCarrito(e){
    const buttonDelete = e.target;
    const tr = buttonDelete.closest('.itemCarrito');
    const title = tr.querySelector('.title').textContent;
    for(let i=0; i<carrito.length; i++){
        if(carrito[i].title.trim() === title.trim()){
            carrito.splice(i, 1);
        }
    }
    const alert = document.querySelector('.remove');
    setTimeout(function(){
        alert.classList.add('remove');
    }, 2000)
    alert.classList.remove('remove');
    tr.remove();
    carritoTotal();
}

function sumaCantidad(e){
    const inputSuma = e.target;
    const tr = inputSuma.closest('.itemCarrito');
    const title = tr.querySelector('.title').textContent;
    carrito.forEach(item => {
        if(item.title.trim() === title){
            inputSuma.value < 1 ? (inputSuma.value = 1) : inputSuma.value;
            item.cantidad = inputSuma.value;
            carritoTotal();
        }
    })
}

function addLocalStorage(){
    localStorage.setItem('carrito', JSON.stringify(carrito))
}

window.onload = function(){
    const storage= JSON.parse(localStorage.getItem('carrito'));
    if(storage){
        carrito = storage;
        renderCarrito();
    }
}