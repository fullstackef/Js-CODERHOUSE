document.addEventListener("DOMContentLoaded", function () {
  const botonesAgregar = document.querySelectorAll(".btn-primary");
  const tablaBody = document.getElementById("Cuerpocarrito");
  const btnVaciarCarrito = document.getElementById("btnVaciarCarrito");
  const btnComprar = document.getElementById("btnComprar");

  let carrito = obtenerPedidosDeLocalStorage();

  function agregarAlCarrito(producto, unidades) {
    const productoExistente = carrito.find((item) => item.nombre === producto.nombre);

    if (productoExistente) {
      productoExistente.unidades += unidades;
      productoExistente.subtotal = productoExistente.unidades * productoExistente.precio;
    } else {
      carrito.push({
        nombre: producto.nombre,
        precio: producto.precio,
        unidades: unidades,
        subtotal: producto.precio * unidades,
      });
    }

    guardarPedidoEnLocalStorage();
    mostrarCarrito();
  }

  function removerDelCarrito(nombreProducto) {
    carrito = carrito.map((item) => {
      if (item.nombre === nombreProducto) {
        if (item.unidades > 1) {
          item.unidades -= 1;
          item.subtotal = item.unidades * item.precio;
        } else {
          return null;
        }
      }
      return item;
    }).filter(Boolean);

    guardarPedidoEnLocalStorage();
    mostrarCarrito();
  }

  function mostrarCarrito() {
    tablaBody.innerHTML = "";
    let totalCarrito = 0;

    carrito.forEach((item) => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${item.nombre}</td>
        <td>${item.unidades}</td>
        <td>$${item.subtotal.toFixed(2)}</td>
        <td><button class="btn btn-danger btn-remover" data-producto="${item.nombre}">Remover</button></td>
      `;
      tablaBody.appendChild(fila);

      totalCarrito += item.subtotal;
    });

    btnComprar.textContent = `Comprar - Total: $${totalCarrito.toFixed(2)}`;

    agregarEventListenersBotonesRemover();
    actualizarTotal();
  }

  function calcularTotalCarrito() {
    return carrito.reduce((total, item) => total + item.subtotal, 0);
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
      const nombreProducto = event.target.dataset.producto;
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

  function vaciarLocalStorage() {
    localStorage.removeItem("pedidos");
  }

  // Cargar datos desde JSON local
  let productos = [];
  fetch("productos.json")
    .then((response) => response.json())
    .then((data) => {
      productos = data;
      mostrarCarrito();
    })
    .catch((error) => console.error("Error al cargar los productos:", error));

  // Event listener para mostrar el alert con el total al presionar el botón "Comprar"
  btnComprar.addEventListener("click", function () {
    alert(`Gracias por su compra, el total es: $${calcularTotalCarrito().toFixed(2)}`);
  });
});
