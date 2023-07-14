document.addEventListener("DOMContentLoaded", function() {
  const botonesAgregar = document.querySelectorAll(".btn-primary");
  const tablaBody = document.getElementById("Cuerpocarrito");
  const btnVaciarCarrito = document.getElementById("btnVaciarCarrito");

  botonesAgregar.forEach(function(boton) {
    boton.addEventListener("click", function() {
      const card = boton.closest(".card");
      const nombreProducto = card.querySelector(".card-title").textContent;
      const precioProducto = parseFloat(card.querySelector(".card-text").textContent.slice(1));
      const unidades = parseInt(card.querySelector(".form-select").value);
      const subtotal = precioProducto * unidades;

      // Verificar si el producto ya existe en la lista del carrito
      const filasExistentes = tablaBody.querySelectorAll("tr");
      let productoExistente = null;

      filasExistentes.forEach(function(fila) {
        const nombreFila = fila.querySelector("td:first-child").textContent;

        if (nombreFila === nombreProducto) {
          productoExistente = fila;
        }
      });

      if (productoExistente) {
        // Actualizar la cantidad y subtotal del producto existente
        const cantidadExistente = parseInt(productoExistente.querySelector("td:nth-child(2)").textContent);
        const subtotalExistente = parseFloat(productoExistente.querySelector("td:nth-child(3)").textContent.slice(1));

        const nuevaCantidad = cantidadExistente + unidades;
        const nuevoSubtotal = subtotalExistente + subtotal;

        productoExistente.querySelector("td:nth-child(2)").textContent = nuevaCantidad;
        productoExistente.querySelector("td:nth-child(3)").textContent = `$${nuevoSubtotal.toFixed(2)}`;
      } else {
        // Agregar un nuevo producto a la lista del carrito
        const fila = document.createElement("tr");
        fila.innerHTML = `
          <td>${nombreProducto}</td>
          <td>${unidades}</td>
          <td>$${subtotal.toFixed(2)}</td>
        `;
        tablaBody.appendChild(fila);
      }

      guardarPedidoEnLocalStorage(nombreProducto, unidades, subtotal);
    });
  });

  btnVaciarCarrito.addEventListener("click", function() {
    tablaBody.innerHTML = "";
    vaciarLocalStorage();
  });

  function guardarPedidoEnLocalStorage(nombre, cantidad, subtotal) {
    let pedidos = obtenerPedidosDeLocalStorage();

    // Verificar si el pedido ya existe en el Local Storage
    const pedidoExistente = pedidos.find(pedido => pedido.nombre === nombre);

    if (pedidoExistente) {
      // Actualizar la cantidad y subtotal del pedido existente
      pedidoExistente.cantidad += cantidad;
      pedidoExistente.subtotal += subtotal;
    } else {
      // Agregar un nuevo pedido al arreglo
      pedidos.push({ nombre, cantidad, subtotal });
    }

    localStorage.setItem("pedidos", JSON.stringify(pedidos));
  }

  function obtenerPedidosDeLocalStorage() {
    let pedidos = localStorage.getItem("pedidos");
    
    if (pedidos === null) {
      return [];
    } else {
      return JSON.parse(pedidos);
    }
  }

  function vaciarLocalStorage() {
    localStorage.removeItem("pedidos");
  }
});
