// JavaScript
document.addEventListener("DOMContentLoaded", function () {
  const botonesAgregar = document.querySelectorAll(".btn-primary");
  const tablaBody = document.getElementById("Cuerpocarrito");
  const btnVaciarCarrito = document.getElementById("btnVaciarCarrito");
  const totalCarrito = document.getElementById("totalCarrito"); // Agrega el elemento HTML para mostrar el total

  let carrito = obtenerPedidosDeLocalStorage();

  function agregarAlCarrito(producto, unidades) {
    const productoExistente = carrito.find((item) => item.nombre === producto.nombre);

    if (productoExistente) {
      productoExistente.unidades += unidades;
      productoExistente.subtotal += producto.precio * unidades;
    } else {
      carrito.push({
        nombre: producto.nombre,
        unidades: unidades,
        subtotal: producto.precio * unidades,
      });
    }

    guardarPedidoEnLocalStorage();
    mostrarCarrito();
  }

  function agregarEventListenersBotonesRemover() {
    const botonesRemover = document.querySelectorAll(".btn-remover");
    botonesRemover.forEach((boton) => {
      boton.addEventListener("click", () => {
        const nombreProducto = boton.getAttribute("data-nombre");
        removerDelCarrito(nombreProducto);
      });
    });
  }

  function removerDelCarrito(nombreProducto) {
    const productoExistente = carrito.find((item) => item.nombre === nombreProducto);

    if (productoExistente) {
      if (productoExistente.unidades > 1) {
        productoExistente.unidades -= 1;
        productoExistente.subtotal -= productoExistente.precio;
      } else {
        carrito = carrito.filter((item) => item.nombre !== nombreProducto);
      }
    }

    guardarPedidoEnLocalStorage();
    mostrarCarrito();
  }

  function mostrarCarrito() {
    tablaBody.innerHTML = "";

    carrito.forEach((item) => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${item.nombre}</td>
        <td>${item.unidades}</td>
        <td>$${item.subtotal.toFixed(2)}</td>
        <td><button class="btn btn-danger btn-remover" data-nombre="${item.nombre}">Remover</button></td>
      `;
      tablaBody.appendChild(fila);
    });

    agregarEventListenersBotonesRemover();
    actualizarTotal();
  }

  function actualizarTotal() {
    const total = carrito.reduce((acc, item) => acc + item.subtotal, 0);
    totalCarrito.textContent = `$${total.toFixed(2)}`;
  }

  botonesAgregar.forEach(function (boton) {
    boton.addEventListener("click", function () {
      const card = boton.closest(".card");
      const nombreProducto = card.querySelector(".card-title").textContent;
      const producto = productos.find((p) => p.nombre === nombreProducto);

      if (producto) {
        const unidades = parseInt(card.querySelector(".form-select").value);
        agregarAlCarrito(producto, unidades);
      }
    });
  });

  tablaBody.addEventListener("click", function (event) {
    if (event.target.classList.contains("btn-remover")) {
      const nombreProducto = event.target.getAttribute("data-nombre");
      removerDelCarrito(nombreProducto);
    }
  });

  btnVaciarCarrito.addEventListener("click", function () {
    carrito = [];
    guardarPedidoEnLocalStorage();
    mostrarCarrito();
  });

  function guardarPedidoEnLocalStorage() {
    localStorage.setItem("pedidos", JSON.stringify(carrito));
  }

  function obtenerPedidosDeLocalStorage() {
    let pedidos = localStorage.getItem("pedidos");
    return pedidos ? JSON.parse(pedidos) : [];
  }

  // Cargar datos desde JSON local
  let productos = [];
  fetch("productos.json")
    .then((response) => response.json())
    .then((data) => {
      productos = data; // Array de objetos con los datos de los productos
      mostrarCarrito();
    })
    .catch((error) => console.error("Error al cargar los productos:", error));
});
