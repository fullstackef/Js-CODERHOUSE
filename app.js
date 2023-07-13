const PRODUCTOS = [
    { nombre: "Vino malbec", precio: 1500 },
    { nombre: "Vino malbec Reserva", precio: 5500 },
    { nombre: "Vino malbec Gran Reserva", precio: 8000 }
  ];
  
  let carrito = [];
  let agregar = "si";
  
  function calcularTotal() {
    return carrito.reduce((acumulado, producto) => acumulado + producto.precio * producto.cantidad, 0);
  }
  
  function agregarAlCarrito(opcion, cantidad) {
    const productoElegido = { ...PRODUCTOS[opcion - 1], cantidad: cantidad };
    carrito.push(productoElegido);
  }
  
  function mostrarResumenFactura() {
    let resumen = "Resumen de tu factura:\n\n";
    carrito.forEach((producto, index) => {
      const subtotal = producto.precio * producto.cantidad;
      resumen += `${index + 1}. ${producto.nombre} x ${producto.cantidad} - Subtotal: $${subtotal}\n`;
    });
    return resumen;
  }
  
  function mostrarFactura() {
    const totalAPagar = calcularTotal();
    const resumenFactura = mostrarResumenFactura();
  
    alert("Gracias por tu compra. Aquí tienes el resumen de tu factura:\n\n" + resumenFactura + "\nTotal a pagar: $" + totalAPagar);
  }
  
  function guardarCarritoEnLocalStorage() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }
  
  function cargarCarritoDesdeLocalStorage() {
    const carritoGuardado = localStorage.getItem("carrito");
    if (carritoGuardado) {
      carrito = JSON.parse(carritoGuardado);
    }
  }
  
  alert("Bienvenido a Vinoteca los Amigos. Pulsa ACEPTAR para agregar a tu carrito de compra");
  
  // Cargar carrito previo desde localStorage
  cargarCarritoDesdeLocalStorage();
  
  while (agregar.toLowerCase() === "si") {
    const opcion = parseInt(prompt("¿Qué vino deseas elegir?\n\n" +
      "1- Vino malbec: $" + PRODUCTOS[0].precio + "\n" +
      "2- Vino malbec Reserva: $" + PRODUCTOS[1].precio + "\n" +
      "3- Vino malbec Gran Reserva: $" + PRODUCTOS[2].precio + "\n"));
  
    if (opcion >= 1 && opcion <= 3) {
      const cantidad = parseInt(prompt("Ingrese la cantidad de vinos elegidos"));
      agregarAlCarrito(opcion, cantidad);
    } else {
      alert("Ingrese una opción correcta");
      continue;
    }
  
    agregar = prompt("¿Deseas agregar otro vino? Si / NO");
  }
  
  // Guardar carrito en localStorage
  guardarCarritoEnLocalStorage();
  
  mostrarFactura();
  