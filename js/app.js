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
        unidades: unidades,
        precio: producto.precio,
        subtotal: producto.precio * unidades,
      });
    }

    guardarPedidoEnLocalStorage();
    mostrarCarrito();
  }

  function removerDelCarrito(nombreProducto) {
    carrito = carrito.filter((item) => item.nombre !== nombreProducto);
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
        <td><button class="btn btn-danger btn-remover" data-producto="${item.nombre}">Remover</button></td>
      `;
      tablaBody.appendChild(fila);
    });

    actualizarTotal();
    agregarEventListenersBotonesRemover();
  }

  function actualizarTotal() {
    const totalCarrito = calcularTotalCarrito().toFixed(2);
    btnComprar.textContent = `Comprar - Total: $${totalCarrito}`;
  }

  function calcularTotalCarrito() {
    return carrito.reduce((total, item) => total + item.subtotal, 0);
  }

  function agregarEventListenersBotonesRemover() {
    const botonesRemover = document.querySelectorAll(".btn-remover");
    botonesRemover.forEach((boton) => {
      boton.addEventListener("click", () => {
        const nombreProducto = boton.getAttribute("data-producto");
        removerDelCarrito(nombreProducto);
      });
    });
  }

  // Event listener para vaciar el carrito con SweetAlert de confirmación
  btnVaciarCarrito.addEventListener("click", function () {
    if (carrito.length === 0) {
      Swal.fire({
        title: "El carrito está vacío",
        text: "No hay productos en el carrito para vaciar",
        icon: "info",
        confirmButtonText: "Aceptar",
      });
      return;
    }

    Swal.fire({
      title: "¿Estás seguro de vaciar el carrito?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, vaciar carrito",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        carrito = [];
        guardarPedidoEnLocalStorage();
        mostrarCarrito();

        Swal.fire({
          title: "Carrito vaciado",
          text: "El carrito ha sido vaciado correctamente",
          icon: "success",
          confirmButtonText: "Aceptar",
        });
      }
    });
  });

  // Event listener para mostrar el SweetAlert con el total al presionar el botón "Comprar"
  btnComprar.addEventListener("click", function () {
    const totalCarrito = calcularTotalCarrito().toFixed(2);

    Swal.fire({
      title: "¿Estás seguro de realizar la compra?",
      text: `El total es: $${totalCarrito}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, comprar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#3085d6",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Gracias por su compra",
          text: `El total es: $${totalCarrito}`,
          icon: "success",
          confirmButtonText: "Aceptar",
        });
      }
    });
  });

  function guardarPedidoEnLocalStorage() {
    localStorage.setItem("pedidos", JSON.stringify(carrito));
  }

  function obtenerPedidosDeLocalStorage() {
    let pedidos = localStorage.getItem("pedidos");
    return pedidos ? JSON.parse(pedidos) : [];
  }

  // Cargar datos desde JSON local
  fetch("productos.json")
    .then((response) => response.json())
    .then((data) => {
      productos = data; // Array de objetos con los datos de los productos
      mostrarCarrito();
    })
    .catch((error) => console.error("Error al cargar los productos:", error));

  // Event listeners para los botones "Agregar al carrito"
  botonesAgregar.forEach((boton) => {
    boton.addEventListener("click", () => {
      const card = boton.closest(".card");
      const nombreProducto = card.querySelector(".card-title").textContent;
      const producto = productos.find((p) => p.nombre === nombreProducto);

      if (producto) {
        const unidades = parseInt(card.querySelector(".form-select").value);
        agregarAlCarrito(producto, unidades);
      }
    });
  });

});
