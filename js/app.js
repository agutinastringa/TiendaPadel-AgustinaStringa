const contenedorProductos = document.getElementById('contenedorProductos');

const tbody = document.querySelector('.tbody');
let carrito = [];
fetch('/js/productos.json')
    .then((res) => res.json())
    .then((data) => {
        data.forEach((producto) =>{
            const div = document.createElement('div')
            div.classList.add('card');
            div.innerHTML = 
                        `<img src=${producto.img} class="card-img-top" alt="conjunto">
                        <div class="card-body">
                        <h5 class="card-title">${producto.nombre}</h5>
                        <p class="card-price">$${producto.precio}</p>
                        <a href="#" id="agregar${producto.id}" class="btn btn-primary btn-anadir">Añadir al carrito</a>
                        </div>` 
            contenedorProductos.append(div)

            const clickButton = document.getElementById(`agregar${producto.id}`);
            clickButton.addEventListener('click', () => {
                addToCarritoItem(producto.id)
            })
        })
    })


//Función para agregar un ítem al carrito
function addToCarritoItem(prodId){
    const newItem = data.find((prod) => prod.id === prodId)

            // title: prod.nombre,
            // precio: prod.precio,
            // img: prod.img,
            // cantidad: 1
        
        // addItemCarrito(newItem)
}

//Función para guardar el ítem en el carrito, sumar total 
function addItemCarrito(newItem){
    const{title, precio, img, cantidad} = newItem;
    const inputElemento = tbody.getElementsByClassName('inputCantidad');
    swal({
        title: "Producto añadido al carrito!",
        icon: "success",
        button: false,
        timer: 1500
    });
    for(let i=0; i < carrito.length; i++){
        if(carrito[i].title.trim() === title.trim()){
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

//Función que modifica el HTML para que muestre la tabla del carrito con sus ítems.
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

//Función encargada de calcular el total del carrito.
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

//Función para eliminar ún ítem del carrito
function removeItemCarrito(e){
    const buttonDelete = e.target;
    const tr = buttonDelete.closest('.itemCarrito');
    const title = tr.querySelector('.title').textContent;
    for(let i=0; i<carrito.length; i++){
        carrito[i].title.trim() === title.trim() && carrito.splice(i, 1);
    }
    swal({
        title: "Producto eliminado del carrito!",
        icon: "error",
        button: false,
        timer: 1500
    });
    tr.remove();
    carritoTotal();
}

//Función para sumar la cantidad deun ítem
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