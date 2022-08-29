let resultado = 0
const cartContainer = document.querySelector("#cart")
let carrito = JSON.parse(localStorage.getItem("Carrito"))
const contadorCarrito = document.querySelector("#cart-counter")

var productos = []

const getProducts = async () => {
  return fetch('./js/data.json').then((res) => res.json()).then((data) => data)
}

async function main(){
  productos = await getProducts()
  imprimirProductos(productos)
  vaciarCarrito()
  reviews()
}

main();


function imprimirProductos(productos) {
  document.getElementById("prod").innerHTML = ""
  for (let producto of productos) {
    let {img,nombre,precio,id} = producto             // <---- DESESTRUCTURACION ---->
    let cardNueva = document.createElement("div")
    cardNueva.innerHTML = ` <img class="mx-auto d-block" src=${img} width="100">
    <h5 class="card-title">${nombre}</h5>
    <div class="card-body">
      <h5 class="card-text fw-bold">$ ${precio}</h5>
      <button id="${id}" class="btn btn-info third">Añadir al carrito</button>
    </div>`
    document.getElementById("prod").append(cardNueva)
    cardNueva.classList.add("card", "col-3", "m-3")
  }

  const botones = document.querySelectorAll(".third")
  for (const boton of botones) {
    boton.addEventListener("click", (e)=>{
      agregarProducto(e)
      swal("Agregaste el producto al tu carrito", {
        icon: "success"
      });
    });
  }
}

// <---- OPERADOR TERNARIO ---->
carrito ? actualizarCarrito(carrito) : carrito = []

function agregarProducto(e) {
  let productoClickeado = carrito.find((item) => item.id == e.target.id)

  if (productoClickeado) {
    productoClickeado.cantidad += 1
    actualizarCarrito(carrito)
    localStorage.setItem("Carrito", JSON.stringify(carrito))
  } else {
    productoClickeado = productos.find((item) => item.id == e.target.id)
    productoClickeado.cantidad = 1
    carrito.push(productoClickeado)
    localStorage.setItem("Carrito", JSON.stringify(carrito))
    actualizarCarrito(carrito)
  }

  resultado += productoClickeado.precio
  contadorCarrito.innerText = carrito.length
}

function eliminarProducto(e) {
  let productoEliminado = carrito.find((item) => `${item.id}` === e.currentTarget.id)
  let indiceDeProducto = carrito.indexOf(productoEliminado)
  carrito.splice(indiceDeProducto, 1)
  localStorage.setItem("Carrito", JSON.stringify(carrito))
  actualizarCarrito(carrito)
}

function actualizarCarrito(local) {
  cartContainer.innerHTML = ""
  for (const productoAgregado of local) {
    cartContainer.innerHTML += `<div class="d-flex justify-content-around align-items-center mt-3 p-4 items rounded border-bottom border-top" >
      <img class="rounded" src=${productoAgregado.img} width="100">
      <div class="ml-2"><span class="font-weight-bold d-block m-2">${productoAgregado.nombre}</span><span class="d-block ml-5 font-weight-bold">$${productoAgregado.precio}</span></div>
      <div class="ml-2 rounded"> <span class ="item-count rounded">${productoAgregado.cantidad}</span>  </div>
      <span class="eliminar-item" id="${productoAgregado.id}"><i class="fa fa-trash" aria-hidden="true"></i> </span>
  </div>`
  }

  let btnsEliminar = document.querySelectorAll(".eliminar-item")
  for (const btn of btnsEliminar) {
    btn.addEventListener("click", (e) => {
      eliminarProducto(e)
      swal("Eliminaste el producto de tu carrito", {
          icon: "error",
      });
    })
  }
  contadorCarrito.innerText = local.length
}

function vaciarCarrito(){
  let clearCart = document.querySelector("#clear")
  clearCart.addEventListener('click', () => {
    swal("Estas seguro de vaciar el carrito?", {
      icon: "warning",
      dangerMode: true,
      buttons: true,
    })
    .then((willDelete) => {
      if (willDelete) {
        localStorage.removeItem('Carrito')
        carrito = []
        cartContainer.innerHTML = ""
        resultado = 0
        contadorCarrito.innerText = 0
        swal("Haz vaciado tu carrito!", {
          icon: "success",
        });
      } else {
        swal("Tus productos siguen en el carrito!");
      }
    });
  })
}

//FILTRO
const filtro = document.querySelector("#priceFilter")
const priceValue = document.querySelector("#priceFilterValue")
filtro.addEventListener("change", () => {
  const productosFiltrados = productos.filter(
    (producto) => producto.precio < filtro.value
  )
  priceValue.innerText = filtro.value
  imprimirProductos(productosFiltrados)
})

//BUSCAR
const buscar = document.querySelector(".btnBuscar")
buscar.addEventListener("click", (e) => {
  e.preventDefault()
  const cadenaBuscar = document.querySelector("#buscar").value
  const productoBuscado = productos.find(
    (producto) => producto.nombre.toLowerCase() == cadenaBuscar.toLowerCase()
  )
  imprimirProductos([productoBuscado])
})


function reviews(){
  const reviews = document.querySelector('#reviews')
  fetch('https://jsonplaceholder.typicode.com/comments?_start=0&_limit=10')
  .then((response) => response.json())
  .then((data) => {
      data.forEach((post)=>{
          const div = document.createElement('div')
          div.innerHTML = `
          <p class="fw-semibold mb-0">${post.name}</p>
          <p>${post.body}</p>
          <hr/>
          `
          reviews.append(div)
      })
  })
}