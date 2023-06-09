

const PRODUCTO1 = 1500
const PRODUCTO2 = 5500
const PRODUCTO3 = 8000
let cantidad;
let total = 0;
let opcion;
let agregar = "si";

function calculo(acumulado, precio, cantidad) {
    return acumulado + precio * cantidad;
}

alert("Bienvenido a Vinoteca los Amigos, \nPulse ACEPTAR para agregar a su carrito de compra")

while (agregar.toLowerCase() === "si") {
    opcion = parseInt(prompt("¿Que vino desdeas elegir?" + "\n" + "\n" +
        "1- Vino malbec:$" + PRODUCTO1 + "\n" +
        "2- Vino malbec Reserva:$" + PRODUCTO2 + "\n" +
        "3- Vino malbec Gran Reserva:$" + PRODUCTO3 + "\n"));

    switch (opcion) {
        case 1:
            cantidad = parseInt(prompt("Ingrese la cantidad de vinos elegidos"));
            total = calculo(total, PRODUCTO1, cantidad);
            break;

        case 2:
            cantidad = parseInt(prompt("Ingrese la cantidad de vinos elegidos"));
            total = calculo(total, PRODUCTO2, cantidad);
            break;

        case 3:
            cantidad = parseInt(prompt("Ingrese la cantidad de vinos elegidos"));
            total = calculo(total, PRODUCTO3, cantidad);
            break;

        default:
            alert("Ingrese una opcion correcta");
            continue;
    }
    agregar = prompt("¿Deseas agregar un vino mas? Si / NO")
}
alert("El total a pagar es: $" + total)
